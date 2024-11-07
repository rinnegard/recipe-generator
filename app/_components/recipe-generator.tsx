"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useRef, useState } from "react";
import { generateRecipes } from "../actions/recipe-ai";
import RecipeCard, { Recipe } from "./recipe-card";

export default function RecipeGenerator() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [recipes, setRecipes] = useState<Recipe[]>();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        setLoading(true);
        e.preventDefault();
        if (!inputRef.current?.value) {
            return;
        }

        const prompt = inputRef.current?.value;
        const res = await generateRecipes(prompt);
        console.log(JSON.parse(res));

        const parsedData = JSON.parse(res);

        setRecipes(parsedData);
        setLoading(false);
    }

    return (
        <div className="space-y-6">
            <form
                onSubmit={handleSubmit}
                className="flex gap-2 max-w-screen-sm mx-auto"
            >
                <Input
                    disabled={loading}
                    ref={inputRef}
                    type="text"
                    name="prompt"
                    id="prompt"
                    placeholder="Enter your ingredients and get recipe suggestions"
                />
                <Button disabled={loading}>Send</Button>
            </form>
            {recipes && (
                <div className=" flex flex-col gap-6">
                    {recipes.map((recipe) => {
                        return (
                            <RecipeCard
                                key={recipe.name}
                                recipe={recipe}
                            ></RecipeCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
