'use client';
import Link from 'next/link';

interface NavbarProps {
  onSearch: (text: string) => void;
  onLogout: () => void;
}

export default function Navbar({ onSearch, onLogout }: NavbarProps) {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-indigo-600 text-white">
      <h1 className="text-xl font-bold">
        <Link href="/dashboard">PokéDex App</Link>
      </h1>
      <input
        className="p-2 rounded text-black"
        type="text"
        placeholder="Search Pokémon"
        onChange={(e) => onSearch(e.target.value)}
      />
      <button
        onClick={onLogout}
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}
