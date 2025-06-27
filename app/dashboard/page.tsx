'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Filter from '@/app/components/Filter';
import PokemonCard from '@/app/components/PokemonCard';
import { fetchAllPokemon } from '@/app/lib/fetchPokemon';

type Pokemon = {
  id: number;
  name: string;
  type: string[];
  image: string;
};

export default function Dashboard() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetchAllPokemon(200).then(setAllPokemon);
  }, []);

  const filteredPokemon = allPokemon.filter(
    (p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter.length === 0 || filter.some((f) => p.type.includes(f)))
  );

  const totalPages = Math.ceil(filteredPokemon.length / 12);
  const currentPagePokemon = filteredPokemon.slice((page - 1) * 12, page * 12);

  const getVisiblePages = () => {
    const pages = [];
    let start = page;
    let end = Math.min(start + 4, totalPages);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar onSearch={(text) => { setSearch(text); setPage(1); }} onLogout={() => alert('Log out logic here')} />
      <p className="text-center mt-4 text-gray-700">
        Total Cards: {filteredPokemon.length}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 justify-center">
        {currentPagePokemon.map((p: any) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>

      <div className="flex justify-center items-center space-x-2 my-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-white text-indigo-600 border disabled:opacity-50"
        >
          ⬅
        </button>

        {getVisiblePages().map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${
              page === p ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border'
            }`}
          >
            {p}
          </button>
        ))}

        {page + 4 < totalPages && <span className="px-2">...</span>}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-white text-indigo-600 border disabled:opacity-50"
        >
          ➡
        </button>
      </div>

      <button
        onClick={() => setShowFilter(true)}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white px-4 py-2 rounded-full shadow-lg"
      >
        Filter
      </button>

      {showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-6 rounded-lg w-80 animate-fade-in">
            <h2 className="text-lg font-semibold mb-4">Filter by Type</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {["fire","water","grass","electric","normal","poison","fairy"].map((type) => (
                <button
                  key={type}
                  className={`px-2 py-1 rounded border text-sm ${filter.includes(type) ? 'bg-indigo-200' : ''}`}
                  onClick={() =>
                    setFilter((prev) =>
                      prev.includes(type)
                        ? prev.filter((t) => t !== type)
                        : [...prev, type]
                    )
                  }
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowFilter(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setPage(1);
                  setShowFilter(false);
                }}
                className="bg-indigo-600 text-white px-3 py-1 rounded"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
