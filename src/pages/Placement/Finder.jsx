import React, { useState } from "react";
import axios from "axios";
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

export default function Finder() {
  const [location, setLocation] = useState("Karnataka");
  const [course, setCourse] = useState("CSE");
  const [topN, setTopN] = useState(5);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="finder-container">
      <h2>🔍 Placement Finder</h2>

      {/* Input Section */}
      <div className="finder-form">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter Location (e.g., Karnataka)"
        />
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
          {loading ? "Searching..." : "Find Colleges"}
        </button>
      </div>

      {/* Results Section */}
      <div className="college-results">
        {results.map((college, idx) => (
          <div className="college-card" key={idx}>
            <h3>{college.College}</h3>
            <p className="nirf-rank">🏅 NIRF Rank: {college["NIRF Rank"]}</p>
            <div className="stats">
              <span>📊 Avg Placement: {college["Average Placement (%)"]}%</span>
              <span>💰 Avg Salary: {college["Average Salary (LPA)"]} LPA</span>
              <span>🚀 Highest: {college["Highest Package (LPA)"]} LPA</span>
            </div>

            {/* Placement Trend Chart */}
            {college["Placement Trend"] && (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={college["Placement Trend"].map(([year, value]) => ({
                      year,
                      placement: value,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="placement" stroke="#007bff" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <p className="recruiters">
              <strong>Top Recruiters:</strong> {college["Top Recruiters"]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
