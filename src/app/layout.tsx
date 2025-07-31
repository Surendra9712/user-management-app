import type {Metadata} from "next";
import "./globals.css";
import "@surendra9712/ui-components/dist/style.css";
import {AppSessionProvider, AuthProvider} from "@/context/AuthProvider";
import Layout from "@/components/layout/Layout";
import {MessageProvider} from "@/context/MessageProvider";
import {QueryProvider} from "@/context/QueryClientProvider";
import {ConfigProvider} from "antd";

export const metadata: Metadata = {
    title: {
        default: 'User Management',
        template: '%s | User Management',
    },
    description: 'User management application',
};
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body suppressHydrationWarning>
        <ConfigProvider theme={{
            token: {
                colorPrimary: "#45448f",
            },
            components: {
                Button: {
                    controlHeight: 40,
                    controlHeightSM: 36,
                    controlHeightLG: 56,
                    paddingInline: 20,
                    fontSize: 16,
                },
                Pagination: {
                    itemSize: 32,
                },
            },
        }
        }>
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
        </ConfigProvider>
        </body>
        </html>
    );
}
