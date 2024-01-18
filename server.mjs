import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady } from "@remix-run/node";
import express from "express";
import * as build from "./build/index.js";

// ========== Setup ========== //

// Create Express server
const server = express();
const PORT = process.env.PORT ?? 3000;

// Configure middleware to serve static assets from public directory
server.use(express.static("public"));

// Serve the Remix app
server.all("*", createRequestHandler({ build }));

// ========== Start server ========== //

// Start server on port 3000
server.listen(PORT, () => {
    if (process.env.NODE_ENV === "development") {
        broadcastDevReady(build);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});
