import React, { useEffect, useRef } from "react";
import "./styles/Features.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  { title: "College Finder", description: "Match students with the best-fit colleges based on preferences and placement trends.", icon: "🏫" },
  { title: "Placement Prediction", description: "Predict placement chances based on past college data and student profiles.", icon: "📈" },
  { title: "Resume Analyzer", description: "Upload your resume to get AI-powered insights on strengths, weaknesses, and improvements.", icon: "📄" },
  { title: "Skill Gap Analysis", description: "Identify missing skills compared to job requirements and bridge the gap.", icon: "🛠️" },
  { title: "Skill Recommendations", description: "Get personalized skill-building suggestions with curated learning resources.", icon: "🎯" },
  { title: "Internship & Job Recommendations", description: "Find internships and job roles tailored to your skills and career goals.", icon: "🚀" },
  { title: "College Growth Insights", description: "Analyze college placement growth rate and compare with peers.", icon: "📊" },
  { title: "Placement Insights Dashboard", description: "Interactive dashboard with trends, analytics, and placement statistics.", icon: "📉" },
];

const Features = () => {
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none", // ✅ Only play once (no reverse)
          },
        }
      );
    });
  }, []);

  return (
    <section className="features">
      <h2 className="section-title">Platform Features</h2>
      <p className="section-subtitle">
        Everything you need to analyze, prepare, and succeed in placements.
      </p>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div
            className="feature-card"
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
