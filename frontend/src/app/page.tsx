"use client";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function Home() {
  // State: React memory for each field (strings for now)
  const [url, setUrl] = useState("");
  const [sqmMin, setSqmMin] = useState("");
  const [sqmMax, setSqmMax] = useState("");
  const [bathroomsMin, setBathroomsMin] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Temporary debug: show what we captured
    alert(
      `URL: ${url}\n` +
        `sqmMin: ${sqmMin}\n` +
        `sqmMax: ${sqmMax}\n` +
        `bathroomsMin: ${bathroomsMin}`
    );
  }

  return (
    <main>
      <h1>Real Estate Advisor</h1>
      <p>Input page (here will be the form).</p>

      <form onSubmit={onSubmit}>
        <input
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          placeholder="sqm min (e.g. 70)"
          value={sqmMin}
          onChange={(e) => setSqmMin(e.target.value)}
        />

        <input
          placeholder="sqm max (e.g. 90)"
          value={sqmMax}
          onChange={(e) => setSqmMax(e.target.value)}
        />

        <input
          placeholder="bathrooms min (e.g. 2)"
          value={bathroomsMin}
          onChange={(e) => setBathroomsMin(e.target.value)}
        />

        <button type="submit">Valuta</button>
      </form>
    </main>
  );
}
