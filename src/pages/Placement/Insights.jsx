import React, { useState } from "react";
import axios from "axios";

export default function Insights() {
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!college) return;

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

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2>📈 Placement Insights</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Enter college name"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          style={{
            padding: "0.6rem 1rem",
            width: "100%",
            marginBottom: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.6rem 1.5rem",
            borderRadius: "8px",
            background: "#2575fc",
            color: "#fff",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Loading..." : "Get Insights"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {insights && (
        <div
          style={{
            background: "rgba(229, 231, 235, 0.92)",
            backdropFilter: "blur(16px)",
            padding: "1.5rem",
            borderRadius: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
            <img
              src={insights.collegeImage}
              alt={insights.college}
              style={{ width: "80px", height: "80px", borderRadius: "12px", marginRight: "1rem" }}
            />
            <h3>{insights.college}</h3>
          </div>

          <h4>Placement Trends (%)</h4>
          <ul>
            {Object.entries(insights.placementTrends).map(([year, placement]) => (
              <li key={year}>
                {year}: {placement}%
              </li>
            ))}
          </ul>

          <h4>Salary Trends</h4>
          <ul>
            {Object.entries(insights.salaryTrends).map(([year, data]) => (
              <li key={year}>
                {year} — Median: {data.median}, Highest: {data.highest}
              </li>
            ))}
          </ul>

          <h4>Top Recruiters</h4>
          <ul>
            {insights.topRecruiters.map((company, idx) => (
              <li key={idx}>{company}</li>
            ))}
          </ul>

          <p>
            <strong>Average Placement:</strong> {insights.averagePlacement}%
          </p>
        </div>
      )}
    </div>
  );
}
