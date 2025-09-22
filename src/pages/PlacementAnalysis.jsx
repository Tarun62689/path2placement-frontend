import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaChartLine, FaSearch, FaChartBar, FaTrophy } from "react-icons/fa";
import "./styles/PlacementAnalysis.css";

const links = [
  { name: "Prediction", icon: <FaChartLine />, path: "prediction" },
  { name: "Insights", icon: <FaChartBar />, path: "insights" },
  { name: "Growth", icon: <FaTrophy />, path: "growth" },
  { name: "Finder", icon: <FaSearch />, path: "finder" },
];

function PlacementAnalysis() {
  return (
    <div className="placement-analysis-container">
      {/* Sidebar */}
      <aside className="sidebar-vertical">
        <ul className="icon-menu">
          {links.map((link, idx) => (
            <li key={idx}>
              <NavLink
                to={link.path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icon">{link.icon}</span>
                <span className="label">{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default PlacementAnalysis;
