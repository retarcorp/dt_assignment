import { DeleteItemCommand, DynamoDBClient, PutItemCommand, QueryCommand, QueryCommandInput, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import * as SSM from '@aws-sdk/client-ssm';

export type Movie = {
    id: number;
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    title: string;
    vote_average: number;
    vote_count: number;
    video: boolean;
    poster_path: string;
} 

export type MovieApiResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export type MovieDBResponse = {
    id: string;
    query: string;
    createdAt: number;
    page: number;
    totalPages: number;
    totalResults: number;
    data: Movie[];
    hitCounter: number;
}

export type MoviesFetchResult = {
    items: Movie[];
    hitCounter: number;
    fromCache: boolean;
    cachedAt: number;
    page: number;
    totalPages: number;
    totalResults: number;
}

const CACHE_TTL = 1000 * 2 * 60; // 2 minutes
const client = new DynamoDBClient({});

export default class MoviesController {

    public async getMovies(query: string, page: number): Promise<MoviesFetchResult> {

        // Step 1. Check the cache
        const fetchedFromCache = await this.fetchFromCache(query, page);

        // Step 2. If in cache: return result, increment cache hit counter
        if (fetchedFromCache) {
            await this.updateCacheHitCounter(fetchedFromCache.id, fetchedFromCache.hitCounter + 1);
            return {
                items: fetchedFromCache.data,
                hitCounter: fetchedFromCache.hitCounter + 1,
                fromCache: true,
                cachedAt: fetchedFromCache.createdAt,
                page: fetchedFromCache.page,
                totalPages: fetchedFromCache.totalPages,
                totalResults: fetchedFromCache.totalResults,
            }
        }


        // Step 3. If not in cache: fetch data from API, filter and transform data
        const fetchedFromApi: MovieApiResponse = await this.fetchFromApi(query, page);
        const response = {
            items: fetchedFromApi.results,
            hitCounter: 0,
            fromCache: false,
            cachedAt: Date.now(),
            page: fetchedFromApi.page,
            totalPages: fetchedFromApi.total_pages,
            totalResults: fetchedFromApi.total_results,
        }
        
        // Step 4. Put result in cache with increased hit counter, removing previous records if necessary
        await this.putInCache(
            query,
            page,
            response.items,
            response.totalPages,
            response.totalResults,
        );

        // Step 5. Return result

        return response;
    }

    private async fetchFromCache(query: string, page: number): Promise<MovieDBResponse | null> {

        const currentTime = Date.now() - CACHE_TTL;

        const params: QueryCommandInput = {
            TableName: process.env.DB_TABLE_NAME,
            FilterExpression: '#query = :query AND #page = :page AND #createdAt > :time',
            ExpressionAttributeNames: {
                '#query': 'query',
                '#page': 'page',
                '#createdAt': 'createdAt'
            },
            ExpressionAttributeValues: {
                ':query': { S: query },
                ':page': { N: String(page) },
                ':time': { N: String(currentTime) }
            },
        };
    
        try {
            const command = new ScanCommand(params);
            const result = await client.send(command);

            if (result.Items && result.Items.length > 0) {
                return {
                    id: result.Items[0].id.S,
                    query: result.Items[0].query.S,
                    createdAt: Number(result.Items[0].createdAt.N),
                    page: Number(result.Items[0].page.N),
                    totalPages: Number(result.Items[0].totalPages.N),
                    totalResults: Number(result.Items[0].totalCount.N),
                    data: JSON.parse(result.Items[0].data.S),
                    hitCounter: Number(result.Items[0].hitCounter.N),
                }
            }
    
            return null;
        } catch (error) {
            console.error('Error querying DynamoDB table:', error);
            throw error;
        }
    }

    private async fetchFromApi(query: string, page: number = 1): Promise<MovieApiResponse> {

        const command = new SSM.GetParameterCommand({
            Name: '/dt_assignment/read_api_key'
        })
        const ssmClient = new SSM.SSMClient({});
        const { Parameter: { Value: key } } = await ssmClient.send(command);

        const url = `https://api.themoviedb.org/3/search/movie`
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${key}`
        }

        const response = await fetch(`${url}?query=${query}&page=${page}`, { headers });
        
        if (response.ok) {
            return await response.json();
        }
        return null;
    }

    private async putInCache(query: string, page: number, data: Movie[], totalPages: number, totalCount: number, createdAt: number = Date.now(), hitCount: number = 0): Promise<any> {
        const command = new PutItemCommand({

            TableName: process.env.DB_TABLE_NAME,
            Item: {
                "id": { S: uuidv4() },
                "query": { S: query },
                "createdAt": { N: String(createdAt) },
                "page": { N: String(page) },
                totalCount: { N: String(totalCount) },
                totalPages: { N: String(totalPages) },
                data: { S: JSON.stringify(data) },
                hitCounter: { N: String(hitCount) }
            },
        })
        return await client.send(command);
    }

    private async updateCacheHitCounter(id: string, hitCount: number): Promise<any> {
        const command = new UpdateItemCommand({
            Key:{
                "id": { S: id }
            },
            TableName: process.env.DB_TABLE_NAME,
            UpdateExpression: "set hitCounter = :c",
            ExpressionAttributeValues:{
                ":c": { N: String(hitCount) }
            },
            ReturnValues: "UPDATED_NEW"
        })
        return await client.send(command);
    }

    public async clearCache(): Promise<any> {
        const command = new ScanCommand({
            TableName: process.env.DB_TABLE_NAME
        });
        const result = await client.send(command);
        if (result.Items && result.Items.length > 0) {
            for (const item of result.Items) {
                await client.send(new DeleteItemCommand({
                    TableName: process.env.DB_TABLE_NAME,
                    Key: {
                        "id": item.id
                    }
                }))
            }
        }
    }

}