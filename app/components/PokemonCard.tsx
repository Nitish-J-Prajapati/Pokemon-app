// app/components/PokemonCard.tsx
"use client";

import React from "react";
import Link from "next/link";

const typeEmojis: Record<string, string> = {
  fire: "🔥",
  water: "💧",
  grass: "🌿",
  electric: "⚡",
  normal: "🔘",
  poison: "☠️",
  fairy: "✨",
  bug: "🐛",
  ground: "🌍",
  psychic: "🔮",
  rock: "🪨",
  ghost: "👻",
  dragon: "🐉",
  dark: "🌑",
  steel: "⚙️",
  ice: "❄️",
  fighting: "🥊",
  flying: "🕊️",
};

export default function PokemonCard({ pokemon }: { pokemon: any }) {
  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div className="bg-black shadow-md rounded-xl p-4 hover:shadow-lg transition cursor-pointer">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-24 h-24 mx-auto"
        />
        <h3 className="text-center font-bold capitalize text-lg mt-2">
          {pokemon.name}
        </h3>

        <div className="text-sm mt-2 text-white">
          <p>
            <strong>Type:</strong>{" "}
            {pokemon.type
              .map((t: string) => `${typeEmojis[t] || ""} ${t}`)
              .join(", ")}
          </p>
          <p>
            <strong>Height:</strong> {pokemon.height}
          </p>
          <p>
            <strong>Weight:</strong> {pokemon.weight}
          </p>
          <p>
            <strong>Base XP:</strong> {pokemon.base_experience}
          </p>
          <p>
            <strong>Abilities:</strong> {pokemon.abilities.join(", ")}
          </p>
          <p>
            <strong>Forms:</strong> {pokemon.forms.join(", ")}
          </p>
          <p>
            <strong>Stats:</strong>
          </p>
          <ul className="pl-4 list-disc">
            {pokemon.stats.map((s: any, idx: number) => (
              <li key={idx}>
                {s.name}: {s.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Link>
  );
}
