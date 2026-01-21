import { useEffect, useState, useMemo } from "react";
import { useCAT } from "../context/CatContext";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler
);

const VIS_API =
  "https://script.google.com/macros/s/AKfycbyBxIase-cainOGmUnhwq3UcHOQmL6_dg3DtDJRQ3iDTt3dK0SLCPd5xEZQ-zrgThP_/exec?action=visibility";

// --------------------
// Helpers
// --------------------
function getCAT(vis) {
  if (vis >= 5500) return { label: "CAT I", color: "#16A34A" };
  if (vis >= 3000) return { label: "CAT II", color: "#2563EB" };
  return { label: "CAT III", color: "#DC2626" };
}

function getTrend(values) {
  if (values.length < 2)
    return { text: "Steady", symbol: "→", color: "#64748b" };

  const diff = values[0] - values[1];
  if (diff > 200) return { text: "Improving", symbol: "↑", color: "#16A34A" };
  if (diff < -200)
    return { text: "Deteriorating", symbol: "↓", color: "#DC2626" };
  return { text: "Steady", symbol: "→", color: "#64748b" };
}

function colorForValue(v) {
  if (v >= 5000) return "#16A34A";
  if (v >= 3000) return "#2563EB";
  if (v >= 2500) return "#EAB308";
  return "#DC2626";
}

// --------------------
// Component
// --------------------
export default function VisibilityPanel() {
  const { setCat } = useCAT();

  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------
  // Fetch visibility
  // --------------------
  useEffect(() => {
    fetch(VIS_API)
      .then(r => r.json())
      .then(data => {
        if (!data.series || data.series.length === 0) {
          throw new Error("No visibility data");
        }
        setSeries(data.series);
        setLoading(false);
      })
      .catch(() => {
        setError("Visibility unavailable");
        setLoading(false);
      });
  }, []);

  // --------------------
  // Derived values
  // --------------------
  const values = useMemo(
    () => series.map(p => Number(p.vis)),
    [series]
  );
  const labels = useMemo(
    () => series.map(p => p.time),
    [series]
  );

  const cat = getCAT(values[0]);
const trend = getTrend(values);

  // --------------------
  // CAT update (FIXED)
  // --------------------
  useEffect(() => {
    if (values.length > 0) {
      setCat(getCAT(values[0]));
    }
  }, [values, setCat]);

  if (loading) return <p>Loading visibility…</p>;
  if (error) return <p style={{ color: "#DC2626" }}>{error}</p>;

  function getCAT(vis) {
  if (vis >= 5500) return { label: "CAT I", level: "CAT1", color: "#16A34A" };
  if (vis >= 3000) return { label: "CAT II", level: "CAT2", color: "#2563EB" };
  return { label: "CAT III", level: "CAT3", color: "#DC2626" };
}



  // --------------------
  // Chart config
  // --------------------
  const data = {
    labels,
    datasets: [
      {
        data: values,
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: values.map(colorForValue),
        segment: {
          borderColor: ctx => colorForValue(ctx.p0.parsed.y)
        }
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true }
    }
  };

  // --------------------
  // Render
  // --------------------
  return (
    <>
      <div className="card-header">
        <div className="card-title">
          <div className="card-title-text">Visibility</div>
          <div className="card-subtitle">
            Current: <strong>{values[0]} m</strong>
          </div>
        </div>

        <div className="card-meta">
          <span style={{ color: cat.color, fontWeight: 600 }}>
            {cat.label}
          </span>
          <span style={{ color: trend.color, marginLeft: 12 }}>
            {trend.symbol} {trend.text}
          </span>
        </div>
      </div>

      <div className="card-content">
        {/* 🔑 FIX: fixed height + key */}
        <div style={{ height: 260 }}>
          <Line
            key={values.join("-")}
            data={data}
            options={options}
          />
        </div>
      </div>
    </>
  );
}
