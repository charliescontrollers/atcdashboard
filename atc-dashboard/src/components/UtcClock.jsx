import { useEffect, useState } from "react";

export default function UtcClock() {
  const [time, setTime] = useState(getUtcTime());

  function getUtcTime() {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC"
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getUtcTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="utc-clock">
      UTC {time}
    </div>
  );
}
