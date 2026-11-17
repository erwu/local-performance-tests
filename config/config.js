export const config = {
    baseUrl: __ENV.BASE_URL || 'http://localhost:4000/graphql',

    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
};