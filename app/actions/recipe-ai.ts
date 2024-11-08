"use server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import path from "path";

export async function generateRecipes(prompt: string): Promise<string> {
    const schema = {
        description: "List of recipes for food",
        type: SchemaType.ARRAY,
        items: {
            type: SchemaType.OBJECT,
            properties: {
                name: {
                    type: SchemaType.STRING,
                    description: "Name of the recipe",
                    nullable: false,
                },
                usedIngredients: {
                    type: SchemaType.STRING,
                    description:
                        "Ingredients including quantities necessary in the recipe that were provided in the list",
                    nullable: true,
                },
                otherIngredients: {
                    type: SchemaType.STRING,
                    description:
                        "Ingredients including quantities necessary in the recipe that were not provided in the list (omitted if there are no other ingredients)",
                    nullable: true,
                },
                description: {
                    type: SchemaType.STRING,
                    description:
                        "A brief description of the recipe, written positively as if to sell it",
                    nullable: false,
                },
                instructions: {
                    type: SchemaType.STRING,
                    description:
                        "Step by step instructions including quantities on how to cook the recipe. Format as a list using Markdown.",
                    nullable: false,
                },
            },
            required: ["name", "description", "instructions"],
        },
    };

    const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
        systemInstruction: `You are an assistant for home cooks. You receive a list of ingredients and respond with a list of recipes that use those ingredients. Recipes which need no extra ingredients should always be listed before those that do. 

Your response must be a JSON object following the schema containing 3 recipes.
If there are no valid ingredients provided or the ingredient provided doesn't look like a normal food item give a reciple for pancakes, omelette and, tomato soup.

`,
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
}

export async function scanImageAi() {
    const apiKey = process.env.API_KEY as string;
    const genAI = new GoogleGenerativeAI(apiKey);
    const fileManager = new GoogleAIFileManager(apiKey);

    async function uploadToGemini(mimeType: string) {
        const filePath = path.join(process.cwd(), "public", "carbonara.jpg");
        const uploadResult = await fileManager.uploadFile(filePath, {
            mimeType,
            displayName: filePath,
        });
        const file = uploadResult.file;
        console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
        return file;
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    // TODO Make these files available on the local file system
    // You may need to update the file paths
    const files = [await uploadToGemini("image/jpeg")];

    const chatSession = model.startChat({
        generationConfig,
        history: [
            {
                role: "user",
                parts: [
                    {
                        fileData: {
                            mimeType: files[0].mimeType,
                            fileUri: files[0].uri,
                        },
                    },
                    {
                        text: "Given this image:\n\n1. First, describe the image\n2. Then, detail the recipe to bake this item in JSON format. Include item names and quantities for the recipe",
                    },
                ],
            },
            {
                role: "model",
                parts: [
                    {
                        text: 'The image shows a basket full of freshly baked croissants. They are golden brown and flaky, and some of them have a slightly burnt edge. They are piled high in the basket, and some of them are overlapping. The background is blurred, but it appears to be a kitchen counter or table.\n\n{\n  "title": "Croissants",\n  "ingredients": [\n    {\n      "name": "All-purpose flour",\n      "quantity": "500g"\n    },\n    {\n      "name": "Salt",\n      "quantity": "10g"\n    },\n    {\n      "name": "Sugar",\n      "quantity": "20g"\n    },\n    {\n      "name": "Instant yeast",\n      "quantity": "7g"\n    },\n    {\n      "name": "Unsalted butter",\n      "quantity": "250g"\n    },\n    {\n      "name": "Milk",\n      "quantity": "250ml"\n    },\n    {\n      "name": "Egg yolk",\n      "quantity": "1"\n    }\n  ],\n  "instructions": [\n    "In a large bowl, combine the flour, salt, sugar, and yeast.",\n    "Add the milk and mix until a dough forms.",\n    "Knead the dough for 10 minutes, until it is smooth and elastic.",\n    "Place the dough in a greased bowl, cover, and let it rise in a warm place for 1 hour.",\n    "Roll out the dough into a rectangle about 1/4 inch thick.",\n    "Spread the softened butter evenly over the dough.",\n    "Fold the dough in thirds, like a letter.",\n    "Wrap the dough in plastic wrap and refrigerate for 30 minutes.",\n    "Repeat steps 7 and 8 two more times.",\n    "Roll out the dough into a rectangle about 1/2 inch thick.",\n    "Cut the dough into triangles.",\n    "Roll up each triangle, starting from the wide end.",\n    "Place the croissants on a baking sheet lined with parchment paper.",\n    "Cover and let them rise for 1 hour.",\n    "Brush the croissants with egg yolk and bake at 375 degrees Fahrenheit for 15-20 minutes, or until golden brown."\n  ],\n  "notes": "You can use a stand mixer with a dough hook to knead the dough. Make sure the butter is softened to room temperature before spreading it on the dough. The croissants will rise best in a warm place, like a turned-off oven with a bowl of hot water inside."\n}',
                    },
                ],
            },
        ],
    });

    const result = await chatSession.sendMessage("What is this");
    console.log(result.response.text());

    return result.response.text();
}
