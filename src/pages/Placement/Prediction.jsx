import React, { useState } from "react";
import axios from "axios";

export default function Prediction() {
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!college) return;

    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const response = await axios.post(
        "https://path2placement-backend.onrender.com/api/ml/predict",
        { collegeName: college }
      );
      setPrediction(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h2>📊 Placement Prediction</h2>

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
          {loading ? "Loading..." : "Get Prediction"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {prediction && (
        <div
          style={{
            background: "rgba(229, 231, 235, 0.92)",
            backdropFilter: "blur(16px)",
            padding: "1rem",
            borderRadius: "12px",
          }}
        >
          <h3>{prediction.college}</h3>
          {Object.entries(prediction.predictions).map(([year, data]) => (
            <div key={year} style={{ marginBottom: "0.5rem" }}>
              <strong>{year}</strong> — Placement: {data.placement}%, Avg Salary: {data.salary} LPA
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
