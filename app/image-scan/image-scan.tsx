"use client";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { scanImageAi } from "../actions/recipe-ai";

export default function ImageScan() {
    const [answer, setAnswer] = useState<string>();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const res = await scanImageAi();
        setAnswer(res);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Button>Send</Button>
            </form>
            {answer}
        </div>
    );
}
