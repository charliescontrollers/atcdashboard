import { useEffect } from "react";
import { useCAT } from "../context/CatContext";

export default function CatBackground() {
  const { cat } = useCAT();

  useEffect(() => {
    document.body.dataset.cat = cat;
  }, [cat]);

  return null;
}
