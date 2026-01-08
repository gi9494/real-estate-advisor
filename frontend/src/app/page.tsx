"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";

type YesNoIndifferent = "indifferent" | "yes" | "no";

type FieldErrors = {
  url?: string;
  priceMax?: string;
  sqmMin?: string;
  sqmMax?: string;
  bathroomsMin?: string;
  floorMin?: string;
};

function ynToBool(v: YesNoIndifferent): boolean {
  // Nota: nel tuo JSON "value" è boolean, quindi qui scegliamo:
  // indifferent => false (ma tu potresti preferire default true o "not specified" in futuro)
  // Per rispettare ESATTAMENTE la shape JSON, mettiamo sempre un boolean.
  return v === "yes";
}

export default function Home() {
  // URL
  const [url, setUrl] = useState("");

  // Price
  const [priceMax, setPriceMax] = useState("");
  const [priceMustHave, setPriceMustHave] = useState(true);

  // Surface
  const [sqmMin, setSqmMin] = useState("");
  const [sqmMax, setSqmMax] = useState("");
  const [surfaceMustHave, setSurfaceMustHave] = useState(true);

  // Bathrooms
  const [bathroomsMin, setBathroomsMin] = useState("");
  const [bathroomsMustHave, setBathroomsMustHave] = useState(true);

  // Yes/No fields + must_have toggles
  const [elevator, setElevator] = useState<YesNoIndifferent>("indifferent");
  const [elevatorMustHave, setElevatorMustHave] = useState(true);

  const [outdoorParking, setOutdoorParking] =
    useState<YesNoIndifferent>("indifferent");
  const [outdoorParkingMustHave, setOutdoorParkingMustHave] = useState(false);

  const [garage, setGarage] = useState<YesNoIndifferent>("indifferent");
  const [garageMustHave, setGarageMustHave] = useState(false);

  const [balcony, setBalcony] = useState<YesNoIndifferent>("indifferent");
  const [balconyMustHave, setBalconyMustHave] = useState(false);

  const [isAttic, setIsAttic] = useState<YesNoIndifferent>("indifferent");
  const [isAtticMustHave, setIsAtticMustHave] = useState(false);

  // Floor
  const [floorMin, setFloorMin] = useState("");
  const [floorMustHave, setFloorMustHave] = useState(true);

  // Restructuring
  const [needsRestructuring, setNeedsRestructuring] =
    useState<YesNoIndifferent>("indifferent");
  const [needsRestructuringMustHave, setNeedsRestructuringMustHave] =
    useState(true);

  // UI state
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitMsg, setSubmitMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitMsg("");

    const newErrors: FieldErrors = {};

    // URL
    if (url.trim() === "") newErrors.url = "URL is required";
    else if (!/^https?:\/\/.+/i.test(url.trim())) {
      newErrors.url = "URL must start with http:// or https://";
    }

    // Numbers parsing
    const priceNum = priceMax.trim() === "" ? null : Number(priceMax);
    const minNum = sqmMin.trim() === "" ? null : Number(sqmMin);
    const maxNum = sqmMax.trim() === "" ? null : Number(sqmMax);
    const bathNum = bathroomsMin.trim() === "" ? null : Number(bathroomsMin);
    const floorNum = floorMin.trim() === "" ? null : Number(floorMin);

    // price max
    if (priceNum !== null && (!Number.isFinite(priceNum) || priceNum < 0)) {
      newErrors.priceMax = "price max must be a number ≥ 0";
    }

    // surface min/max
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

    // bathrooms
    if (bathNum !== null && (!Number.isInteger(bathNum) || bathNum < 0)) {
      newErrors.bathroomsMin = "bathrooms min must be an integer ≥ 0";
    }

    // floor
    if (floorNum !== null && (!Number.isInteger(floorNum) || floorNum < 0)) {
      newErrors.floorMin = "floor min must be an integer ≥ 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // Build payload in EXACT shape
    const payload = {
      url: url.trim(),

      price: {
        max: priceNum ?? 450000,
        must_have: priceMustHave,
      },

      surface_sqm: {
        min: minNum ?? 80,
        max: maxNum ?? 100,
        must_have: surfaceMustHave,
      },

      bathrooms: {
        min: bathNum ?? 2,
        must_have: bathroomsMustHave,
      },

      elevator: {
        value: ynToBool(elevator),
        must_have: elevatorMustHave,
      },

      outdoor_parking: {
        value: ynToBool(outdoorParking),
        must_have: outdoorParkingMustHave,
      },

      garage: {
        value: ynToBool(garage),
        must_have: garageMustHave,
      },

      balcony: {
        value: ynToBool(balcony),
        must_have: balconyMustHave,
      },

      is_attic: {
        value: ynToBool(isAttic),
        must_have: isAtticMustHave,
      },

      floor: {
        min: floorNum ?? 3,
        must_have: floorMustHave,
      },

      needs_restructuring: {
        value: ynToBool(needsRestructuring),
        must_have: needsRestructuringMustHave,
      },
    };

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
        `Sent to backend ✅ (${data?.status ?? "ok"}). Check the backend terminal for printed JSON.`
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

          {/* Price */}
          <div className="field">
            <label className="label">Max price</label>
            <input
              className="input"
              placeholder="e.g. 450000"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
            {errors.priceMax && <p className="error">{errors.priceMax}</p>}

            <label className="label" style={{ display: "flex", gap: 8 }}>
              <input
                type="checkbox"
                checked={priceMustHave}
                onChange={(e) => setPriceMustHave(e.target.checked)}
              />
              Must have
            </label>
          </div>

          {/* Surface */}
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

          <label className="label" style={{ display: "flex", gap: 8 }}>
            <input
              type="checkbox"
              checked={surfaceMustHave}
              onChange={(e) => setSurfaceMustHave(e.target.checked)}
            />
            Surface must have
          </label>

          {/* Bathrooms */}
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

            <label className="label" style={{ display: "flex", gap: 8 }}>
              <input
                type="checkbox"
                checked={bathroomsMustHave}
                onChange={(e) => setBathroomsMustHave(e.target.checked)}
              />
              Must have
            </label>
          </div>

          {/* Elevator */}
          <PreferenceBlock
            title="Elevator"
            value={elevator}
            setValue={setElevator}
            mustHave={elevatorMustHave}
            setMustHave={setElevatorMustHave}
          />

          {/* Outdoor parking */}
          <PreferenceBlock
            title="Outdoor parking"
            value={outdoorParking}
            setValue={setOutdoorParking}
            mustHave={outdoorParkingMustHave}
            setMustHave={setOutdoorParkingMustHave}
          />

          {/* Garage */}
          <PreferenceBlock
            title="Garage"
            value={garage}
            setValue={setGarage}
            mustHave={garageMustHave}
            setMustHave={setGarageMustHave}
          />

          {/* Balcony */}
          <PreferenceBlock
            title="Balcony"
            value={balcony}
            setValue={setBalcony}
            mustHave={balconyMustHave}
            setMustHave={setBalconyMustHave}
          />

          {/* Attic */}
          <PreferenceBlock
            title="Attic"
            value={isAttic}
            setValue={setIsAttic}
            mustHave={isAtticMustHave}
            setMustHave={setIsAtticMustHave}
          />

          {/* Floor */}
          <div className="field">
            <label className="label">Floor (min)</label>
            <input
              className="input"
              placeholder="e.g. 3"
              value={floorMin}
              onChange={(e) => setFloorMin(e.target.value)}
            />
            {errors.floorMin && <p className="error">{errors.floorMin}</p>}

            <label className="label" style={{ display: "flex", gap: 8 }}>
              <input
                type="checkbox"
                checked={floorMustHave}
                onChange={(e) => setFloorMustHave(e.target.checked)}
              />
              Must have
            </label>
          </div>

          {/* Needs restructuring */}
          <PreferenceBlock
            title="Needs restructuring"
            value={needsRestructuring}
            setValue={setNeedsRestructuring}
            mustHave={needsRestructuringMustHave}
            setMustHave={setNeedsRestructuringMustHave}
          />

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

// Small helper component (so the file stays readable)
function PreferenceBlock(props: {
  title: string;
  value: YesNoIndifferent;
  setValue: (v: YesNoIndifferent) => void;
  mustHave: boolean;
  setMustHave: (b: boolean) => void;
}) {
  const { title, value, setValue, mustHave, setMustHave } = props;

  return (
    <div className="field">
      <label className="label">{title}</label>
      <select
        className="select"
        value={value}
        onChange={(e) => setValue(e.target.value as YesNoIndifferent)}
      >
        <option value="indifferent">Indifferent</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      <label className="label" style={{ display: "flex", gap: 8 }}>
        <input
          type="checkbox"
          checked={mustHave}
          onChange={(e) => setMustHave(e.target.checked)}
        />
        Must have
      </label>
    </div>
  );
}
