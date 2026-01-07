import Link from "next/link";

type SearchParams = Record<string, string | string[] | undefined>;

// Ring for showing matching percentages
function ProgressRing({ percent, label }: { percent: number; label: string }) {
  const radius = 36;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const clamped = Math.max(0, Math.min(100, percent));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 6 }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#eee"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 300ms" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="14"
        >
          {clamped}%
        </text>
      </svg>
      <div style={{ fontSize: "0.9rem", color: "#555" }}>{label}</div>
    </div>
  );
}



export default function Results({ searchParams }: { searchParams: SearchParams }) {
  const url = typeof searchParams.url === "string" ? searchParams.url : "";
  const sqmMin = typeof searchParams.sqmMin === "string" ? searchParams.sqmMin : "";
  const sqmMax = typeof searchParams.sqmMax === "string" ? searchParams.sqmMax : "";
  const bathroomsMin =
    typeof searchParams.bathroomsMin === "string" ? searchParams.bathroomsMin : "";
  const elevator = searchParams.elevator;
  const elevatorMustHave = searchParams.elevatorMustHave === "1";

  // Mock backend response
  const mockResponse = {
  mustMatchPct: 72, // pretend backend computed this
  // niceMatchPct: 40, // later
  };

  return (
    <main style={{ maxWidth: 720 }}>
      <h1>Results</h1>
      <div style={{ margin: "16px 0" }}>
        <ProgressRing percent={mockResponse.mustMatchPct} label="Must-have match" />
      </div>
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
