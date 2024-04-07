import 'dotenv/config';
import MoviesController from "./controllers/movies.controller";



module.exports.handler = async (event: any) => {

    const query = event?.queryStringParameters?.query || '';
    const page = Number(event?.queryStringParameters?.page) || 1;

    const controller = new MoviesController();
    const result = await controller.getMovies(query, page);

    return {
        statusCode: 200,
        body: JSON.stringify({
            result
        }),
    };
}