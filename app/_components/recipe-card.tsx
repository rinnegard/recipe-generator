import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Markdown from "react-markdown";

export type Recipe = {
    name: string;
    description: string;
    instructions: string;
    usedIngredients: string | undefined;
    otherIngredients: string | undefined;
    ingredients: string | undefined;
};

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
                <CardDescription>{recipe.description}</CardDescription>
            </CardHeader>
            <CardContent>
                {recipe.usedIngredients && (
                    <div>Your ingredients: {recipe.usedIngredients}</div>
                )}
                {recipe.otherIngredients && (
                    <div>Other ingredients: {recipe.otherIngredients}</div>
                )}
                {recipe.ingredients && (
                    <div>Ingredients: {recipe.ingredients}</div>
                )}

                <Markdown className="prose">{recipe.instructions}</Markdown>
            </CardContent>
        </Card>
    );
}
