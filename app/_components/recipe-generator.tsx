"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useRef, useState } from "react";
import { generateRecipes } from "../actions/recipe-ai";

export default function RecipeGenerator() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [answer, setAnswer] = useState<string>();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (inputRef.current?.value === undefined) {
            return;
        }

        const prompt = inputRef.current?.value;
        const res = await generateRecipes(prompt);
        console.log(JSON.parse(res));

        setAnswer(res);
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex">
                <Input
                    ref={inputRef}
                    type="text"
                    name="prompt"
                    id="prompt"
                    placeholder="Enter your ingredients and get recipe suggestions"
                />
                <Button>Send</Button>
            </form>
            <div>{answer}</div>
        </div>
    );
}
