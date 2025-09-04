"use client";
import Link from "next/link";
import { Home, Github, Heart, Info, Keyboard, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
	return (
		<header className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-700">
			<nav className="flex items-center gap-3">
				<Link href="/" aria-label="Inicio"><Home size={20} /></Link>
				<Link href={process.env.NEXT_PUBLIC_GITHUB_URL || '#'} aria-label="GitHub"><Github size={20} /></Link>
				<Link href="/donations" aria-label="Donaciones"><Heart size={20} /></Link>
				<Link href="/about" aria-label="Sobre el sitio"><Info size={20} /></Link>
			</nav>
			<div className="flex items-center gap-3">
				<button aria-label="Teclado virtual"><Keyboard size={20} /></button>
				<button aria-label="Perfil"><User size={20} /></button>
				<ThemeToggle />
			</div>
		</header>
	);
}
