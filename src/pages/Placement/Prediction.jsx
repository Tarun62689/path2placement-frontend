import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

// Initialize Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Helper to normalize years
const normalizeYear = (yearStr) => {
  if (!yearStr) return 0;
  if (yearStr.includes("-")) {
    const parts = yearStr.split("-");
    return Number(parts[1]) || Number(parts[0]);
  }
  return Number(yearStr);
};

export default function PredictionWithChart() {
  const [college, setCollege] = useState("Manipal Institute of Technology");
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [collegeInfo, setCollegeInfo] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!college) return;

    setLoading(true);
    setError("");
    setChartData([]);
    setCollegeInfo(null);

    try {
      // Fetch past data
      const { data: pastData, error: supabaseError } = await supabase
        .from("College_Placements_Data")
        .select(
          `"Year","Placement Percentage","Median Salary (LPA)","College Name","College Image","City","State","NIRF Rank"`
        )
        .eq("College Name", college);

      if (supabaseError) throw supabaseError;

      if (!pastData.length) {
        throw new Error("No past data found");
      }

      const collegeImg = pastData[0]["College Image"] || "";
      const city = pastData[0].City;
      const state = pastData[0].State;
      const rank = pastData[0]["NIRF Rank"];
      setCollegeInfo({ name: college, image: collegeImg, city, state, rank });

      // Fetch predicted data
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/ml/predict`,
        { collegeName: college }
      );
      const predictionData = response.data.predictions;

      // Combine past + predicted data
      const combinedData = [];

      pastData.forEach((item) => {
        combinedData.push({
          year: normalizeYear(item.Year),
          yearLabel: item.Year,
          placementPast: item["Placement Percentage"],
          salaryPast: item["Median Salary (LPA)"],
        });
      });

      // Add predicted data (from API + fallback 2024-2025)
      const defaultPredictions = {
        "2024": { placement: 84.95, salary: 7.28 },
        "2025": { placement: 86.65, salary: 7.65 },
      };

      Object.entries({ ...defaultPredictions, ...predictionData }).forEach(
        ([year, pred]) => {
          const normYear = normalizeYear(year);
          const existing = combinedData.find((d) => d.year === normYear);
          if (existing) {
            existing.placementPredicted = pred.placement;
            existing.salaryPredicted = pred.salary;
          } else {
            combinedData.push({
              year: normYear,
              yearLabel: year,
              placementPredicted: pred.placement,
              salaryPredicted: pred.salary,
            });
          }
        }
      );

      combinedData.sort((a, b) => a.year - b.year);
      setChartData(combinedData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
        background: "#ffff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        📊 Placement Prediction
      </h2>

      {/* College Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "700px",
          display: "flex",
          marginBottom: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Enter college name"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          style={{
            flex: 1,
            padding: "0.6rem 1rem",
            borderRadius: "8px 0 0 8px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "0 8px 8px 0",
            background: "#2575fc",
            color: "#fff",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Loading..." : "Get Data"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 1️⃣ College Hero Section */}
      {collegeInfo && (
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            height: "200px",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "1rem",
            color: "#fff",
            display: "flex",
            alignItems: "flex-end",
            padding: "1rem",
            backgroundImage: `url(${collegeInfo.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              backdropFilter: "blur(5px)",
              padding: "1rem",
              borderRadius: "12px",
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
            <h2 style={{ margin: 0 }}>{collegeInfo.name}</h2>
            <p style={{ margin: "0.2rem 0" }}>
              📍 {collegeInfo.city}, {collegeInfo.state}
            </p>
            <p style={{ margin: 0 }}>🏆 NIRF Rank: {collegeInfo.rank || "N/A"}</p>
          </div>
        </div>
      )}

      {/* 2️⃣ + 3️⃣ Graph & Prediction Cards */}
      {chartData.length > 0 && (
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1rem",
          }}
        >
          {/* Graph */}
          <div
            style={{
              borderRadius: "16px",
              background: "#fff",
              padding: "1rem",
              boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem" }}>📉 Trends</h3>
            <div style={{ height: "250px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis dataKey="yearLabel" />
                  <YAxis
                    yAxisId="left"
                    label={{
                      value: "Placement %",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Median Salary (LPA)",
                      angle: -90,
                      position: "insideRight",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="placementPast"
                    stroke="#4a90e2"
                    name="Placement % (Past)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="salaryPast"
                    stroke="#f39c12"
                    name="Median Salary (Past)"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="placementPredicted"
                    stroke="#2ecc71"
                    strokeDasharray="5 5"
                    name="Placement % (Predicted)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="salaryPredicted"
                    stroke="#e74c3c"
                    strokeDasharray="5 5"
                    name="Median Salary (Predicted)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Prediction Text Card (Small) */}
          <div
            style={{
              borderRadius: "12px",
              background: "#fff",
              padding: "0.8rem 1rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              maxWidth: "300px",       
              fontSize: "0.9rem",      
              lineHeight: "1.4rem",
            }}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>📈 Predicted Data</h4>
            {chartData
              .filter((d) => d.placementPredicted || d.salaryPredicted)
              .map((d) => (
                <div key={d.year} style={{ marginBottom: "0.4rem" }}>
                  <strong>{d.yearLabel}</strong> — Placement:{" "}
                  {d.placementPredicted || "-"}%, Salary:{" "}
                  {d.salaryPredicted || "-"} LPA
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
