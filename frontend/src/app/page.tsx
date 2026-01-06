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

    // start assuming no errors
    let error: string | null = null;

    // Parse numbers (keep null if empty)
    const minNum = sqmMin.trim() === "" ? null : Number(sqmMin);
    const maxNum = sqmMax.trim() === "" ? null : Number(sqmMax);
    const bathNum = bathroomsMin.trim() === "" ? null : Number(bathroomsMin);

    // sqmMin validation
    if (minNum !== null && (!Number.isFinite(minNum) || minNum < 0)) {
      error = "sqm min must be a number ≥ 0";
    }

    // sqmMax validation
    if (!error && maxNum !== null && (!Number.isFinite(maxNum) || maxNum < 0)) {
      error = "sqm max must be a number ≥ 0";
    }

    // min <= max validation (only if both present and valid numbers)
    if (
      !error &&
      minNum !== null &&
      maxNum !== null &&
      Number.isFinite(minNum) &&
      Number.isFinite(maxNum) &&
      minNum > maxNum
    ) {
      error = "sqm max must be greater than or equal to sqm min";
    }

    // bathroomsMin validation (integer >= 0)
    if (!error && bathNum !== null && (!Number.isInteger(bathNum) || bathNum < 0)) {
      error = "bathrooms min must be an integer ≥ 0";
    }

    if (error) {
      alert(error);
      return;
    }

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
