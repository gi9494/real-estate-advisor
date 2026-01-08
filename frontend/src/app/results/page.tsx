import Link from "next/link";

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Progress ring:
 * - red track = "not matched" portion
 * - green arc = matched percent
 */
function ProgressRing({
  percent,
  label,
}: {
  percent: number;
  label: string;
}) {
  // Bigger ring
  const radius = 56; // was 36
  const stroke = 12; // was 8
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const clamped = Math.max(0, Math.min(100, percent));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 8 }}>
      <svg height={radius * 2} width={radius * 2}>
        {/* red track (represents the "remaining / not matched" part) */}
        <circle
          stroke="rgba(239, 68, 68, 0.35)" // red-ish track
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* green progress (matched portion) */}
        <circle
          stroke="rgba(34, 197, 94, 0.95)" // green
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 350ms ease",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* percent text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="16"
          fill="currentColor"
          style={{ fontWeight: 600 }}
        >
          {clamped}%
        </text>
      </svg>

      <div style={{ fontSize: "0.95rem", color: "var(--muted)" }}>{label}</div>
    </div>
  );
}

export default function Results({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const url = typeof searchParams.url === "string" ? searchParams.url : "";
  const sqmMin =
    typeof searchParams.sqmMin === "string" ? searchParams.sqmMin : "";
  const sqmMax =
    typeof searchParams.sqmMax === "string" ? searchParams.sqmMax : "";
  const bathroomsMin =
    typeof searchParams.bathroomsMin === "string"
      ? searchParams.bathroomsMin
      : "";

  const elevator =
    typeof searchParams.elevator === "string" ? searchParams.elevator : "";
  const elevatorMustHave = searchParams.elevatorMustHave === "1";

  // Mock backend response (later will come from FastAPI)
  const mockResponse = {
    mustMatchPct: 72,
  };

  return (
    <main className="container">
      <div className="card">
        <h1 className="h1">Results</h1>
        <p className="sub">Mock results (backend later).</p>

        {/* Score card */}
        <div
          style={{
            display: "grid",
            gap: 12,
            padding: 16,
            borderRadius: 16,
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.02)",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <ProgressRing
              percent={mockResponse.mustMatchPct}
              label="Must-have match"
            />

            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                What this means
              </div>
              <div style={{ fontSize: 14 }}>
                This score is computed by the backend based on your must-have
                requirements.
              </div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                Next: we’ll replace this mock with a real API call.
              </div>
            </div>
          </div>
        </div>

        {/* Inputs received */}
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 16,
            background: "rgba(255,255,255,0.01)",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: 16, color: "var(--muted)" }}>
            Inputs received
          </h2>

          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text)" }}>
            <li>URL: {url || "—"}</li>
            <li>sqm min: {sqmMin || "—"}</li>
            <li>sqm max: {sqmMax || "—"}</li>
            <li>bathrooms min: {bathroomsMin || "—"}</li>
            <li>elevator: {elevator || "—"}</li>
            <li>elevator must have: {elevatorMustHave ? "Yes" : "No"}</li>
          </ul>

          <div style={{ marginTop: 14 }}>
            <Link href="/" style={{ color: "var(--muted)" }}>
              ← Back
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
