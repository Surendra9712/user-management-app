'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button} from "@surendra9712/ui-components";
import {signOut} from "next-auth/react";
import {AiOutlineLogout} from "react-icons/ai";

export default function Header() {
    const pathname = usePathname();
    if (pathname === "/login") return null;

    const handleLogout = async () => {
        await signOut({callbackUrl: "/login"});
    }

    return (
        <header
            className="sticky top-0 z-50 bg-primary text-white shadow-md">
            <div className="container flex justify-between items-center px-6 py-4">
                <div className="text-xl font-bold">
                    <Link href="/dashboard">Dashboard</Link>
                </div>
                <nav className="flex items-center gap-4">
                    <Link href="/dashboard">Home</Link>
                    <Link href="/users">Users</Link>
                    <Button variant={'outlined'} type={'primary'} onClick={handleLogout} icon={<AiOutlineLogout/>}></Button>
                </nav>
            </div>
        </header>
    );
}