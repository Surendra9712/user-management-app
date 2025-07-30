'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button} from "@surendra9712/ui-components";
import {signOut} from "next-auth/react";

export default function Header() {
    const pathname = usePathname();
    if (pathname === "/login") return null;

    const handleLogout = async () => {
        await signOut({callbackUrl: "/login"});
    }

    return (
        <header
            className="sticky top-0 z-50 bg-gray-800 text-white shadow-md">
            <div className="container flex justify-between items-center px-6 py-4">
                <div className="text-xl font-bold">
                    <Link href="/dashboard">Dashboard</Link>
                </div>
                <nav className="flex items-center gap-4">
                    <Link href="/dashboard">Home</Link>
                    <Link href="/users">Users</Link>
                    <Button onClick={handleLogout}>Logout</Button>
                </nav>
            </div>
        </header>
    );
}