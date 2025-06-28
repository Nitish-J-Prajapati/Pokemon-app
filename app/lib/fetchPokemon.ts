export async function fetchAllPokemon(limit = 200) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  const data = await res.json();

  const detailedPokemon = await Promise.all(
    data.results.map(async (p: any) => {
      const res = await fetch(p.url);
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
    })
  );

  return detailedPokemon;
}
