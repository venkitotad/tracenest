# TraceNest

TraceNest is an early-stage, local-first diagnostics project designed to help developers investigate failures across full-stack applications.

## Problem

Debugging application failures often requires checking frontend requests, backend logs, and database operations separately. Correlating these events manually makes troubleshooting slower.

## Current Implementation

- Express.js API built with TypeScript
- Unique request IDs for incoming requests
- Structured request and failure logs
- Intentional failure endpoint for testing
- PostgreSQL connectivity and query timing
- Docker Compose configuration for local PostgreSQL

## Tech Stack

- Node.js 22
- TypeScript
- Express.js
- PostgreSQL
- Docker Compose

## Development Setup

### Prerequisites

- Node.js 22 or compatible version
- Docker Desktop

### Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `apps/demo-api/.env` with your local configuration:

   ```env
   PORT=4000
   DATABASE_URL=postgresql://tracenest:tracenest_dev@localhost:5434/tracenest_demo
   ```

3. Start PostgreSQL:

   ```bash
   docker compose up -d
   ```

4. Start the API:

   ```bash
   npm run dev
   ```

5. Check the API at `http://localhost:4000/health`.

## Roadmap

- Automatic request-context propagation
- PostgreSQL query instrumentation
- Unified diagnostic traces
- React dashboard
- Automated tests and documentation

## Project Status

TraceNest is under active development. The current implementation establishes the API and PostgreSQL foundation. Automatic end-to-end tracing and the dashboard are planned features, not yet implemented.