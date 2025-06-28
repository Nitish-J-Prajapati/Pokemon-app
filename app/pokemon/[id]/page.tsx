// app/pokemon/[id]/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function fetchPokemon(id: string) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) return null;
    const details = await res.json();
    return {
      id: details.id,
      name: details.name,
      image: details.sprites.front_default,
      type: details.types.map((t: any) => t.type.name),
      height: details.height,
      weight: details.weight,
      base_experience: details.base_experience,
      abilities: details.abilities.map((a: any) => a.ability.name),
      stats: details.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
      forms: details.forms.map((f: any) => f.name),
    };
  } catch {
    return null;
  }
}

export default async function PokemonDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login?error=unauthorized');
  }

  const pokemon = await fetchPokemon(params.id);
  if (!pokemon) redirect('/dashboard'); // fallback if not found

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <img src={pokemon.image} alt={pokemon.name} className="w-32 h-32 mb-4" />
      <h1 className="text-3xl font-bold capitalize mb-4">{pokemon.name}</h1>
      <div className="text-left max-w-md w-full">
        <p><strong>Type:</strong> {pokemon.type.join(', ')}</p>
        <p><strong>Height:</strong> {pokemon.height}</p>
        <p><strong>Weight:</strong> {pokemon.weight}</p>
        <p><strong>Base XP:</strong> {pokemon.base_experience}</p>
        <p><strong>Abilities:</strong> {pokemon.abilities.join(', ')}</p>
        <p><strong>Forms:</strong> {pokemon.forms.join(', ')}</p>
        <p className="mt-2"><strong>Stats:</strong></p>
        <ul className="pl-4 list-disc">
          {pokemon.stats.map((s: any, i: number) => (
            <li key={i}>{s.name}: {s.value}</li>
          ))}
        </ul>
      </div>
      <Link href="/dashboard">
        <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          ← Back to Dashboard
        </button>
      </Link>
    </div>
  );
}
