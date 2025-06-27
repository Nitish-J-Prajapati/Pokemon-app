// app/pokemon/[id]/page.tsx
export default async function PokemonDetail({ params }: { params: { id: string } }) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
    if (!res.ok) return <p>Pokémon not found</p>;
  
    const data = await res.json();
  
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <img src={data.sprites.front_default} alt={data.name} className="w-64 h-64 object-contain" />
        <h1 className="text-3xl font-bold mt-4">{data.name}</h1>
        <p className="text-lg text-gray-500">
          Type: {data.types.map((t: any) => t.type.name).join(', ')}
        </p>
      </div>
    );
  }
  