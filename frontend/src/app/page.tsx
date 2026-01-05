"use client";
export const dynamic = "force-dynamic";

export default function Home() {
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Submit intercettato");
  }

  return (
    <main>
      <h1>Real Estate Advisor</h1>
      <p>Input page (qui ci sarà il form).</p>

      <form onSubmit={onSubmit}>
        <input placeholder="https://..." />
        <button type="submit">Valuta</button>
      </form>
    </main>
  );
}
