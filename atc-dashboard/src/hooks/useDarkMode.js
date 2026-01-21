import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [dark, setDark] = useState(false);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setDark(saved === "dark");
      setManual(true);
      document.body.classList.toggle("dark", saved === "dark");
      return;
    }

    // Auto night mode: 22:00–05:00
    const hour = new Date().getHours();
    const autoDark = hour >= 22 || hour < 5;

    setDark(autoDark);
    document.body.classList.toggle("dark", autoDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    setManual(true);
    document.body.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return { dark, toggle };
}
