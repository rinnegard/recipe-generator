"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
    const pathname = usePathname();
    return (
        <aside className="p-6 bg-gray-200">
            <nav>
                <ul className="space-y-2">
                    <li>
                        <Link
                            className={cn(
                                "text-blue-600 p-2 rounded-lg hover:bg-white transition duration-200 visited:text-purple-600 w-full",
                                pathname === "/" && "underline"
                            )}
                            href="/"
                        >
                            What&apos;s in Your Pantry?
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={cn(
                                "text-blue-600 p-2 rounded-lg hover:bg-white transition duration-200 visited:text-purple-600 w-full",
                                pathname === "/image-scan" && "underline"
                            )}
                            href="/image-scan"
                        >
                            Scan & Discover
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={cn(
                                "text-blue-600 p-2 rounded-lg hover:bg-white transition duration-200 visited:text-purple-600 w-full",
                                pathname === "/ask-chef" && "underline"
                            )}
                            href="/ask-chef"
                        >
                            Ask A Chef
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
