import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FaChartArea, FaSearch, FaChartBar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/PlacementAnalysis.css";

const links = [
  { name: "Prediction", icon: <FaChartArea />, path: "prediction" },
  { name: "Finder", icon: <FaSearch />, path: "finder" },
  { name: "Insights", icon: <FaChartBar />, path: "insights" },
  // Growth removed
];

function PlacementAnalysis() {
  const location = useLocation();

  // Sidebar item animation
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    hover: { scale: 1.05, color: "#4a90e2", transition: { duration: 0.2 } },
  };

  // Main content animation
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="placement-analysis-container">
      {/* Sidebar */}
      <aside className="sidebar-vertical">
        <ul className="icon-menu">
          {links.map((link, idx) => (
            <motion.li
              key={idx}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <NavLink
                to={link.path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icon">{link.icon}</span>
                <span className="label">{link.name}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </aside>

      {/* Main content with page transitions */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default PlacementAnalysis;
