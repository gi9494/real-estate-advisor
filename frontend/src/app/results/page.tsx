import Link from "next/link";

type SearchParams = Record<string, string | string[] | undefined>;

export default function Results({ searchParams }: { searchParams: SearchParams }) {
  const url = typeof searchParams.url === "string" ? searchParams.url : "";
  const sqmMin = typeof searchParams.sqmMin === "string" ? searchParams.sqmMin : "";
  const sqmMax = typeof searchParams.sqmMax === "string" ? searchParams.sqmMax : "";
  const bathroomsMin =
    typeof searchParams.bathroomsMin === "string" ? searchParams.bathroomsMin : "";
  const elevator = searchParams.elevator;
  const elevatorMustHave = searchParams.elevatorMustHave === "1";
  return (
    <main style={{ maxWidth: 720 }}>
      <h1>Results</h1>
      <p>Mock results (backend later).</p>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Inputs received</h2>
        <ul>
          <li>URL: {url || "—"}</li>
          <li>sqm min: {sqmMin || "—"}</li>
          <li>sqm max: {sqmMax || "—"}</li>
          <li>bathrooms min: {bathroomsMin || "—"}</li>
          <li>elevator: {typeof elevator === "string" ? elevator : "—"}</li>
          <li>elevator must have: {elevatorMustHave ? "Yes" : "No"}</li>
        </ul>
      </div>
    </main>
  );
}
