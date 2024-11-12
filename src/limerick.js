// src/main_05_joke.js
// Simple Deno backend with a static server and a custom route that
// uses the OpenAI API to generate jokes.

// Import the the Application and Router classes from the Oak module
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// Import server helper functions from the class library
import { createExitSignal, staticServer } from "./shared/server.ts";

// Import the promptGPT function from the class library
import { promptGPT } from "./shared/openai.ts";

// Create an instance of the Application and Router classes
const app = new Application();
const router = new Router();

// Create a route to handle requests to /api/limerick
router.get("/api/limerick", async (ctx) => {
    // Get the name&location from the query string `?name=...``?location=...`
    const name = ctx.request.url.searchParams.get("name");
    const location = ctx.request.url.searchParams.get("location");

    // Log the request to the terminal
    console.log("someone made a request to /api/limerick", name, location);

    // Ask GPT to generate a joke about the topic
    const limerick = await promptGPT(
        `Please generate limerick based on the name:${name}. , and also based on the location: ${location}`,
    );

    // Send the limerick back to the client
    ctx.response.body = limerick;
});

// Tell the app to use the custom routes
app.use(router.routes());
app.use(router.allowedMethods());

// Try serving undefined routes with static files
app.use(staticServer);

// // Everything is set up, let's start the server
console.log("\nListening on http://localhost:8000");
await app.listen({ port: 8000, signal: createExitSignal() });
