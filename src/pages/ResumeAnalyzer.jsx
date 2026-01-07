import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiFileText } from "react-icons/fi";
import loaderImg from "../assets/Loader.webp";
import "./styles/ResumeAnalyzer.css";

const ModernResumeAnalyzer = () => {
  const { profile, token } = useAuth();
  const [resumeFile, setResumeFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const fileInputRef = useRef(null);

  // Track window resize safely
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch resumes and history
  useEffect(() => {
    const fetchData = async () => {
      if (!token || !profile?.user?.id) return;
      try {
        setLoading(true);
        const res = await axios.get(
          `https://path2placement-backend.onrender.com/api/resume/${profile.user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const resumeList = Array.isArray(res.data) ? res.data : [];
        setResumes(resumeList);
        if (resumeList.length > 0) setSelectedResume(resumeList[0].filePath);

        const historyRes = await axios.get(
          "https://path2placement-backend.onrender.com/api/resume-analysis/fetch-analysis",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const normalized = (historyRes.data?.analyses || []).map((row) => {
          let parsedResult = {};
          try {
            if (typeof row.result === "string") parsedResult = JSON.parse(row.result);
            else if (typeof row.result === "object" && row.result !== null)
              parsedResult = row.result;
          } catch {
            parsedResult = {};
          }
          return {
            ...row,
            parsedResult,
            score: parsedResult?.score ? Number(parsedResult.score) : 0,
            job_role: row.job_role || parsedResult?.job_role || "Unknown Role",
            resume_path: row.resume_path || "Unknown Resume",
            created_at: row.created_at || new Date().toISOString(),
          };
        });
        setHistory(normalized);
      } catch (err) {
        console.warn("Failed to fetch resumes/history:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profile, token]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);

    // Auto upload after selecting file
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("user_id", profile.user.id);

      const res = await axios.post(
        "https://path2placement-backend.onrender.com/api/resume/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
      );

      const uploadedResume = res.data || {};
      setResumes((prev) => [...prev, uploadedResume]);
      setSelectedResume(uploadedResume.filePath);
      setResumeFile(null);
      alert("Resume uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedResume || !jobRole) return alert("Select resume & enter job role first.");
    try {
      setLoading(true);
      const res = await axios.post(
        "https://path2placement-backend.onrender.com/api/resume-analyzer/resume-analyzer",
        { resume_path: selectedResume, job_role: jobRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newAnalysis = { ...res.data.analysis, publicUrl: res.data.publicUrl };
      setAnalysis(newAnalysis);

      const row = res.data.record;
      let parsedResult = {};
      try {
        if (typeof row.result === "string") parsedResult = JSON.parse(row.result);
        else if (typeof row.result === "object" && row.result !== null) parsedResult = row.result;
      } catch {
        parsedResult = {};
      }
      const newRecord = {
        ...row,
        parsedResult,
        score: parsedResult?.score ? Number(parsedResult.score) : 0,
        job_role: row.job_role || parsedResult?.job_role || "Unknown Role",
        resume_path: row.resume_path || "Unknown Resume",
        created_at: row.created_at || new Date().toISOString(),
      };
      setHistory((prev) => [newRecord, ...prev]);
    } catch (err) {
      console.error("Analysis error:", err.response?.data || err.message);
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (h) => {
    setAnalysis(h.parsedResult);
    setSelectedResume(h.resume_path);
    setJobRole(h.job_role);
  };

  const scoreData = analysis
    ? [{ name: "Match Score", value: analysis.score, fill: "#4f46e5" }]
    : [{ name: "Match Score", value: 0, fill: "#ddd" }];

  const combinedSkillData = analysis
    ? [
      ...(analysis.skills_found || []).map((skill) => ({
        skill,
        matched: 1,
        gap: 0,
      })),
      ...(analysis.skill_gaps || []).map((skill) => ({
        skill,
        matched: 0,
        gap: 1,
      })),
    ]
    : [];


  const trendData = history
    .slice(0, 10)
    .map((h) => ({ date: new Date(h.created_at).toLocaleDateString(), score: h.score }))
    .reverse();

  const avgScore =
    history.length > 0 ? (history.reduce((sum, h) => sum + h.score, 0) / history.length).toFixed(1) : 0;

  if (!token || !profile?.user?.id) {
    return (
      <div className="login-required-message">
        <h2>Please Login to Continue</h2>
        <p>You need to login to access the Resume Analyzer.</p>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      {loading && (
        <div className="loader-overlay">
          <img src={loaderImg} alt="Loading..." className="loader-image" />
        </div>
      )}

      {/* Mobile Sidebar Toggle */}
      <button className="mobile-sidebar-toggle" onClick={() => setSidebarOpen(true)}>
        ☰
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || windowWidth > 768) && (
          <motion.aside
            className="sidebar"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="sidebar-header">
              <h2>Resume Analyzer</h2>
              {windowWidth <= 768 && (
                <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
                  ✕
                </button>
              )}
            </div>
            <ul className="sidebar-list">
              {resumes.map((r, idx) => (
                <motion.li
                  key={idx}
                  className={selectedResume === r.filePath ? "selected" : ""}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedResume(r.filePath)}
                >
                  <FiFileText className="icon" /> {r.originalName}
                </motion.li>
              ))}
            </ul>
            <motion.button
              className="btn-upload-sidebar"
              whileHover={{ scale: 1.05 }}
              onClick={() => fileInputRef.current.click()}
            >
              <FiUpload /> Upload Resume
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Panel */}
      <main className="main-panel">
        <div className="kpi-cards">
          <motion.div className="kpi-card" whileHover={{ scale: 1.03 }}>
            Avg Score: {avgScore}%
          </motion.div>
          <motion.div className="kpi-card" whileHover={{ scale: 1.03 }}>
            Total Resumes: {resumes.length}
          </motion.div>
          <motion.div className="kpi-card" whileHover={{ scale: 1.03 }}>
            Skill Gaps: {analysis?.skill_gaps?.length || 0}
          </motion.div>
        </div>

        {analysis && (
          <motion.div
            className="dashboard-card analysis-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>
              {selectedResume?.split("/").pop()} - {jobRole}
            </h3>
            <div className="analysis-section">
              <div className="radial-chart">
                <ResponsiveContainer width="100%" height={200}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={24} data={scoreData}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={12} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="radial-score">{analysis.score}%</div>
              </div>

              <div className="skills-text-section">
                <div className="skills-block">
                  <h4> Skills Matched</h4>
                  {analysis.skills_found?.length > 0 ? (
                    <div className="skills-list matched">
                      {analysis.skills_found.map((skill, i) => (
                        <span key={i} className="skill-chip matched">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="muted">No matched skills found</p>
                  )}
                </div>

                <div className="skills-block">
                  <h4>Skills Missing</h4>
                  {analysis.skill_gaps?.length > 0 ? (
                    <div className="skills-list missing">
                      {analysis.skill_gaps.map((skill, i) => (
                        <span key={i} className="skill-chip missing">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="muted">No skill gaps detected</p>
                  )}
                </div>
              </div>



              <div className="trend-chart">
                <h4>Score Trend</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#524f7cff" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div className="dashboard-card analyze-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <input type="text" placeholder="Job Role" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
          <button className="btn-analyze" onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </motion.div>

        <motion.div className="dashboard-card history-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3>Past Analyses</h3>
          <br />
          <table className="history-table">
            <thead>
              <tr>
                <th>Resume</th>
                <th>Job Role</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((h, i) => (
                  <tr key={h.id || i} style={{ cursor: "pointer" }} onClick={() => handleSelectHistory(h)}>
                    <td>{h.resume_path?.split("/").pop()}</td>
                    <td>{h.job_role}</td>
                    <td>{h.score.toFixed(1)}%</td>
                    <td>
                      {new Date(h.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="muted">
                    No past analyses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </main>
    </div>
  );
};

export default ModernResumeAnalyzer;
