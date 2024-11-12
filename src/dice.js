// Import the the Application and Router classes from the Oak module
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// Import the createExitSignal function from the JS+OAI shared library
import { createExitSignal, staticServer } from "./shared/server.ts";

// Create an instance of the Application and Router classes
const app = new Application();
const router = new Router();

// define route for rollung dice when "/api/d6" is requested
router.get("/api/d6", (ctx) => {
  const roll = Math.floor(Math.random() * 6) + 1; //!!generate random 1-6
  ctx.response.body = { result: roll }; //send as json
});

//other api/test response
router.get("/api/test", (ctx) => {
  console.log("When you push the button: /api/test");
  // send a response back to the browser
  ctx.response.body = "Try this dice rolling app!";
});

// Tell the app to use the router
app.use(router.routes());
app.use(router.allowedMethods());

// Try serving undefined routes with static files
app.use(staticServer);

// Everything is set up, let's start the server
console.log("\nListening on http://localhost:8000");
await app.listen({ port: 8000, signal: createExitSignal() });
