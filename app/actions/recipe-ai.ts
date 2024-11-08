"use server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";
import { promisify } from "util";

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

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

export async function scanImageAi(file: File) {
    const apiKey = process.env.API_KEY as string;
    const genAI = new GoogleGenerativeAI(apiKey);
    const fileManager = new GoogleAIFileManager(apiKey);

    // Convert the File to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Define a temporary path for the file
    const tempFilePath = path.join(process.cwd(), "public", file.name);

    // Ensure the "public" folder exists
    if (!fs.existsSync(path.join(process.cwd(), "public"))) {
        fs.mkdirSync(path.join(process.cwd(), "public"));
    }

    // Write the Buffer to a temporary file
    await writeFile(tempFilePath, buffer);

    // Upload the file using the temporary file path
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
        mimeType: file.type,
        displayName: file.name,
    });

    // Delete the temporary file after upload
    await unlink(tempFilePath);

    const uploadedFile = uploadResult.file;

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const schema = {
        description: "A food recipe",
        type: SchemaType.OBJECT,
        properties: {
            name: {
                type: SchemaType.STRING,
                description: "Name of the recipe",
                nullable: false,
            },
            ingredients: {
                type: SchemaType.STRING,
                description:
                    "Ingredients including quantities necessary in the recipe that were provided in the list",
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
    };

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: schema,
    };

    const chatSession = model.startChat({
        generationConfig,

        history: [
            {
                role: "user",
                parts: [
                    {
                        fileData: {
                            mimeType: uploadedFile.mimeType,
                            fileUri: uploadedFile.uri,
                        },
                    },
                ],
            },
        ],
    });

    const result = await chatSession.sendMessage(
        "What is the recipe for this food dish?"
    );
    console.log(result.response.text());

    return result.response.text();
}
