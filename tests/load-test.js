
import { check } from 'k6';
import { graphqlRequest } from '../helpers/graphql-client.js';
import { GET_RATES_COUNT } from '../graphql/queries.js';
import { rateParams } from '../config/rate-params.js';

export const options = {
    stages: [
        { duration: '15s', target: 2 },
        { duration: '30s', target: 5 },
        { duration: '15s', target: 0 },
    ],

    thresholds: {
        graphql_duration: ['p(95)<1000'],
        graphql_success: ['rate>0.99'],
        graphql_errors: ['count<1'],
    },
};

export default function () {
    const result = graphqlRequest(
        GET_RATES_COUNT,
        { rateParams },
        'GetRatesCountQuery'
    );

    if (result.body) {
        const properties = result.body.data?.propertiesWithCount;

        check(properties, {
            'properties data exists': p =>
                p !== null && p !== undefined,
            'ratesCount exists': p =>
                typeof p?.ratesCount === 'number',
        });
    }
}
