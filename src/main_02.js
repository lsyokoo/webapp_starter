let hit_counter = 0;

import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { createExitSignal } from "./shared/server.ts";

const app = new Application();

// Deafult route
app.use((ctx) => {
  console.log("someone made a request");
  hit_counter++;
  ctx.response.body = "Hello!this is the request number ${hit_counter}";
});

console.log("\nListening on http://localhost:8000");

await app.listen({ port: 8000, signal: createExitSignal() });

// Try this with
// http://localhost:8000/
