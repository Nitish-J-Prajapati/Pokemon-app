import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import { fetchAllPokemon } from '@/app/lib/fetchPokemon';
import { parseFiltersFromSearchParams, applyFilters } from '@/app/lib/filterUtils';
import DashboardClient from './DashboardClient'; // ✅ This import is required

interface Props {
  searchParams: { [key: string]: string | string[] };
}

export default async function DashboardPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?error=unauthorized');

  const page = parseInt((searchParams.page as string) || '1');
  const filters = parseFiltersFromSearchParams(searchParams);

  const allPokemon = await fetchAllPokemon(200);
  const filteredPokemon = applyFilters(allPokemon, filters);

  const pageSize = 12;
  const totalPages = Math.ceil(filteredPokemon.length / pageSize);
  const currentPagePokemon = filteredPokemon.slice((page - 1) * pageSize, page * pageSize);

  return (
    <DashboardClient
      allPokemon={currentPagePokemon}
      totalCards={filteredPokemon.length}
      currentPage={page}
      totalPages={totalPages}
      searchParams={searchParams}
    />
  );
}
