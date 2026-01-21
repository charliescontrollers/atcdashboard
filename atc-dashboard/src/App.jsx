import Header from "./components/Header";
import { useCAT } from "./context/CatContext";

import "./styles/dashboard.css";

import VisibilityPanel from "./components/VisibilityPanel";
import WeatherPanel from "./components/WeatherPanel";
import UnitDistribution from "./components/UnitDistribution";
import Notams from "./components/Notams";
import AnimatedCard from "./components/AnimatedCard";

export default function App() {
   const { cat } = useCAT();
  return (
    <>
     <div className={`app-root ${cat.level}`}>
      <Header />
      

      <div className="dashboard">
        <AnimatedCard className="grid-vis" delay={0}>
          <div className="card">
            <VisibilityPanel />
          </div>
        </AnimatedCard>

        <AnimatedCard className="grid-weather" delay={0.05}>
          <div className="card">
            <WeatherPanel />
          </div>
        </AnimatedCard>

        <AnimatedCard className="grid-unit" delay={0.1}>
          <div className="card">
            <UnitDistribution />
          </div>
        </AnimatedCard>

        <AnimatedCard className="grid-notam" delay={0.15}>
          <div className="card">
            <Notams />
          </div>
        </AnimatedCard>
      </div>
      </div>
    
    </>
  );
}
