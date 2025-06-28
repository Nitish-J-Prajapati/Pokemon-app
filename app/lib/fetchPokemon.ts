export async function fetchAllPokemon(limit = 200) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);

    if (!res.ok) throw new Error(`Failed to fetch Pokémon list: ${res.statusText}`);

    const data = await res.json();

    const detailedPokemon = await Promise.all(
      data.results.map(async (p: any) => {
        try {
          const res = await fetch(p.url);
          if (!res.ok) throw new Error(`Failed to fetch details for ${p.name}`);
          const details = await res.json();

          return {
            id: details.id,
            name: details.name,
            type: details.types.map((t: any) => t.type.name),
            image: details.sprites.front_default,
            height: details.height,
            weight: details.weight,
            base_experience: details.base_experience,
            abilities: details.abilities.map((a: any) => a.ability.name),
            stats: details.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
            forms: details.forms.map((f: any) => f.name),
          };
        } catch (err) {
          console.warn(`Skipping ${p.name} due to error:`, err);
          return null;
        }
      })
    );

    // Remove any null entries
    return detailedPokemon.filter((p) => p !== null);
  } catch (err) {
    console.error('Error fetching all Pokémon:', err);
    return []; // graceful fallback
  }
}
