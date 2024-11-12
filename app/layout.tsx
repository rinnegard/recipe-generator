import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./_components/header";
import SideNav from "./_components/sidenav";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "RecipeGenerator",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-primary flex flex-col h-full min-h-screen`}
            >
                <Header></Header>
                <div className="flex-1 flex gap-4">
                    <SideNav></SideNav>
                    <main className="flex-1 px-4 pb-6 mt-6">{children}</main>
                </div>
            </body>
        </html>
    );
}
