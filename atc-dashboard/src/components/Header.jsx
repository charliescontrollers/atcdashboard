import "./Header.css";
import useDarkMode from "../hooks/useDarkMode";
import UtcClock from "./UtcClock";

export default function Header() {
  const { dark, toggle } = useDarkMode();
  return (
    <header className="app-header">
      <div className="header-left">
        <span className="logo">ATC Ops Dashboard</span>
      </div>

      <nav className="header-nav">
        <a href="#" className="nav-link">Dashboard</a>
        <a href="#" className="nav-link">Operations</a>
        <a href="#" className="nav-link">Analytics</a>
      </nav>

      <div className="header-actions">
         <UtcClock />
        <button className="theme-toggle" onClick={toggle}>
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
}
