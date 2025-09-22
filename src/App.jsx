import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ResumweAnalyzer from "./pages/ResumeAnalyzer";
import Dashboard from "./pages/Dashboard";
import PlacementAnalysis from "./pages/PlacementAnalysis";
import Prediction from "./pages/Placement/Prediction";
import Insights from "./pages/Placement/Insights";
import Growth from "./pages/Placement/Growth";
import Finder from "./pages/Placement/Finder";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/resume-analyzer" element={<ResumweAnalyzer />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Placement Analysis */}
        <Route path="/placement-analysis" element={<PlacementAnalysis />}>
          {/* Default redirect to prediction */}
          <Route index element={<Navigate to="prediction" replace />} />
          <Route path="prediction" element={<Prediction />} />
          <Route path="insights" element={<Insights />} />
          <Route path="growth" element={<Growth />} />
          <Route path="finder" element={<Finder />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
