"use client";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function Home() {
  // 1) State: React memory for input value
  const [url, setUrl] = useState("");

  // 2) Submit handler: prevent refresh and use stored value
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert(`URL inserito: ${url}`);
  }

  return (
    <main>
      <h1>Real Estate Advisor</h1>
      <p>Input page (qui ci sarà il form).</p>

      <form onSubmit={onSubmit}>
        <input
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Valuta</button>
      </form>
    </main>
  );
}
