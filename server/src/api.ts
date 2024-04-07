

module.exports.handler = async (event: any) => {
    console.log(event);
    return {
        statusCode: 200,
        body: JSON.stringify({
        message: 'Hello World',
        }),
    };
}