export default function CategoryProfile({ params }: { params: { category: string } }) {
  return <div>Perfil — {params.category}</div>;
}
