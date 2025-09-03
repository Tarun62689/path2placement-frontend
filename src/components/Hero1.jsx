import React from "react";
import { motion } from "framer-motion";
import "./styles/Hero1.css"; 
import heroImg from "../assets/placement-hero.svg"; 

const Hero1 = () => {
  return (
    <section className="hero">
      {/* Left Content */}
      <motion.div
        className="hero-content"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ delay: 0.2 }}
        >
          Path2Placement <br /> Your AI Career Guide
        </motion.h1>

        <motion.p
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ delay: 0.4 }}
        >
          Unlock smarter career guidance with AI-powered placement insights, 
          skill gap analysis, and personalized job recommendations. 
          Your path to success starts here.
        </motion.p>

        <motion.div
          className="hero-buttons"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ delay: 0.6 }}
        >
          <button className="btn primary">Get Started</button>
          <button className="btn secondary">Learn More</button>
        </motion.div>
      </motion.div>

      {/* Right Image with floating animation */}
      <motion.div
        className="hero-image"
        initial={{ opacity: 0, x: 100 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -10, 0], // subtle floating
        }}
        transition={{
          duration: 1,
          delay: 0.8,
          y: { repeat: Infinity, repeatType: "loop", duration: 4 },
        }}
        whileHover={{ scale: 1.05, rotate: 1 }}
      >
        <img src={heroImg} alt="AI Career Guidance" />
      </motion.div>
    </section>
  );
};

export default Hero1;
