import { useEffect, useState } from "react";


const WEATHER_API =
  "https://script.google.com/macros/s/AKfycbxwekfoSlXLX7t24flTkK2fZEVr8VA3pjb1FtTiPEVXekzv98a2omIb4yd2M9ZevxnY/exec?action=visibility";

export default function WeatherPanel() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(WEATHER_API)
      .then(r => r.json())
      .then(data => {
        if (!data.weather) {
          throw new Error("No weather data");
        }
        setWeather(data.weather);
        setLoading(false);
      })
      .catch(() => {
        setError("Weather unavailable");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading weather…</p>;
  if (error) return <p style={{ color: "#DC2626" }}>{error}</p>;

  return (
    <>
   <div className="card-header">
  <div className="card-title">
    <div className="card-title-text">Current Weather</div>
    <div className="card-subtitle"></div>
  </div>

  <div className="card-meta">
    VOBL
  </div>
</div>


      <div className="weather-grid">
        <WeatherItem label="Wind" value={weather.wind} />
        <WeatherItem label="Visibility" value={weather.visibility} />
        <WeatherItem label="Weather" value={weather.weather} />
        <WeatherItem label="Clouds" value={weather.clouds} />
        <WeatherItem label="Temp / Dew" value={weather.temp} />
        <WeatherItem label="QNH" value={weather.qnh} />
      </div>
    </>
  );
}

function WeatherItem({ label, value }) {
  return (
    <div className="weather-item">
      <div className="weather-label">{label}</div>
      <div className="weather-value">
        {value && value !== "" ? value : "—"}
      </div>
    </div>
  );
}
