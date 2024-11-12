"use client";
import { Button } from "@/components/ui/button";
import { FormEvent, useRef, useState } from "react";
import { scanImageAi } from "../actions/recipe-ai";
import { Input } from "@/components/ui/input";
import RecipeCard, { Recipe } from "../_components/recipe-card";

export default function ImageScan() {
    const [answer, setAnswer] = useState<Recipe>();
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const file = inputRef.current?.files?.[0];
        if (!file) return;

        const res = await scanImageAi(file);
        const parsedData = JSON.parse(res);

        setAnswer(parsedData);
    }

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="flex gap-2 max-w-screen-sm mx-auto"
            >
                <Input
                    ref={inputRef}
                    type="file"
                    name="image"
                    id="image"
                ></Input>
                <Button>Send</Button>
            </form>
            {answer && <RecipeCard recipe={answer}></RecipeCard>}
        </div>
    );
}
