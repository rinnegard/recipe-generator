import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RecipeGenerator() {
    return (
        <div>
            <form action="" className="flex">
                <Input
                    type="text"
                    name="prompt"
                    id="prompt"
                    placeholder="Enter your ingredients and get recipe suggestions"
                />
                <Button>Send</Button>
            </form>
        </div>
    );
}
