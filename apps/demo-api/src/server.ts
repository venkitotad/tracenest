
import "dotenv/config";
import express from "express";
import { randomUUID } from "node:crypto";
import { pool } from "./db.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(express.json());

// Assign a unique ID to every request.
app.use((req, res, next) => {
  const requestId = randomUUID();

  res.setHeader("X-Request-Id", requestId);

  console.log({
    requestId,
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString(),
  });

  next();
});

// Root endpoint.
app.get("/", (_req, res) => {
  res.json({
    name: "TraceNest",
    service: "tracenest-demo-api",
    status: "running",
    endpoints: [
      "/health",
      "/debug/failure",
      "/debug/database",
    ],
  });
});

// Health check.
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "tracenest-demo-api",
  });
});

// Intentional failure for testing.
app.get("/debug/failure", (_req, res) => {
  const requestId = res.getHeader("X-Request-Id");

  console.error({
    event: "DEMO_FAILURE",
    requestId,
    message: "Intentional failure for TraceNest testing",
    timestamp: new Date().toISOString(),
  });

  res.status(500).json({
    error: "DEMO_FAILURE",
    message: "Intentional failure for TraceNest testing",
    requestId,
  });
});

// Database connectivity test.
app.get("/debug/database", async (_req, res) => {
  const requestId = res.getHeader("X-Request-Id");
  const startedAt = performance.now();

  try {
    const result = await pool.query(
      "SELECT NOW() AS server_time"
    );

    const durationMs = Number(
      (performance.now() - startedAt).toFixed(2)
    );

    console.log({
      event: "DATABASE_QUERY_SUCCESS",
      requestId,
      durationMs,
    });

    res.json({
      status: "ok",
      requestId,
      durationMs,
      databaseTime: result.rows[0].server_time,
    });
  } catch (error) {
    console.error({
      event: "DATABASE_QUERY_FAILURE",
      requestId,
      message: error instanceof Error
        ? error.message
        : "Unknown database error",
    });

    res.status(500).json({
      error: "DATABASE_ERROR",
      requestId,
    });
  }
});

// IMPORTANT: Keep the 404 handler last.
app.use((_req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "The requested endpoint does not exist.",
  });
});

app.listen(PORT, () => {
  console.log(`TraceNest API running at http://localhost:${PORT}`);
});
