
const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const {
    buildSchema
} = require('graphql');

// GraphQL schema
const schema = buildSchema(`
    type Category {
        value: String
        count: Int
    }

    type HotelRating {
        value: String
        count: Int
    }

    type Properties {
        categories: [Category]
        hotelRatings: [HotelRating]
        ratesCount: Int
    }

    input DateRange {
        from: String
        to: String
    }

    input Duration {
        min: Int
        max: Int
    }

    input RateParams {
        destinationRegions: [String]
        departureDate: DateRange
        duration: Duration
        adultsNumber: Int
        currency: String
        language: String
        supplier: String
    }

    type Query {
        properties(rateParams: RateParams!): Properties
    }
`);

// Mock data
const root = {
    properties: ({ rateParams }) => {

        console.log(
            'GraphQL request:',
            rateParams.destinationRegions
        );

        return {
            categories: [
                { value: '4', count: 120 },
                { value: '5', count: 80 }
            ],

            hotelRatings: [
                { value: '4.5', count: 60 },
                { value: '5', count: 40 }
            ],

            ratesCount: 200
        };
    }
};

const app = express();

app.use(
    '/graphql',
    express.json(),
    graphqlHTTP({
        schema,
        rootValue: root,
        graphiql: true
    })
);

app.listen(4000, () => {
    console.log(
        'GraphQL server running at http://localhost:4000/graphql'
    );
});
