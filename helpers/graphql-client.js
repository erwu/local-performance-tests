
import http from 'k6/http';
import { check } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';
import { config } from '../config/config.js';

export const graphqlDuration = new Trend('graphql_duration');
export const graphqlErrors = new Counter('graphql_errors');
export const graphqlSuccess = new Rate('graphql_success');

export function graphqlRequest(query, variables, operationName) {
    if (!config.baseUrl) {
        throw new Error('Missing BASE_URL environment variable');
    }

    const isLocalEndpoint =
        config.baseUrl.startsWith('http://localhost:') ||
        config.baseUrl.startsWith('http://127.0.0.1:');

    if (!isLocalEndpoint) {
        throw new Error(
            'External endpoints are blocked. Use a local test server.'
        );
    }

    const payload = { operationName, variables, query };

    const response = http.post(
        config.baseUrl,
        JSON.stringify(payload),
        {
            headers: config.headers,
            tags: { operation: operationName },
            timeout: '10s',
        }
    );

    let body = null;

    try {
        body = response.json();
    } catch (error) {
        console.error('Invalid JSON response');
        console.error(`HTTP status: ${response.status}`);
        console.error(`Content-Type: ${response.headers['Content-Type']}`);
        console.error(`Response body: ${response.body.substring(0, 1000)}`);
    }

    const hasGraphqlErrors =
        body === null ||
        (Array.isArray(body.errors) && body.errors.length > 0);

    graphqlDuration.add(response.timings.duration, {
        operation: operationName,
    });

    graphqlErrors.add(hasGraphqlErrors ? 1 : 0, {
        operation: operationName,
    });

    graphqlSuccess.add(!hasGraphqlErrors);

    check(response, {
        'HTTP status is 200': r => r.status === 200,
        'GraphQL response is valid': () => body !== null,
        'GraphQL has no errors': () => !hasGraphqlErrors,
    });

    return { response, body };
}
