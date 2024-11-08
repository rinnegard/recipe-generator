"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useRef, useState } from "react";
import { askChefAI } from "../actions/chef-ai";

export default function AskChefPage() {
    const [answer, setAnswer] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setAnswer("");

        const prompt = inputRef.current?.value;
        if (!prompt) return;

        const res = await askChefAI(prompt);

        const reader = res.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunkText = decoder.decode(value, { stream: true });
            setAnswer((prev) => prev + chunkText);
        }
    }

    return (
        <div>
            <h1>Ask A Chef</h1>
            <form onSubmit={handleSubmit}>
                <Input ref={inputRef} type="text" name="prompt"></Input>
                <Button>Send</Button>
            </form>
            <div>{answer}</div>
        </div>
    );
}