export async function fetchTypes() {
    const res = await fetch('https://pokeapi.co/api/v2/type');
    const data = await res.json();
    return data.results.map((type: any) => type.name);
  }
  
  export async function fetchRegions() {
    const res = await fetch('https://pokeapi.co/api/v2/region');
    const data = await res.json();
    return data.results.map((region: any) => region.name);
  }
  
  export const generationRegionMap: Record<number, string> = {
    1: 'kanto',
    2: 'johto',
    3: 'hoenn',
    4: 'sinnoh',
    5: 'unova',
    6: 'kalos',
    7: 'alola',
    8: 'galar',
    9: 'paldea',
  };
  