import Link from "next/link";

export const metadata = { title: "Categorías — MathRaining" };

export default function CategoriesPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Categorías</h1>
      <ul className="list-disc list-inside">
        <li>
          <Link href="/arithmetic" className="text-blue-600 dark:text-blue-400">Aritmética</Link>
        </li>
        <li>
          <Link href="/calculus" className="text-blue-600 dark:text-blue-400">Cálculo</Link>
        </li>
      </ul>
    </div>
  );
}
