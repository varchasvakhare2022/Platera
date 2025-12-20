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
                    colorBackground: "#050505", // Match app background
                    colorInputBackground: "#111", // Match app inputs
                    colorText: "#fafaf9", // stone-50
                    colorInputText: "#fafaf9",
                    colorPrimary: "#FF6A00", // Orange brand color
                    colorTextSecondary: "#a8a29e", // stone-400
                    colorDanger: "#ef4444", // red-500
                    borderRadius: "0.75rem", // rounded-xl
                },
                layout: {
                    unsafe_disableDevelopmentModeWarnings: true,
                },
                elements: {
                    card: "!bg-[#0A0A0A] !border !border-stone-800/60 !rounded-2xl !shadow-2xl",
                    navbar: "!bg-stone-950 !border-r !border-stone-800 remove-branding",
                    navbarButton:
                        "!text-stone-400 hover:!bg-stone-900 hover:!text-[#FF6A00]",
                    activeNavbarButton: "!bg-stone-900 !text-[#FF6A00]",
                    headerTitle: "!text-white !font-display !text-2xl !font-bold",
                    headerSubtitle: "!text-stone-400 !text-xs",
                    sectionHeaderTitle: "!text-white !font-display",
                    formFieldLabel: "!text-stone-500 !text-[10px] !font-bold !uppercase !tracking-widest",
                    formFieldInput:
                        "!bg-[#111] !border !border-stone-800 !rounded-lg !text-white placeholder:!text-stone-700 focus:!border-[#FF6A00]/40 focus:!bg-[#161616] !transition-all",
                    formButtonPrimary:
                        "!bg-[#FF6A00] hover:!bg-[#FF8533] !text-black !font-bold !rounded-xl !shadow-[0_0_15px_rgba(255,106,0,0.15)] hover:!shadow-[0_0_25px_rgba(255,106,0,0.3)] !transition-all !duration-300",
                    footerActionText: "!text-stone-400 !text-xs",
                    footerActionLink: "!text-white hover:!text-[#FF6A00] !font-medium !transition-colors",
                    identityPreviewText: "!text-white",
                    identityPreviewEditButton: "!text-[#FF6A00] hover:!text-[#FF8533]",
                    dividerLine: "!bg-stone-800",
                    dividerText: "!text-stone-600 !text-[10px] !uppercase !tracking-widest",
                    socialButtonsBlockButton:
                        "!bg-[#111] hover:!bg-[#1A1A1A] !border !border-stone-800 !rounded-lg !text-white hover:!border-stone-700 !transition-all",

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
