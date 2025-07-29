import Header from "@/components/layout/Header";
import { AntdRegistry } from '@ant-design/nextjs-registry';

export default function Layout({children}: { children: React.ReactNode }) {

    return (
        <AntdRegistry>
            <Header/>
            <main className="min-h-[calc(100vh-128px)] container mx-auto lg:p-6 p-4">
                {children}
            </main>
            <footer className="bg-gray-100 h-16 leading-16 text-center">
                <p>© 2023 User Management System</p>
            </footer>
        </AntdRegistry>
    );
}