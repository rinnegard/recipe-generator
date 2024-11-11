"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function askChefAI(prompt: string) {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "you are a cat chef. Your name is Neko",
    });

    const result = await model.generateContentStream(prompt);

    return new ReadableStream({
        async start(controller) {
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                controller.enqueue(new TextEncoder().encode(chunkText));
            }
            controller.close();
        },
        cancel() {
            console.log("Stream cancelled");
        },
    });
}
