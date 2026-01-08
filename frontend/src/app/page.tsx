"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Home() {
  // State: React memory for each field (strings for now)
  const [url, setUrl] = useState("");
  const [sqmMin, setSqmMin] = useState("");
  const [sqmMax, setSqmMax] = useState("");
  const [bathroomsMin, setBathroomsMin] = useState("");

  // Nice to have 
  const [elevator, setElevator] = useState<"indifferent" | "yes" | "no">("indifferent");
  const [elevatorMustHave, setElevatorMustHave] = useState(false);

  const router = useRouter();


  type FieldErrors = {
    url?: string;
    sqmMin?: string;
    sqmMax?: string;
    bathroomsMin?: string;
  };
  const [errors, setErrors] = useState<FieldErrors>({});

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: FieldErrors = {};

    // URL validation (optional, but if present must be http(s))
    if (url.trim() !== "" && !/^https?:\/\/.+/i.test(url.trim())) {
      newErrors.url = "URL must start with http:// or https://";
    }

    const minNum = sqmMin.trim() === "" ? null : Number(sqmMin);
    const maxNum = sqmMax.trim() === "" ? null : Number(sqmMax);
    const bathNum = bathroomsMin.trim() === "" ? null : Number(bathroomsMin);

    if (minNum !== null && (!Number.isFinite(minNum) || minNum < 0)) {
      newErrors.sqmMin = "sqm min must be a number ≥ 0";
    }

    if (maxNum !== null && (!Number.isFinite(maxNum) || maxNum < 0)) {
      newErrors.sqmMax = "sqm max must be a number ≥ 0";
    }

    // Only check min<=max if both are present and valid numbers
    if (
      minNum !== null &&
      maxNum !== null &&
      Number.isFinite(minNum) &&
      Number.isFinite(maxNum) &&
      minNum > maxNum
    ) {
      newErrors.sqmMax = "sqm max must be greater than or equal to sqm min";
    }

    if (bathNum !== null && (!Number.isInteger(bathNum) || bathNum < 0)) {
      newErrors.bathroomsMin = "bathrooms min must be an integer ≥ 0";
    }

    // If any errors exist, show them in UI and stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // No errors
    setErrors({});

    const params = new URLSearchParams();

    if (url.trim()) params.set("url", url.trim());
    if (sqmMin.trim()) params.set("sqmMin", sqmMin.trim());
    if (sqmMax.trim()) params.set("sqmMax", sqmMax.trim());
    if (bathroomsMin.trim()) params.set("bathroomsMin", bathroomsMin.trim());

    if (elevator !== "indifferent") params.set("elevator", elevator);
    if (elevatorMustHave) params.set("elevatorMustHave", "1");

    router.push(`/results?${params.toString()}`);
  }


  return (
    <main className="container">
      <div className="card">
        <h1 className="h1">Real Estate Advisor</h1>
        <p className="sub">Paste a listing URL and set your requirements.</p>

        <form className="form" onSubmit={onSubmit}>
          <input
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {errors.url && <p className="error">{errors.url}</p>}

          <input
            placeholder="sqm min (e.g. 70)"
            value={sqmMin}
            onChange={(e) => setSqmMin(e.target.value)}
          />
          {errors.sqmMin && <p className="error">{errors.sqmMin}</p>}

          <input
            placeholder="sqm max (e.g. 90)"
            value={sqmMax}
            onChange={(e) => setSqmMax(e.target.value)}
          />
          {errors.sqmMax && <p className="error">{errors.sqmMax}</p>}

          <input
            placeholder="bathrooms min (e.g. 2)"
            value={bathroomsMin}
            onChange={(e) => setBathroomsMin(e.target.value)}
          />
          {errors.bathroomsMin && <p className="error">{errors.bathroomsMin}</p>}

          <div style={{ marginTop: 12 }}>
            <label>
              Elevator
              <select
                value={elevator}
                onChange={(e) => {
                  const v = e.target.value as "indifferent" | "yes" | "no";
                  setElevator(v);
                  if (v === "indifferent") setElevatorMustHave(false);
                }}
                style={{ marginLeft: 8 }}
              >
                <option value="indifferent">Indifferent</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>

            <label style={{ display: "block", marginTop: 6 }}>
              <input
                type="checkbox"
                checked={elevatorMustHave}
                onChange={(e) => setElevatorMustHave(e.target.checked)}
                disabled={elevator === "indifferent"}
              />{" "}
              Must have
            </label>
          </div>

          <button className="btn" type="submit">
            Evaluate
          </button>
        </form>
      </div>
    </main>
  );

}
