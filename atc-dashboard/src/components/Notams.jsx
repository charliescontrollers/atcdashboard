import { useEffect, useState } from "react";
import { getCountdown } from "../utils/notamTime";

const NOTAM_API =
  "https://script.google.com/macros/s/AKfycbxwekfoSlXLX7t24flTkK2fZEVr8VA3pjb1FtTiPEVXekzv98a2omIb4yd2M9ZevxnY/exec?action=notams&callback=handleNotams";

export default function Notams() {
  const [today, setToday] = useState({ date: "", notams: [] });
  const [tomorrow, setTomorrow] = useState({ date: "", notams: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.handleNotams = payload => {
      console.log("NOTAM payload received:", payload);

      if (
        payload &&
        payload.today &&
        payload.tomorrow &&
        Array.isArray(payload.today.notams) &&
        Array.isArray(payload.tomorrow.notams)
      ) {
        setToday(payload.today);
        setTomorrow(payload.tomorrow);
      }

      setLoading(false);
    };

    const script = document.createElement("script");
    script.src = NOTAM_API;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      delete window.handleNotams;
      document.body.removeChild(script);
    };
  }, []);

  if (loading) return <p>Loading NOTAMs…</p>;

  return (
    <>
      {/* TODAY */}
      <div className="card-header">
        <div className="card-title">
          <span className="card-title-text">NOTAMs – Today</span>
          <span className="card-subtitle">{today.date || "—"}</span>
        </div>
      </div>

      {today.notams.length === 0 ? (
        <p className="notam-empty">No NOTAMs for today</p>
      ) : (
        <div className="notam-list">
          {today.notams.map((n, i) => (
            <div key={i} className="notam-item">
              <div className="notam-type">{n.type}</div>
              <div className="notam-text">{n.text}</div>
              <div className="notam-validity">{n.validity}</div>
            </div>
          ))}
        </div>
      )}

      {/* TOMORROW */}
      <div className="card-header" style={{ marginTop: 20 }}>
        <div className="card-title">
          <span className="card-title-text">Tomorrow Preview</span>
          <span className="card-subtitle">{tomorrow.date || "—"}</span>
        </div>
      </div>

      {tomorrow.notams.length === 0 ? (
        <p className="notam-empty">No NOTAMs for tomorrow</p>
      ) : (
        <div className="notam-list">
          {tomorrow.notams.map((n, i) => (
            <div key={i} className="notam-item" style={{ opacity: 0.75 }}>
              <div className="notam-type">{n.type}</div>
              <div className="notam-text">{n.text}</div>
              <div className="notam-validity">{n.validity}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
