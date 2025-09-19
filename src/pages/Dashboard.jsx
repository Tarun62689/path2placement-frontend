import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Legend,
} from "recharts";
import "./styles/Dashboard.css";

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#3B82F6"];

// Utils
const safeNumber = (v) => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));
const safePercent = (num, denom) =>
  denom > 0 ? ((num / denom) * 100).toFixed(2) : 0;

const Dashboard = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCollege, setSelectedCollege] = useState("All");
  const [visibleCharts, setVisibleCharts] = useState({
    college: true,
    department: true,
    salaryTrend: true,
    percentTrend: true,
    scatter: true,
    radial: true,
  });
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const { data, error } = await supabase
        .from("College_Placements_Data")
        .select("*");
      if (error) throw error;
      setPlacements(data);
    } catch (err) {
      console.error("Error fetching:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-loader">Loading dashboard...</div>;
  if (!placements.length) return <div className="dashboard-loader">No data available</div>;

  // Filtering
  let filtered = placements;
  if (selectedYear !== "All")
    filtered = filtered.filter((c) => c["Year"] === selectedYear);
  if (selectedCollege !== "All")
    filtered = filtered.filter((c) => c["College Name"] === selectedCollege);

  // KPIs
  const totalStudents = filtered.reduce(
    (s, c) => s + safeNumber(c["Total Students Eligible"]),
    0
  );
  const placedStudents = filtered.reduce(
    (s, c) => s + safeNumber(c["Total Students Placed"]),
    0
  );
  const avgPlacementPercent = safePercent(placedStudents, totalStudents);
  const avgMedianSalary = (
    filtered.reduce((s, c) => s + safeNumber(c["Median Salary (LPA)"]), 0) /
    (filtered.length || 1)
  ).toFixed(2);

  // Chart Data
  const collegeChartData = filtered.map((c) => ({
    name: c["College Name"] || "Unknown",
    placed: safeNumber(c["Total Students Placed"]),
    eligible: safeNumber(c["Total Students Eligible"]),
  }));

  const deptTotals = {
    CSE: filtered.reduce((s, c) => s + safeNumber(c["CSE(Placed)"]), 0),
    ECE: filtered.reduce((s, c) => s + safeNumber(c["ECE(Placed)"]), 0),
    ME: filtered.reduce((s, c) => s + safeNumber(c["ME(Placed)"]), 0),
    EEE: filtered.reduce((s, c) => s + safeNumber(c["EEE(Placed)"]), 0),
  };
  const deptChartData = Object.keys(deptTotals).map((d) => ({
    name: d,
    value: deptTotals[d],
  }));

  const yearTrendData = filtered.map((c) => ({
    year: c["Year"] || "Unknown",
    avg: safeNumber(c["Median Salary (LPA)"]),
    max: safeNumber(c["Highest Package (LPA)"]),
    percent: safeNumber(c["Placement Percentage"]),
  }));

  const scatterData = filtered.map((c) => ({
    college: c["College Name"] || "Unknown",
    salary: safeNumber(c["Median Salary (LPA)"]),
    percent: safeNumber(c["Placement Percentage"]),
  }));

  const uniqueYears = ["All", ...new Set(placements.map((c) => c["Year"]))];
  const uniqueColleges = [
    "All",
    ...new Set(placements.map((c) => c["College Name"])),
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar Toggle */}
      <button
        className="dashboard-mobile-toggle"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="dashboard-sidebar-header">
          <h2>Filters</h2>
          <button
            className="dashboard-sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="dashboard-filter-group">
          <label>Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {uniqueYears.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="dashboard-filter-group">
          <label>College</label>
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
          >
            {uniqueColleges.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <h2>Charts</h2>
        <div className="dashboard-chart-toggle">
          {Object.keys(visibleCharts).map((chart) => (
            <button
              key={chart}
              className={visibleCharts[chart] ? "active" : ""}
              onClick={() =>
                setVisibleCharts({
                  ...visibleCharts,
                  [chart]: !visibleCharts[chart],
                })
              }
            >
              {visibleCharts[chart] ? `Hide ${chart}` : `Show ${chart}`}
            </button>
          ))}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="dashboard-overlay active"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Panel */}
      <main className="dashboard-main-panel">
        {/* KPI Cards */}
        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card purple">
            <h3>Total Eligible</h3>
            <p>{totalStudents}</p>
          </div>
          <div className="dashboard-stat-card green">
            <h3>Total Placed</h3>
            <p>{placedStudents}</p>
          </div>
          <div className="dashboard-stat-card blue">
            <h3>Placement %</h3>
            <p>{avgPlacementPercent}%</p>
          </div>
          <div className="dashboard-stat-card orange">
            <h3>Avg Median Salary</h3>
            <p>₹{avgMedianSalary} LPA</p>
          </div>
        </div>

        {/* Charts */}
        <div className="dashboard-charts-grid">
          {visibleCharts.college && (
            <div className="dashboard-chart-box">
              <h4>Placements by College</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={collegeChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="eligible" fill="#22C55E" />
                  <Bar dataKey="placed" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {visibleCharts.department && (
            <div className="dashboard-chart-box">
              <h4>Placements by Department</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={deptChartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {deptChartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {visibleCharts.salaryTrend && (
            <div className="dashboard-chart-box dashboard-chart-wide">
              <h4>Salary Trends</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={yearTrendData}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <CartesianGrid stroke="#eee" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="avg"
                    stroke="#22C55E"
                    name="Median Salary"
                  />
                  <Line
                    type="monotone"
                    dataKey="max"
                    stroke="#EF4444"
                    name="Highest Package"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {visibleCharts.percentTrend && (
            <div className="dashboard-chart-box">
              <h4>Placement % Over Years</h4>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={yearTrendData}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="percent"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {visibleCharts.scatter && (
            <div className="dashboard-chart-box">
              <h4>Salary vs Placement %</h4>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="salary" name="Median Salary" />
                  <YAxis type="number" dataKey="percent" name="Placement %" />
                  <ZAxis range={[60, 200]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter
                    name="Colleges"
                    data={scatterData}
                    fill="#F59E0B"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}

          {visibleCharts.radial && (
            <div className="dashboard-chart-box">
              <h4>Department Contribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="90%"
                  barSize={15}
                  data={deptChartData}
                >
                  <PolarAngleAxis dataKey="name" type="category" />
                  <RadialBar background clockWise dataKey="value">
                    {deptChartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </RadialBar>
                  <Legend />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
