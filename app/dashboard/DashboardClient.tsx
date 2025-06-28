// app/dashboard/DashboardClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import FilterPanel from '@/app/components/Filter';
import PokemonCard from '@/app/components/PokemonCard';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface Props {
  allPokemon: any[];
  totalCards: number;
  currentPage: number;
  totalPages: number;
  searchParams: { [key: string]: string | string[] };
}

export default function DashboardClient({
  allPokemon,
  totalCards,
  currentPage,
  totalPages,
  searchParams
}: Props) {
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.search as string || '');
  const [filterState, setFilterState] = useState({
    type: Array.isArray(searchParams.type) ? searchParams.type : searchParams.type ? [searchParams.type] : [],
    height: (searchParams.height as string) || '',
    weight: (searchParams.weight as string) || '',
    experience: (searchParams.experience as string) || ''
  });
  const [showFilter, setShowFilter] = useState(false);

  const handleSearch = (text: string) => {
    setSearch(text);
    const updatedParams = new URLSearchParams({ ...searchParams, search: text, page: '1' });
    router.push(`/dashboard?${updatedParams.toString()}`);
  };

  const handleLogout = () => {
    signOut();
  };

  const createUrl = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filterState.type.length > 0) filterState.type.forEach((t) => params.append('type', t));
    if (filterState.height) params.set('height', filterState.height);
    if (filterState.weight) params.set('weight', filterState.weight);
    if (filterState.experience) params.set('experience', filterState.experience);
    params.set('page', page.toString());
    return `/dashboard?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar onSearch={handleSearch} onLogout={handleLogout} />

      <p className="text-center mt-4 text-gray-700">
        Total Cards: {totalCards}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 justify-center">
        {allPokemon.map((p: any) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>

      <div className="flex justify-center items-center space-x-2 my-4">
        {currentPage > 1 && (
          <Link href={createUrl(currentPage - 1)}>
            <button className="px-3 py-1 rounded bg-white text-indigo-600 border">⬅</button>
          </Link>
        )}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = currentPage - 2 + i;
          if (p > 0 && p <= totalPages) {
            return (
              <Link key={p} href={createUrl(p)}>
                <button
                  className={`px-3 py-1 rounded ${currentPage === p ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border'}`}
                >
                  {p}
                </button>
              </Link>
            );
          }
          return null;
        })}
        {currentPage < totalPages && (
          <Link href={createUrl(currentPage + 1)}>
            <button className="px-3 py-1 rounded bg-white text-indigo-600 border">➡</button>
          </Link>
        )}
      </div>

      <button
        onClick={() => setShowFilter(true)}
        className="fixed bottom-15 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md"
      >
        Filter
      </button>

      {showFilter && (
        <FilterPanel
          filter={filterState}
          setFilter={setFilterState}
          onClose={() => setShowFilter(false)}
          onApply={() => {
            setShowFilter(false);
            router.push(createUrl(1));
          }}
        />
      )}
    </main>
  );
}
