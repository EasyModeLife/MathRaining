export default function CategoryGames({ params }: { params: { category: string } }) {
  return <div>Juegos — {params.category}</div>;
}
