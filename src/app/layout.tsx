import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import  "@surendra9712/ui-components/dist/style.css";
import {AppSessionProvider, AuthProvider} from "@/context/AuthProvider";
import Layout from "@/components/layout/Layout";
import {MessageProvider} from "@/context/MessageProvider";
import {QueryProvider} from "@/context/QueryClientProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: 'User Management',
    description: 'User management application',
};
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <AppSessionProvider>
            <QueryProvider>
                <AuthProvider>
                    <MessageProvider>
                        <Layout>
                            {children}
                        </Layout>
                    </MessageProvider>
                </AuthProvider>
            </QueryProvider>
        </AppSessionProvider>
        </body>
        </html>
    );
}
