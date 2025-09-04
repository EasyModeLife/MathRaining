"use client";
import React from "react";

type Props = {
	children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
	return (
		<div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
			<main className="flex-1 container mx-auto p-4">{children}</main>
		</div>
	);
}
