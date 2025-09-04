export default function CategoryHome({ params }: { params: { category: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{params.category}</h1>
      <p>Selecciona una sección: juegos, práctica, configuración o perfil.</p>
    </div>
  );
}
