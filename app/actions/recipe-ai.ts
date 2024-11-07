"use server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export async function generateRecipes(prompt: string): Promise<string> {
    const schema = {
        description: "List of recipes",
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
                        "Step by step instructions including quantities on how to cook the recipe. Format using Markdown.",
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
