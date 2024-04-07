import { DynamoDBClient, PutItemCommand, QueryCommand, QueryCommandInput, ScanCommand } from "@aws-sdk/client-dynamodb";
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
    data: Movie[];
    hitCounter: number;
}

const CACHE_TTL = 1000 * 2 * 60; // 2 minutes
const client = new DynamoDBClient({});

export default class MoviesController {

    public async getMovies(query: string, page: number): Promise<any> {

        // Step 1. Check the cache
        const fetchedFromCache = await this.fetchFromCache(query, page);

        // Step 2. If in cache: return result, increment cache hit counter

        // Step 3. If not in cache: fetch data from API, filter and transform data
        const fetchedFromApi: MovieApiResponse = await this.fetchFromApi(query);
        
        // Step 4. Put result in cache with increased hit counter, removing previous records if necessary
        // await this.putInCache(fetchedFromApi, query, 1, 0);

        // Step 5. Return result

        return {
            fetchedFromApi,
        };
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
            // Send the query command to DynamoDB
            const command = new ScanCommand(params);
            const result = await client.send(command);

            console.log(result);
    
            // Return the queried items
            return null;
        } catch (error) {
            console.error('Error querying DynamoDB table:', error);
            throw error;
        }
    }

    private async fetchFromApi(query: string): Promise<MovieApiResponse> {

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

        const response = await fetch(`${url}?query=${query}`, { headers });
        
        if (response.ok) {
            return await response.json();
        }
        return null;
    }

    private async putInCache(data: Movie[], query: string, page: number, hitCount: number = 0): Promise<any> {
        const command = new PutItemCommand({

            TableName: process.env.DB_TABLE_NAME,
            Item: {
                "id": { S: uuidv4() },
                "query": { S: query },
                "createdAt": { N: String(Date.now()) }, // TODO: don't reset createdAt if previous was cached
                "page": { N: String(page) },
                data: { S: JSON.stringify(data) },
                hitCounter: { N: String(hitCount) }
            },
        })
        return await client.send(command);
    }
}