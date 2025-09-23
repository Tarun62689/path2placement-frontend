import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../styles/Insights.css";

export default function Insights() {
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!college.trim()) return; // prevent empty spaces
    setLoading(true);
    setError("");
    setInsights(null);

    try {
      const response = await axios.post(
        "https://path2placement-backend.onrender.com/api/college-insights/insights",
        { collegeName: college }
      );
      setInsights(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="insights-container">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="page-title"
      >
        📈 Placement Insights
      </motion.h2>

      <form className="insights-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter college name"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
        />
        <button type="submit">{loading ? "Loading..." : "Get Insights"}</button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {insights && (
        <div className="insights-grid">
          {/* Main College Card */}
          <motion.div
            className="insights-card main-college"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="insights-header">
              <img src={insights.collegeImage} alt={insights.college} />
              <div className="college-overlay">
                <div className="college-title">{insights.college}</div>
                {insights.collegeLogo && (
                  <img
                    src={insights.collegeLogo}
                    className="college-logo"
                    alt="College Logo"
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Small Cards */}
          <motion.div
            className="insights-card small-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h4>📊 Placement Trends (%)</h4>
            <ul>
              {Object.entries(insights.placementTrends).map(([year, placement]) => (
                <li key={year}>
                  {year}: {placement}%
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="insights-card small-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h4>💰 Salary Trends</h4>
            <ul>
              {Object.entries(insights.salaryTrends).map(([year, data]) => (
                <li key={year}>
                  {year} — Median: {data.median}, Highest: {data.highest}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="insights-card small-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h4>🏢 Top Recruiters</h4>
            <ul>
              {insights.topRecruiters.map((company, idx) => (
                <li key={idx}>{company}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="insights-card small-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h4>🎯 Average Placement</h4>
            <p>{insights.averagePlacement}%</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
