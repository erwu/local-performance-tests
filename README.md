# Local Performance Testing Framework

A local performance testing framework built with **k6, JavaScript, GraphQL, Node.js, and GitHub Actions**.

The project demonstrates how to design, execute, and analyze different performance testing scenarios against a locally hosted GraphQL API.

All performance tests run against a local mock server. No external production services are targeted.

## Project Overview

The framework includes several types of performance tests:

- **Smoke Test** – verifies basic API functionality and response correctness.
- **Load Test** – evaluates system behavior under a gradually increasing user load.
- **Stress Test** – evaluates system behavior under progressively higher concurrent load.
- **Breaking Point Test** – explores behavior at higher concurrency levels.
- **High Concurrency Test** – runs a scenario with up to 1,000 virtual users.
- **Constant Arrival Rate Test** – verifies the ability to handle a predefined request arrival rate.

The project also includes a GitHub Actions CI workflow that automatically starts the local GraphQL server and executes the smoke test.

## Technology Stack

| Technology | Purpose |
|---|---|
| k6 | Performance and load testing |
| JavaScript | Test scripts and configuration |
| Node.js | Local mock API runtime |
| Express | HTTP server |
| GraphQL | API query interface |
| express-graphql | GraphQL server middleware |
| GitHub Actions | Continuous Integration |
| Git | Version control |

## Project Structure

```text
local-performance-tests/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── config/
│   ├── config.js
│   └── rate-params.js
│
├── graphql/
│   └── queries.js
│
├── helpers/
│   └── graphql-client.js
│
├── results/
│
├── server/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── tests/
│   ├── smoke-test.js
│   ├── load-test.js
│   ├── stress-test.js
│   ├── breaking-point-test.js
│   ├── stress-test-1000.js
│   └── constant-rate-test.js
│
└── .gitignore
```

## Directory and File Description

### `config/`

Contains the project configuration.

- `config.js` – defines the GraphQL endpoint and HTTP request headers. The default endpoint points to the local server.
- `rate-params.js` – contains sample GraphQL input parameters used by the tests.

### `graphql/`

- `queries.js` – stores GraphQL queries used by the performance tests.

### `helpers/`

- `graphql-client.js` – shared GraphQL HTTP client used by the test scenarios.

The client:
- Sends HTTP POST requests.
- Records request duration.
- Tracks GraphQL errors and successful requests.
- Validates HTTP and GraphQL responses.
- Blocks external endpoints. Only local endpoints (`localhost` and `127.0.0.1`) are allowed.

### `server/`

Contains the local mock GraphQL API.

- `server.js` – starts the Express and GraphQL server.
- `package.json` – defines Node.js dependencies.
- `package-lock.json` – locks dependency versions.

The mock server provides a controlled environment for testing without sending load to external services.

### `tests/`

Contains individual k6 performance scenarios.

| Test file | Scenario |
|---|---|
| `smoke-test.js` | Basic API validation |
| `load-test.js` | Gradually increasing load |
| `stress-test.js` | Increasing concurrent virtual users |
| `breaking-point-test.js` | High-concurrency testing |
| `stress-test-1000.js` | High concurrency up to 1,000 VUs |
| `constant-rate-test.js` | Constant arrival rate of 100 requests per second |

### `.github/workflows/ci.yml`

Defines the GitHub Actions CI pipeline.

The workflow is triggered by:
- Pushes to `main`.
- Pull requests targeting `main`.
- Manual execution using `workflow_dispatch`.

The pipeline:
1. Checks out the repository.
2. Sets up Node.js.
3. Installs server dependencies.
4. Starts the local GraphQL server.
5. Checks whether the server is ready.
6. Installs k6.
7. Executes the smoke test.
8. Uploads test results as a GitHub Actions artifact.

Test result artifacts are retained for 30 days.

## Running the Project Locally

### Requirements

- Node.js
- k6
- Git

### 1. Install server dependencies

Open a terminal:

```powershell
cd server
npm ci
```

### 2. Start the local GraphQL server

```powershell
node server.js
```

The server runs at:

```text
http://localhost:4000/graphql
```

Keep this terminal open.

### 3. Run a performance test

Open a second terminal in the project root.

For example:

```powershell
k6 run .\tests\smoke-test.js
```

Other scenarios can be executed in the same way:

```powershell
k6 run .\tests\load-test.js
k6 run .\tests\stress-test.js
k6 run .\tests\breaking-point-test.js
k6 run .\tests\stress-test-1000.js
k6 run .\tests\constant-rate-test.js
```

## Performance Metrics

The framework collects and validates several performance indicators:

| Metric | Description |
|---|---|
| `http_req_duration` | HTTP request duration |
| `http_reqs` | Total number of HTTP requests |
| `http_req_failed` | Percentage of failed HTTP requests |
| `vus` | Number of active virtual users |
| `vus_max` | Maximum number of virtual users |
| `iterations` | Number of completed iterations |
| `dropped_iterations` | Iterations that could not be started |
| `graphql_duration` | GraphQL request duration |
| `graphql_errors` | Number of GraphQL errors |
| `graphql_success` | GraphQL request success rate |

The tests also use thresholds to validate expected performance conditions.

## CI Results

After a successful GitHub Actions execution:

1. Open the repository's **Actions** tab.
2. Select the latest workflow run.
3. Find the **Artifacts** section.
4. Download `k6-smoke-test-results`.

The artifact contains files generated in the `results/` directory during the smoke test.

## Important Notes

This project uses a local mock GraphQL API.

Performance results depend on the local machine, the mock server implementation, and the test configuration.

They should not be interpreted as measurements of a real production API or as a prediction of production system capacity.

The project is intended for demonstrating performance testing techniques, k6 scenarios, GraphQL request validation, metrics collection, and CI automation.

## Project Goals

- Build reusable performance testing components.
- Implement different load and stress testing strategies.
- Collect and validate performance metrics.
- Automate smoke testing with GitHub Actions.
- Practice performance testing in a controlled local environment.