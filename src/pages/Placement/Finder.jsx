import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../styles/Finder.css";
import collegeBg from "../../assets/college-bg.jpg";

/* -------------------------
   State list for autocomplete
   ------------------------- */
const STATES = [
  { State: "West Bengal" },
  { State: "Andhra Pradesh" },
  { State: "Goa" },
  { State: "Haryana" },
  { State: "Tamil Nadu" },
  { State: "Rajasthan" },
  { State: "Karnataka" },
  { State: "Delhi" },
];

export default function Finder() {
  const [location, setLocation] = useState("Karnataka");
  const [course, setCourse] = useState("CSE");
  const [topN, setTopN] = useState(5);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Autocomplete state for the search box
  const [query, setQuery] = useState("Karnataka");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://path2placement-backend.onrender.com/api/college-finder/finder",
        { location, course, topN }
      );
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch results. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Filter states based on input
  const filteredStates = STATES.filter((item) =>
    item.State.toLowerCase().startsWith(query.toLowerCase())
  ).slice(0, 8);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setLocation(value); // still send this to backend
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (stateName) => {
    setQuery(stateName);
    setLocation(stateName);
    setShowSuggestions(false);
  };

  const handleInputBlur = () => {
    // Give time for click to register
    setTimeout(() => setShowSuggestions(false), 150);
  };

  // Framer Motion variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const titleVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div className="finder-container light-theme">
      {/* Header */}
      <header className="finder-header">
        <h1>College Placement Finder</h1>
        <p>Find the best colleges based on placement data & salary insights</p>
      </header>

      {/* Input Section */}
      <div className="finder-form">
        {/* 🔽 Autocomplete wrapper for location */}
        <div className="finder-autocomplete">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleInputBlur}
            placeholder="Enter Location / State (e.g., Karnataka)"
          />

          {showSuggestions && query && filteredStates.length > 0 && (
            <ul className="finder-suggestions">
              {filteredStates.map((item) => (
                <li
                  key={item.State}
                  onMouseDown={() => handleSuggestionClick(item.State)}
                >
                  {item.State}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
          <option value="EEE">EEE</option>
          <option value="OVERALL">OVERALL</option>
        </select>

        <input
          type="number"
          value={topN}
          onChange={(e) => setTopN(e.target.value)}
          min="1"
          max="20"
        />

        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "🔍 Find Colleges"}
        </button>
      </div>

      {/* Results */}
      <div className="college-results">
        {results.map((college, idx) => {
          const bgImage = college.Image || collegeBg;

          return (
            <motion.div
              className="college-card"
              key={idx}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
            >
              {/* Stylish College Title with Dynamic Background */}
              <motion.h2
                className="college-title"
                style={{
                  background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url(${bgImage}) no-repeat center/cover`,
                }}
                variants={titleVariants}
                whileHover="hover"
              >
                {college.College}
              </motion.h2>

              <p className="nirf-rank">
                🏅 NIRF Rank: {college["NIRF Rank"]}
              </p>

              <div className="stats">
                <span>
                  📊 Avg Placement: {college["Average Placement (%)"]}%
                </span>
                <span>
                  💰 Avg Salary: {college["Average Salary (LPA)"]} LPA
                </span>
                <span>
                  🚀 Highest: {college["Highest Package (LPA)"]} LPA
                </span>
              </div>

              {college["Placement Trend"] && (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                      data={college["Placement Trend"].map(
                        ([year, value]) => ({
                          year,
                          placement: value,
                        })
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                      <XAxis dataKey="year" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          color: "#333",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="placement"
                        stroke="#007bff"
                        strokeWidth={2}
                        dot={{ fill: "#007bff" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <p className="recruiters">
                <strong>Top Recruiters:</strong>{" "}
                {college["Top Recruiters"]}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
