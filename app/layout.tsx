import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Header } from "@/components/layout/Header";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Platera - Luxury Recipe Platform",
    description: "Discover and share exquisite recipes on the ultimate luxury recipe platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
                variables: {
                    colorBackground: "#0c0a09", // stone-950
                    colorInputBackground: "#1c1917", // stone-900
                    colorText: "#fafaf9", // stone-50
                    colorInputText: "#fafaf9",
                    colorPrimary: "#f59e0b", // amber-500
                    colorTextSecondary: "#a8a29e", // stone-400
                },
                layout: {
                    unsafe_disableDevelopmentModeWarnings: true,
                },
                elements: {
                    card: "!bg-stone-950 !border !border-stone-800",
                    navbar: "!bg-stone-950 !border-r !border-stone-800 remove-branding",
                    navbarButton:
                        "!text-stone-400 hover:!bg-stone-900 hover:!text-amber-500",
                    activeNavbarButton: "!bg-stone-900 !text-amber-500",
                    headerTitle: "!text-white !font-display",
                    headerSubtitle: "!text-stone-400",
                    sectionHeaderTitle: "!text-white !font-display",
                    formFieldLabel: "!text-stone-400",
                    formFieldInput:
                        "!bg-stone-900 !border-stone-800 !text-white",
                    footerActionText: "!text-stone-400",
                    footerActionLink: "!text-amber-500 hover:!text-amber-400",
                    identityPreviewText: "!text-stone-300",
                    identityPreviewEditButton: "!text-amber-500",

                    // User Button Popover
                    userButtonPopoverCard: "!bg-stone-950 !border !border-stone-800 !shadow-2xl !shadow-black/50 !rounded-2xl",
                    userButtonPopoverActionButton: "group hover:!bg-stone-900 !text-stone-300 hover:!text-amber-500 transition-colors p-3 rounded-xl flex items-center gap-3",
                    userButtonPopoverActionButtonIcon: "!text-stone-500 group-hover:!text-amber-500 !w-4 !h-4 !mx-0",
                    userButtonPopoverActionButtonText: "!font-sans !font-medium",
                    userButtonPopoverFooter: "!hidden"
                },
            }}
        >
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <Header />
                    {children}
                    <ConditionalFooter />
                </body>
            </html>
        </ClerkProvider>
    );
}
