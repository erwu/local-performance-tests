
import { check } from 'k6';

import { graphqlRequest } from '../helpers/graphql-client.js';
import { GET_RATES_COUNT } from '../graphql/queries.js';
import { rateParams } from '../config/rate-params.js';

// Test configuration
export const options = {
    vus: 1,
    iterations: 1,

    thresholds: {
        graphql_duration: ['p(95)<1000'],
        graphql_success: ['rate>0.99'],
        graphql_errors: ['count<1'],
    },
};

// Main test scenario
export default function () {

    const result = graphqlRequest(
        GET_RATES_COUNT,
        { rateParams },
        'GetRatesCountQuery'
    );

    if (result.body) {

        const properties =
            result.body.data?.propertiesWithCount;

        // Validate GraphQL response
        check(properties, {

            'properties data exists': p =>
                p !== null && p !== undefined,

            'ratesCount exists': p =>
                typeof p?.ratesCount === 'number',

        });

        // Display number of available rates
        if (properties) {
            console.log(
                `Rates count: ${properties.ratesCount}`
            );
        }
    }
}

// Export test summary to JSON
export function handleSummary(data) {

    return {
        'results/smoke-test-summary.json':
            JSON.stringify(data, null, 2),
    };
}
