import Link from 'next/link';

export default function PokemonCard({ pokemon }: { pokemon: any }) {
  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div className="bg-white p-4 rounded shadow hover:shadow-lg transition w-48 text-center">
        <img src={pokemon.image} alt={pokemon.name} className="w-full h-32 object-contain" />
        <h2 className="font-bold">{pokemon.name}</h2>
        <p className="text-sm text-gray-500">{pokemon.type.join(', ')}</p>
      </div>
    </Link>
  );
}