// Import the the Application and Router classes from the Oak module
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// Import the createExitSignal function from the JS+OAI shared library
import { createExitSignal, staticServer } from "./shared/server.ts";

// Create an instance of the Application and Router classes
const app = new Application();
const router = new Router();

// define api/convert route handle convert request
router.get("/api/convert", (ctx) => {
  const celsius = parseFloat(ctx.request.url.searchParams.get("celsius")); //!!Retrieve the Celsius from query parameters and convert it to a number

  // C to F convert formula
  const fahrenheit = (celsius * 9 / 5) + 32;

  // result(rounded to 2 decimal place)
  ctx.response.body = { fahrenheit: fahrenheit.toFixed(2) };
});

// Tell the app to use the router
app.use(router.routes());
app.use(router.allowedMethods());

// Try serving undefined routes with static files
app.use(staticServer);

// Everything is set up, let's start the server
console.log("\nListening on http://localhost:8000");
await app.listen({ port: 8000, signal: createExitSignal() });
