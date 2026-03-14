import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-9ff17bde/health", (c) => {
  return c.json({ status: "ok" });
});

// KV store endpoints
app.post("/make-server-9ff17bde/kv/set", async (c) => {
  try {
    const { key, value } = await c.req.json();
    if (!key) {
      return c.json({ error: "Key is required" }, 400);
    }
    await kv.set(key, value);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error in /kv/set:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-9ff17bde/kv/get", async (c) => {
  try {
    const key = c.req.query("key");
    if (!key) {
      return c.json({ error: "Key is required" }, 400);
    }
    const value = await kv.get(key);
    return c.json({ value });
  } catch (error) {
    console.error("Error in /kv/get:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.delete("/make-server-9ff17bde/kv/delete", async (c) => {
  try {
    const key = c.req.query("key");
    if (!key) {
      return c.json({ error: "Key is required" }, 400);
    }
    await kv.del(key);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error in /kv/delete:", error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);