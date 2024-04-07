import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});


module.exports.handler = async (event: any) => {

    const data = {};
    const query = "";

    const command = new PutItemCommand({

        TableName: process.env.DB_TABLE_NAME,
        Item: {
            "id": { S: uuidv4() },
            "query": { S: query },
            "createdAt": { N: String(Date.now()) },
            data: { S: JSON.stringify(data) },
            hitCounter: { N: "0" }
        },
    })
    const result = await client.send(command);
    console.log(result);

    // Step 1. Check the cache
    // Step 2. If in cache: return result, increment cache hit counter
    // Step 3. If not in cache: fetch data from API, filter and transform data
    // Step 4. Put result in cache with increased hit counter, removing previous records if necessary
    // Step 5. Return result

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello World',
            result
        }),
    };
}