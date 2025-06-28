// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import PokemonCard from "@/app/components/PokemonCard";
import FilterPanel from "@/app/components/Filter";
import { fetchAllPokemon } from "@/app/lib/fetchPokemon";
import { useAuth } from "@/app/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [allPokemon, setAllPokemon] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState({
    type: [] as string[],
    height: "",
    weight: "",
    experience: "",
    region: "",
  });
  const [page, setPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (!user) {
      alert("You should do login first");
      router.replace("/login?error=unauthorized");
    } else {
      fetchAllPokemon(200).then(setAllPokemon);
    }
  }, [user, router]);

  if (!user) return null;

  const applyFilters = (p: any) => {
    const matchesType =
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterState.type.length === 0 ||
        filterState.type.some((f) => p.type.includes(f)));

    const matchesHeight =
      !filterState.height ||
      (filterState.height === "<5" && p.height < 5) ||
      (filterState.height === "6-20" && p.height >= 6 && p.height <= 20) ||
      (filterState.height === ">20" && p.height > 20);

    const matchesWeight =
      !filterState.weight ||
      (filterState.weight === "<5" && p.weight < 5) ||
      (filterState.weight === "6-20" && p.weight >= 6 && p.weight <= 20) ||
      (filterState.weight === ">20" && p.weight > 20);

    const matchesExp =
      !filterState.experience ||
      (filterState.experience === "<50" && p.base_experience < 50) ||
      (filterState.experience === "50-150" &&
        p.base_experience >= 50 &&
        p.base_experience <= 150) ||
      (filterState.experience === ">150" && p.base_experience > 150);

    const matchesRegion =
      !filterState.region || filterState.region === p.region;

    return (
      matchesType &&
      matchesHeight &&
      matchesWeight &&
      matchesExp &&
      matchesRegion
    );
  };

  const filteredPokemon = allPokemon.filter(applyFilters);

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
      <Navbar
        onSearch={(text) => {
          setSearch(text);
          setPage(1);
        }}
        onLogout={() => {
          localStorage.removeItem("user");
          location.href = "/login";
        }}
      />{" "}
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
              page === p
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-600 border"
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
        className="fixed bottom-15 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white px-4 py-2 rounded-full shadow-lg"
      >
        Filter
      </button>
      {showFilter && (
        <FilterPanel
          filter={filterState}
          setFilter={setFilterState}
          onClose={() => setShowFilter(false)}
          onApply={() => {
            setPage(1);
            setShowFilter(false);
          }}
        />
      )}
    </main>
  );
}
