import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../styles/Insights.css";

// 🔽 College list for autocomplete
const INSIGHT_COLLEGES = [
  { name: "KLE Technological University" },
  { name: "National Engineering College" },
  { name: "Manipal University Jaipur" },
  { name: "Malaviya National Institute of Technology" },
  { name: "Guru Gobind Singh Indraprastha University" },
  { name: "Indian Institute of Technology Kharagpur" },
  { name: "Netaji Subhas University of Technology (NSUT)" },
  { name: "Jawaharlal Nehru Technological University" },
  { name: "National Institute of Technology Delhi" },
  { name: "Jain University, Bangalore" },
  { name: "K L College of Engineering" },
  { name: "R.M.K. Engineering College" },
  { name: "National Institute of Technology Kurukshetra" },
  { name: "Dayananda Sagar College of Engineering" },
  { name: "M. S. Ramaiah Institute of Technology" },
  { name: "Delhi Technological University" },
  { name: "National Institute of Technology Karnataka" },
  { name: "Sona College of Technology" },
  { name: "Birla Institute of Technology & Science -Pilani" },
  { name: "Indian Institute of Technology, Tirupati" },
  { name: "New Horizon College of Engineering" },
  { name: "Jadavpur University" },
  { name: "Jamia Millia Islamia,New Delhi" },
  { name: "National Institute of Technology" },
  { name: "Gandhi Institute of Technology and Management" },
  { name: "The Northcap University" },
  { name: "Sree Vidyanikethan Engineering College" },
  { name: "The National Institute of Engineering" },
  { name: "National Institute of Technology Tiruchirappalli" },
  {
    name: "YMCA University of Science & Tech (Formerely YMCA Institute of Engineering",
  },
  { name: "National Institute of Technology, Calicut" },
  { name: "PES University" },
  { name: "Indraprastha Institute of Information Technology " },
  { name: "B.M.S. College of Engineering" },
  { name: "Indian Institute of Technology Jodhpur" },
  { name: "Indian Institute of Technology Delhi" },
  { name: "P E S College of Engineering" },
  { name: "Siddaganga Institute of Technology" },
  { name: "Vellore Institute of Technology" },
  { name: "C M R Institute of Technology" },
  { name: "Christ University" },
  { name: "NMAM Institute of Technology" },
  { name: "R.V. College of Engineering" },
  { name: "JSS Science and Technology University" },
  { name: "Manipal Institute of Technology" },
  { name: "AU College of Engineering (A)" },
  { name: "Sri Sivasubramaniya Nadar College of Engineering" },
  { name: "S.R.M. Institute of Science and Technology" },
  { name: "Anna University" },
  { name: "Amrita Vishwa Vidyapeetham" },
];

export default function Insights() {
  const [college, setCollege] = useState("");
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!college.trim()) return;
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

  // Filter suggestions based on typed text
  const filteredColleges = INSIGHT_COLLEGES.filter((item) =>
    item.name.toLowerCase().startsWith(query.toLowerCase())
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
    // allow click to register
    setTimeout(() => setShowSuggestions(false), 150);
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
        {/* 🔽 Autocomplete wrapper like previous search bar */}
        <div className="insights-autocomplete">
          <input
            type="text"
            placeholder="Enter college name"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={handleInputBlur}
          />
          {showSuggestions && query && filteredColleges.length > 0 && (
            <ul className="insights-suggestions">
              {filteredColleges.map((item) => (
                <li
                  key={item.name}
                  onMouseDown={() => handleSuggestionClick(item.name)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>

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
              {Object.entries(insights.placementTrends).map(
                ([year, placement]) => (
                  <li key={year}>
                    {year}: {placement}%
                  </li>
                )
              )}
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
