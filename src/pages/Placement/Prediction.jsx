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

/* -------------------------
   College list for autocomplete
   ------------------------- */
const COLLEGES = [
  { institute_name: "Aligarh Muslim University" },
  { institute_name: "Amity University" },
  { institute_name: "Amrita Vishwa Vidyapeetham" },
  { institute_name: "Anna University" },
  { institute_name: "Banasthali Vidyapith" },
  { institute_name: "Birla Institute of Technology" },
  { institute_name: "Birla Institute of Technology & Science" },
  { institute_name: "Centurion University of Technology and Management" },
  { institute_name: "Chandigarh University" },
  { institute_name: "Chitkara University" },
  { institute_name: "Christ University" },
  { institute_name: "Delhi Technological University" },
  { institute_name: "Dr. B. R. Ambedkar National Institute of Technology" },
  { institute_name: "Gandhi Institute of Technology and Management" },
  { institute_name: "Graphic Era University" },
  { institute_name: "Guru Gobind Singh Indraprastha University" },
  { institute_name: "Indian Institute of Engineering Science and Technology" },
  { institute_name: "Indian Institute of Space Science and Technology" },
  {
    institute_name:
      "Indian Institute of Technology (Banaras Hindu University) Varanasi",
  },
  { institute_name: "Indian Institute of Technology (Indian School of Mines)" },
  { institute_name: "Indian Institute of Technology Bhubaneswar" },
  { institute_name: "Indian Institute of Technology Bombay" },
  { institute_name: "Indian Institute of Technology Delhi" },
  { institute_name: "Indian Institute of Technology Gandhinagar" },
  { institute_name: "Indian Institute of Technology Guwahati" },
  { institute_name: "Indian Institute of Technology Hyderabad" },
  { institute_name: "Indian Institute of Technology Indore" },
  { institute_name: "Indian Institute of Technology Jammu" },
  { institute_name: "Indian Institute of Technology Jodhpur" },
  { institute_name: "Indian Institute of Technology Kanpur" },
  { institute_name: "Indian Institute of Technology Kharagpur" },
  { institute_name: "Indian Institute of Technology Madras" },
  { institute_name: "Indian Institute of Technology Mandi" },
  { institute_name: "Indian Institute of Technology Patna" },
  { institute_name: "Indian Institute of Technology Roorkee" },
  { institute_name: "Indian Institute of Technology Ropar" },
  { institute_name: "Indian Institute of Technology, Tirupati" },
  { institute_name: "Indraprastha Institute of Information Technology" },
  { institute_name: "Institute of Chemical Technology" },
  {
    institute_name:
      "International Institute of Information Technology Hyderabad",
  },
  { institute_name: "Jadavpur University" },
  { institute_name: "Jain university" },
  { institute_name: "Jamia Millia Islamia" },
  {
    institute_name: "Kalasalingam Academy of Research and Higher Education",
  },
  { institute_name: "Kalinga Institute of Industrial Technology" },
  {
    institute_name:
      "Koneru Lakshmaiah Education Foundation University (K L College of Engineering)",
  },
  { institute_name: "Lovely Professional University" },
  { institute_name: "M. G. R. Educational and Research Institute" },
  { institute_name: "Maharishi Markandeshwar" },
  { institute_name: "Malaviya National Institute of Technology" },
  {
    institute_name:
      "Manav Rachna International Institute of Research & Studies",
  },
  { institute_name: "Manipal Institute of Technology" },
  { institute_name: "Motilal Nehru National Institute of Technology" },
  { institute_name: "National Institute of Technology Calicut" },
  { institute_name: "National Institute of Technology Durgapur" },
  { institute_name: "National Institute of Technology Karnataka" },
  { institute_name: "National Institute of Technology Rourkela" },
  { institute_name: "National Institute of Technology Silchar" },
  { institute_name: "National Institute of Technology Tiruchirappalli" },
  { institute_name: "National Institute of Technology Warangal" },
  { institute_name: "Netaji Subhas University of Technology (NSUT)" },
  { institute_name: "PSG College of Technology" },
  { institute_name: "Punjab Technical University" },
  { institute_name: "S.R.M. Institute of Science and Technology" },
  {
    institute_name: "Sant Longowal Institute of Engineering & Technology",
  },
  {
    institute_name: "Sardar Vallabhbhai National Institute of Technology",
  },
  { institute_name: "Sathyabama Institute of Science and Technology" },
  {
    institute_name: "Shanmugha Arts Science Technology & Research Academy",
  },
  { institute_name: "Sharda University" },
  { institute_name: "Sri Sivasubramaniya Nadar College of Engineering" },
  { institute_name: "Symbiosis International" },
  {
    institute_name:
      "Thapar Institute of Engineering and Technology (Deemed-to-be-university)",
  },
  { institute_name: "University of Petroleum and Energy Studies" },
  { institute_name: "Vellore Institute of Technology" },
  {
    institute_name:
      "Vignan's Foundation for Science, Technology and Research",
  },
  { institute_name: "Visvesvaraya National Institute of Technology" },
  { institute_name: "Visvesvaraya Technological University" },
];

