"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";

type YesNoIndifferent = "indifferent" | "yes" | "no";

type FieldErrors = {
  url?: string;
  sqmMin?: string;
  sqmMax?: string;
  bathroomsMin?: string;
};

function ynToBool(v: YesNoIndifferent): boolean | null {
  if (v === "indifferent") return null;
  return v === "yes";
}

export default function Home() {
  // Basic fields
  const [url, setUrl] = useState("");
  const [sqmMin, setSqmMin] = useState("");
  const [sqmMax, setSqmMax] = useState("");
  const [bathroomsMin, setBathroomsMin] = useState("");

  // Preferences currently on UI
  const [elevator, setElevator] = useState<YesNoIndifferent>("indifferent");
  const [elevatorMustHave, setElevatorMustHave] = useState(false);

  const [outdoorParking, setOutdoorParking] =
    useState<YesNoIndifferent>("indifferent");
  const [outdoorParkingMustHave, setOutdoorParkingMustHave] = useState(false);

  // UI errors + submit status
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitMsg, setSubmitMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitMsg("");

    const newErrors: FieldErrors = {};

    // URL validation
    if (url.trim() === "") {
      newErrors.url = "URL is required";
    } else if (!/^https?:\/\/.+/i.test(url.trim())) {
      newErrors.url = "URL must start with http:// or https://";
    }

    // Numbers
    const minNum = sqmMin.trim() === "" ? null : Number(sqmMin);
    const maxNum = sqmMax.trim() === "" ? null : Number(sqmMax);
    const bathNum = bathroomsMin.trim() === "" ? null : Number(bathroomsMin);

    if (minNum !== null && (!Number.isFinite(minNum) || minNum < 0)) {
      newErrors.sqmMin = "sqm min must be a number ≥ 0";
    }
    if (maxNum !== null && (!Number.isFinite(maxNum) || maxNum < 0)) {
      newErrors.sqmMax = "sqm max must be a number ≥ 0";
    }
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // Convert yes/no/indifferent to boolean or omit
    const elevatorBool = ynToBool(elevator);
    const outdoorParkingBool = ynToBool(outdoorParking);

    // Build the long JSON in the exact shape you defined
    const payload: any = {
      url: url.trim(),

      // Not on UI yet: default for now (you can add UI later)
      price: {
        max: 450000,
        must_have: true,
      },

      surface_sqm: {
        min: minNum ?? 80,
        max: maxNum ?? 100,
        must_have: true,
      },

      bathrooms: {
        min: bathNum ?? 2,
        must_have: true,
      },

      // Elevator: if indifferent, still send as default false? (better: omit)
      // We will OMIT if indifferent to avoid lying.
      // Same for outdoor_parking.
      // (Backend can treat missing as "not specified")
    };

    if (elevatorBool !== null) {
      payload.elevator = {
        value: elevatorBool,
        must_have: elevatorMustHave,
      };
    }

    if (outdoorParkingBool !== null) {
      payload.outdoor_parking = {
        value: outdoorParkingBool,
        must_have: outdoorParkingMustHave,
      };
    }

    // Not on UI yet: send defaults for now (you can later connect to UI)
    payload.garage = { value: true, must_have: false };
    payload.balcony = { value: true, must_have: false };
    payload.is_attic = { value: false, must_have: false };
    payload.floor = { min: 3, must_have: true };
    payload.needs_restructuring = { value: false, must_have: true };

    try {
      const res = await fetch("http://127.0.0.1:8000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setSubmitMsg(`Backend error: HTTP ${res.status}`);
        return;
      }

      const data = await res.json().catch(() => null);
      setSubmitMsg(
        `Sent to backend ✅ (${data?.status ?? "ok"}). Check your backend terminal for the printed JSON.`
      );
    } catch (err: any) {
      setSubmitMsg(`Failed to reach backend: ${err?.message ?? String(err)}`);
    }
  }

  return (
    <main className="container">
      <div className="card">
        <h1 className="h1">Real Estate Advisor</h1>
        <p className="sub">Paste a listing URL and set your requirements.</p>

        <form className="form" onSubmit={onSubmit}>
          {/* URL */}
          <div className="field">
            <label className="label">Listing URL</label>
            <input
              className="input"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {errors.url && <p className="error">{errors.url}</p>}
          </div>

          {/* sqm min/max */}
          <div className="row2">
            <div className="field">
              <label className="label">Min surface (sqm)</label>
              <input
                className="input"
                placeholder="e.g. 80"
                value={sqmMin}
                onChange={(e) => setSqmMin(e.target.value)}
              />
              {errors.sqmMin && <p className="error">{errors.sqmMin}</p>}
            </div>

            <div className="field">
              <label className="label">Max surface (sqm)</label>
              <input
                className="input"
                placeholder="e.g. 100"
                value={sqmMax}
                onChange={(e) => setSqmMax(e.target.value)}
              />
              {errors.sqmMax && <p className="error">{errors.sqmMax}</p>}
            </div>
          </div>

          {/* bathrooms */}
          <div className="field">
            <label className="label">Bathrooms (min)</label>
            <input
              className="input"
              placeholder="e.g. 2"
              value={bathroomsMin}
              onChange={(e) => setBathroomsMin(e.target.value)}
            />
            {errors.bathroomsMin && (
              <p className="error">{errors.bathroomsMin}</p>
            )}
          </div>

          {/* elevator */}
          <div className="field">
            <label className="label">Elevator</label>
            <select
              className="select"
              value={elevator}
              onChange={(e) => {
                const v = e.target.value as YesNoIndifferent;
                setElevator(v);
                if (v === "indifferent") setElevatorMustHave(false);
              }}
            >
              <option value="indifferent">Indifferent</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>

            <label className="label" style={{ display: "flex", gap: 8 }}>
              <input
                type="checkbox"
                checked={elevatorMustHave}
                onChange={(e) => setElevatorMustHave(e.target.checked)}
                disabled={elevator === "indifferent"}
              />
              Must have
            </label>
          </div>

          {/* outdoor parking */}
          <div className="field">
            <label className="label">Outdoor parking</label>
            <select
              className="select"
              value={outdoorParking}
              onChange={(e) => {
                const v = e.target.value as YesNoIndifferent;
                setOutdoorParking(v);
                if (v === "indifferent") setOutdoorParkingMustHave(false);
              }}
            >
              <option value="indifferent">Indifferent</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>

            <label className="label" style={{ display: "flex", gap: 8 }}>
              <input
                type="checkbox"
                checked={outdoorParkingMustHave}
                onChange={(e) => setOutdoorParkingMustHave(e.target.checked)}
                disabled={outdoorParking === "indifferent"}
              />
              Must have
            </label>
          </div>

          <button className="btn" type="submit">
            Evaluate
          </button>

          {submitMsg && (
            <p className="sub" style={{ marginTop: 10 }}>
              {submitMsg}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
