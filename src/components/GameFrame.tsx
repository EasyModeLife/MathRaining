import React from "react";

export default function GameFrame({ children }: { children: React.ReactNode }) {
	return <section className="border rounded-lg p-4">{children}</section>;
}
