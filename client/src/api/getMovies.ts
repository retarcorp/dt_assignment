
export const getMovies = async (query: string, page: number) => {
    try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '?query=' + query + '&page=' + page)
        const result = await response.json();
        return result;
    } catch (e) {
        console.error(e);
        throw new Error('Client request encountered a problem with connecting to the server.')
    }
}