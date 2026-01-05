import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Real Estate Advisor</h1>
      <p>Input page (qui ci sarà il form).</p>
      <Link href="/results">Go to results</Link>
    </main>
  );
}
