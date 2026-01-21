import { motion } from "framer-motion";

export default function AnimatedCard({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
}
