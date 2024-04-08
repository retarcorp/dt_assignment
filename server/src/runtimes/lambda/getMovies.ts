import 'dotenv/config';
import MoviesService from '../../services/movies.service';
import { logger } from '../../../utils/logger';



module.exports.handler = async (event: any) => {

    const query = event?.queryStringParameters?.query || '';
    const page = Number(event?.queryStringParameters?.page) || 1;

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': 2592000
    }

    const service = new MoviesService();
    try {
        const result = await service.getMovies(query, page);
        return {
            statusCode: 200,
            body: JSON.stringify({
                result
            }),
            headers

        };
    } catch (e) {
        logger.error(e);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: e.message
            }),
            headers
        };
    }
}