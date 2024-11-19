// Simple Deno backend with a static server and a custom route that
// uses the OpenAI API to generate hairstyle description and image.

// Import the the Application and Router classes from the Oak module
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// Import server helper functions from the class library
import { createExitSignal, staticServer } from "./shared/server.ts";

// Import the promptGPT function from the class library
import { promptDalle, promptGPT } from "./shared/openai.ts";

// Create an instance of the Application and Router classes
const app = new Application();
const router = new Router();

// Create a route to handle requests to /api/limerick
router.get("/api/hairstyle", async (ctx) => {
    // Get the parameters(age,gender,style)  from the query string `?age=...``?gender=...``?style=...`
    const age = ctx.request.url.searchParams.get("age");
    const gender = ctx.request.url.searchParams.get("gender");
    const stylePreference = ctx.request.url.searchParams.get("style");

    // Log the request to the terminal
    console.log(
        "someone made a request to /api/hairstyle",
        age,
        gender,
        stylePreference,
    );

    // Ask GPT to generate a detailed hairstyle description
    const description = await promptGPT(
        `Please refine and improve the hairstyle request based on the following user input: "${stylePreference}". This is for a ${age}-year-old ${gender}. Create a clear and comprehensive description suitable for directly showing to a hairdresser, including details like length, layers, color, texture, and any other relevant features. Do not include any introductory phrases.Remove any Markdown formatting and ensure all paragraphs are clear and fully displayed.`,
    );

    // Send the generated hair description back to the client
    const finalDescription = description.replace(/\*/g, ""); // remove markdown *!
    ctx.response.body = finalDescription;
});

// ! New route to generate image based on description  *consult chatgpt in this part
router.get("/api/generate-image", async (ctx) => {
    const description = ctx.request.url.searchParams.get("description");

    console.log(
        "Request to /api/generate-image with description:",
        description,
    );

    const imageResponse = await promptDalle(description);
    ctx.response.body = { imageUrl: imageResponse.url };
});

// Tell the app to use the custom routes
app.use(router.routes());
app.use(router.allowedMethods());

// Try serving undefined routes with static files
app.use(staticServer);

// // Everything is set up, let's start the server
console.log("\nListening on http://localhost:8000");
await app.listen({ port: 8000, signal: createExitSignal() });
