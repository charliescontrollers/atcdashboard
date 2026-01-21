import { useEffect, useState } from "react";

const UNIT_API =
  "https://script.google.com/macros/s/AKfycbwgItqRIUEf4tuBiCQIVASEkVdNIOXmVo_arYDV8oC0AX21qESl9SOe_jXZu4flL-pa/exec?action=today";

export default function UnitDistribution() {
  const [rows, setRows] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(UNIT_API)
      .then(r => r.json())
      .then(data => {
        if (!data.data || data.data.length === 0) {
          throw new Error("No distribution data");
        }
        setDate(data.date);
        setRows(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unit distribution unavailable");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading unit distribution…</p>;
  if (error) return <p style={{ color: "#DC2626" }}>{error}</p>;

  return (
    <>
      <div className="card-header">
  <div className="card-title">
    <span className="card-title-text">Unit Distribution</span>
    <span className="card-subtitle">{date}</span>
  </div>

  <div className="card-meta">
    SHIFT C
  </div>
</div>

      <div className="unit-table">
        {rows.map((row, idx) => {
          const [unit, people] = row;

          // Blank separator row
          if (!unit && !people) {
            return <div key={idx} className="unit-separator" />;
          }

          return (
            <div key={idx} className="unit-row">
              <div className="unit-name">{unit}</div>
              <div className="unit-people">{people}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
