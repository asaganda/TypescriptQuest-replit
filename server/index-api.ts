import "dotenv/config";
import { type Server } from "node:http";
import { type Express } from "express";
import runApp from "./app";

// API-only server for AWS Elastic Beanstalk deployment
// Frontend is served separately from Netlify
export async function setupApiServer(_app: Express, _server: Server) {
  // No static file serving needed - frontend is on Netlify
  // All routes are already registered in registerRoutes()
}

(async () => {
  await runApp(setupApiServer);
})();