/* -------------------------
   Safe Supabase client
   ------------------------- */
const getSupabase = () => {
  if (typeof window !== "undefined" && window.__SUPABASE_CLIENT__)
    return window.__SUPABASE_CLIENT__;
  const URL = import.meta.env.VITE_SUPABASE_URL;
  const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const client = createClient(URL, ANON);
  if (typeof window !== "undefined") window.__SUPABASE_CLIENT__ = client;
  return client;
};
const supabase = getSupabase();

/* -------------------------
   API base + builder
   ------------------------- */
const API_BASE_RAW =
  (import.meta.env.VITE_API_BASE_URL &&
    String(import.meta.env.VITE_API_BASE_URL)) ||
  "https://path2placement-backend.onrender.com";
const API_BASE = String(API_BASE_RAW).replace(/\/+$/, "");

const buildUrl = (path) => {
  let cleanPath = String(path || "").trim().replace(/^\/+/, "");
  if (
    API_BASE.toLowerCase().endsWith("/api") &&
    cleanPath.toLowerCase().startsWith("api/")
  ) {
    cleanPath = cleanPath.replace(/^api\//i, "");
  }
  return `${API_BASE}/${cleanPath}`;
};

/* -------------------------
   year helpers
   ------------------------- */
const normalizeYear = (yearStr) => {
  if (!yearStr) return 0;
  const s = String(yearStr).trim();
  if (!s) return 0;
  if (s.includes("-")) {
    const parts = s.split("-");
    const n = Number(parts[0]) || Number(parts[1]) || 0;
    return n;
  }
  return Number(s) || 0;
};
const parseAcademicKey = (key) => {
  const label = String(key);
  const num = normalizeYear(label);
  return { label, num };
};

/* -------------------------
   Component
   ------------------------- */
export default function PredictionWithChart() {
  const [college, setCollege] = useState("Manipal Institute of Technology");

  // Autocomplete state
  const [query, setQuery] = useState("Manipal Institute of Technology");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [collegeInfo, setCollegeInfo] = useState(null);
  const [error, setError] = useState("");

  // Filter suggestions on first letters (case insensitive)
  const filteredColleges = COLLEGES.filter((item) =>
    item.institute_name.toLowerCase().startsWith(query.toLowerCase())
  ).slice(0, 8);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setCollege(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (name) => {
    setQuery(name);
    setCollege(name);
    setShowSuggestions(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!college || !college.trim()) return;

    setLoading(true);
    setError("");
    setChartData([]);
    setCollegeInfo(null);

    try {
      // 1) Fetch historical placement rows from Supabase `placement_data`
      const { data: pastData, error: supabaseError } = await supabase
        .from("placement_data")
        .select(
          `
          institute_name,
          academic_year,
          calendar_year,
          placement_rate,
          placed_students,
          graduating_students,
          median_salary,
          nirf_rank,
          college_image,
          city,
          state,
          college_type,
          tier,
          autonomous
        `
        ) // ^^^ make sure these column names exist in your table
        .ilike("institute_name", `%${college}%`);

      if (supabaseError) throw supabaseError;
      if (!pastData || !pastData.length)
        throw new Error("No past data found for this college");

      const first = pastData[0] || {};
      const heroImage = first.college_image || "";
      const city = first.city || "";
      const state = first.state || "";
      const rank = first.nirf_rank ?? "N/A";
      const instituteName = first.institute_name || college;

      // NEW: extra meta fields
      const collegeType = first.college_type || "N/A";
      const tier = first.tier || "N/A";
      const autonomous =
        first.autonomous === true || first.autonomous === "Yes"
          ? "Autonomous"
          : first.autonomous === false || first.autonomous === "No"
          ? "Non-Autonomous"
          : first.autonomous || "N/A";

      setCollegeInfo({
        name: instituteName,
        image: heroImage,
        city,
        state,
        rank,
        collegeType,
        tier,
        autonomous,
      });

      // 2) token
      let token = null;
      try {
        const sessionResp = await supabase.auth.getSession?.();
        token = sessionResp?.data?.session?.access_token ?? null;
      } catch {
        try {
          const older = supabase.auth?.session?.();
          token = older?.access_token ?? null;
        } catch {
          token = null;
        }
      }

      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 20000,
      };
      if (token) axiosConfig.headers.Authorization = `Bearer ${token}`;

      const payload = { collegeName: instituteName, college: instituteName };

      // 3) backend
      const resp = await axios.post(
        buildUrl("api/ml/predict"),
        payload,
        axiosConfig
      );

      const apiData =
        resp && resp.data && typeof resp.data === "object" ? resp.data : {};
      const predictions = apiData.predictions || {};

      // 4) build combined dataset
      const combined = [];

      pastData.forEach((row) => {
        const label = row.academic_year || String(row.calendar_year || "");
        const num = normalizeYear(label);
        combined.push({
          yearLabel: label || String(row.calendar_year || ""),
          year: num,
          placementPast:
            row.placement_rate !== null && row.placement_rate !== undefined
              ? Number(row.placement_rate)
              : null,
          salaryPast:
            row.median_salary !== null && row.median_salary !== undefined
              ? Number(row.median_salary)
              : null,
          placedStudentsPast:
            row.placed_students !== null && row.placed_students !== undefined
              ? Number(row.placed_students)
              : null,
          graduatingStudents:
            row.graduating_students !== null &&
            row.graduating_students !== undefined
              ? Number(row.graduating_students)
              : null,
        });
      });

      Object.entries(predictions).forEach(([acadKey, pred]) => {
        const { label, num } = parseAcademicKey(acadKey);
        const existing = combined.find(
          (d) => d.year === num && d.yearLabel === label
        );
        const predictedPlacement =
          pred?.placement_rate ??
          pred?.placement ??
          pred?.placementPct ??
          null;
        // ⚠️ We ignore predicted salary now (no salaryPredicted field)
        if (existing) {
          existing.placementPredicted =
            predictedPlacement !== undefined && predictedPlacement !== null
              ? Number(predictedPlacement)
              : null;
          existing.placedStudents =
            pred?.placed_students ?? existing.placedStudentsPast ?? null;
        } else {
          combined.push({
            yearLabel: label,
            year: num,
            placementPredicted:
              predictedPlacement !== undefined &&
              predictedPlacement !== null
                ? Number(predictedPlacement)
                : null,
            placedStudents: pred?.placed_students ?? null,
            placementPast: null,
            salaryPast: null,
          });
        }
      });

      const ensureYear = (yLabel, placement = null, placed = null) => {
        const { num, label } = parseAcademicKey(yLabel);
        if (!combined.some((d) => d.year === num && d.yearLabel === label)) {
          combined.push({
            yearLabel: label,
            year: num,
            placementPredicted: placement,
            placedStudents: placed,
            placementPast: null,
            salaryPast: null,
          });
        }
      };
      ensureYear("2024-25");
      ensureYear("2025-26");

      combined.sort(
        (a, b) => a.year - b.year || (a.yearLabel > b.yearLabel ? 1 : -1)
      );
      setChartData(combined);
    } catch (err) {
      console.error("Prediction error (client):", err);
      const status = err?.response?.status;
      if (status === 404) {
        setError("Route not found (404). Please check the API path.");
      } else if (status === 401) {
        setError("Unauthorized (401). Please sign in or check your token.");
      } else if (status === 500) {
        const respData = err?.response?.data;
        setError(
          `Server error (500). ${
            respData?.error ?? respData?.message ?? "Internal server error."
          }`
        );
      } else {
        const respData = err?.response?.data;
        const msg =
          respData?.error ||
          respData?.message ||
          (err?.response ? JSON.stringify(err.response.data) : null) ||
          err.message ||
          "Failed to fetch data";
        setError(msg);
      }

      if (err?.response) {
        console.error("Server response status:", err.response.status);
        console.error("Server response headers:", err.response.headers);
        console.error("Server response data:", err.response.data);
      } else {
        console.error("Network / client error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const readablePercent = (v) =>
    v === null || v === undefined || isNaN(v) ? "-" : `${Number(v).toFixed(2)}%`;
  const readableSalary = (v) =>
    v === null || v === undefined || isNaN(v) ? "-" : `${v} LPA`;
  const readablePlaced = (v) =>
    v === null || v === undefined || isNaN(v) ? "-" : `${v}`;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1.25rem",
        background: "#ffff",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#1f2937" }}>
        Placement Prediction
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {/* Autocomplete wrapper */}
        <div
          style={{
            position: "relative",
            flex: 1,
          }}
        >
          <input
            type="text"
            placeholder="Enter college name"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleInputBlur}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: 10,
              border: "1px solid #e6e9ef",
              boxShadow: "inset 0 1px 2px rgba(16,24,40,0.03)",
              fontSize: "0.95rem",
            }}
          />

          {showSuggestions && query && filteredColleges.length > 0 && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                maxHeight: 220,
                overflowY: "auto",
                background: "#ffffff",
                border: "1px solid #ddd",
                borderRadius: 8,
                marginTop: 4,
                listStyle: "none",
                padding: "4px 0",
                zIndex: 50,
                boxShadow: "0 8px 18px rgba(0, 0, 0, 0.08)",
              }}
            >
              {filteredColleges.map((item) => (
                <li
                  key={item.institute_name}
                  onMouseDown={() =>
                    handleSuggestionClick(item.institute_name)
                  }
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  {item.institute_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem 1.25rem",
            borderRadius: 10,
            background: "#2563eb",
            color: "#fff",
            fontWeight: 600,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Predicting..." : "Get Predictions"}
        </button>
      </form>

      {error && (
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            background: "#ffecee",
            color: "#b91c1c",
            padding: "0.75rem 1rem",
            borderRadius: 8,
            marginBottom: "1rem",
            whiteSpace: "pre-wrap",
          }}
        >
          {error}
        </div>
      )}

      {/* Hero */}
      {collegeInfo && (
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: "1rem",
            color: "#fff",
            display: "flex",
            alignItems: "flex-end",
            padding: "1rem",
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.55)), url(${collegeInfo.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 12px 30px rgba(2,6,23,0.12)",
          }}
        >
          <div style={{ padding: "0.5rem 1rem", borderRadius: 10 }}>
            <h3 style={{ margin: 0 }}>{collegeInfo.name}</h3>
            <p style={{ margin: "0.2rem 0", opacity: 0.95 }}>
              📍 {collegeInfo.city}, {collegeInfo.state}
            </p>
            <p style={{ margin: 0, opacity: 0.95 }}>
              🏆 NIRF Rank: {collegeInfo.rank}
            </p>
          </div>
        </div>
      )}

      {/* Chart + Prediction Cards */}
      {chartData && chartData.length > 0 && (
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "1rem",
            alignItems: "start",
          }}
        >
          {/* Chart Card */}
          <div
            style={{
              borderRadius: 12,
              background: "#fff",
              padding: "1rem",
              boxShadow: "0 8px 20px rgba(2,6,23,0.06)",
            }}
          >
            <h4 style={{ margin: "0 0 8px 0" }}>Placement & Salary Trends</h4>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 40, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="#f0f2f7" strokeDasharray="4 4" />
                  <XAxis dataKey="yearLabel" tick={{ fontSize: 12 }} />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Placement %",
                      angle: -90,
                      position: "insideLeft",
                      dy: -10,
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "Median Salary (LPA)",
                      angle: -90,
                      position: "insideRight",
                      dy: 10,
                    }}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (!value && value !== 0) return "-";
                      if (String(name).includes("Placement"))
                        return `${Number(value).toFixed(2)}%`;
                      if (String(name).includes("Salary"))
                        return `${value} LPA`;
                      return value;
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  {/* Past placement */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="placementPast"
                    name="Placement % (Past)"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                  {/* Past salary */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="salaryPast"
                    name="Median Salary (Past)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                  {/* Predicted placement */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="placementPredicted"
                    name="Placement % (Predicted)"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    strokeDasharray="6 4"
                    connectNulls
                  />
                  {/* ⛔ salaryPredicted removed from graph */}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Prediction + Snapshot */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "0.9rem 1rem",
                boxShadow: "0 8px 20px rgba(2,6,23,0.04)",
              }}
            >
              <h5 style={{ margin: "0 0 6px 0" }}>Predictions</h5>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {chartData
                  .filter(
                    (d) =>
                      d.placementPredicted !== null &&
                      d.placementPredicted !== undefined
                  )
                  .map((d) => (
                    <div
                      key={d.yearLabel}
                      style={{
                        flex: "1 1 100%",
                        borderRadius: 10,
                        padding: "0.6rem",
                        background: "#f8fafc",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{ fontSize: 13, color: "#111827" }}
                        >
                          {d.yearLabel}
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#0f172a",
                          }}
                        >
                          {readablePercent(d.placementPredicted)}
                        </div>
                        <div
                          style={{ fontSize: 12, color: "#475569" }}
                        >{`Placed: ${readablePlaced(
                          d.placedStudents ?? d.placedStudentsPast
                        )}`}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{ fontSize: 12, color: "#64748b" }}
                        >
                          Change
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#065f46",
                          }}
                        >
                          {d.placementPast != null &&
                          d.placementPredicted != null
                            ? `${(
                                d.placementPredicted - d.placementPast
                              ).toFixed(2)}%`
                            : "-"}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick stats card + NEW fields */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "0.9rem 1rem",
                boxShadow: "0 8px 20px rgba(2,6,23,0.04)",
              }}
            >
              <h5 style={{ margin: "0 0 6px 0" }}>College Snapshot</h5>
              <div style={{ color: "#374151", fontSize: 14 }}>
                <div>
                  <strong>{collegeInfo?.name}</strong>
                </div>
                <div style={{ marginTop: 6 }}>
                  <span style={{ color: "#6b7280" }}>City:</span>{" "}
                  {collegeInfo?.city || "-"}
                </div>
                <div>
                  <span style={{ color: "#6b7280" }}>State:</span>{" "}
                  {collegeInfo?.state || "-"}
                </div>
                <div>
                  <span style={{ color: "#6b7280" }}>NIRF Rank:</span>{" "}
                  {collegeInfo?.rank || "-"}
                </div>
                <div style={{ marginTop: 6 }}>
                  <span style={{ color: "#6b7280" }}>College Type:</span>{" "}
                  {collegeInfo?.collegeType || "-"}
                </div>
                <div>
                  <span style={{ color: "#6b7280" }}>Tier:</span>{" "}
                  {collegeInfo?.tier || "-"}
                </div>
                <div>
                  <span style={{ color: "#6b7280" }}>Autonomous:</span>{" "}
                  {collegeInfo?.autonomous || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
