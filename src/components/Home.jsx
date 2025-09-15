// src/pages/Home.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import { motion } from "framer-motion";

// ===== 3D EARTH COMPONENT WITH EMBEDDED BASE64 TEXTURES =====
const Earth = () => {
  const [colorMap, normalMap, specularMap] = useTexture([
    'data:data:image/jpeg;base64,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', // 🔹 Replace with your full base64 color map
    'data:data:image/jpeg;base64,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', // 🔹 Replace with your full base64 normal map
  ]);

  return (
    <mesh rotation={[0, 0, 0]}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshPhongMaterial specularMap={specularMap} />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        metalness={0.4}
        roughness={0.7}
      />
    </mesh>
  );
};

// ===== HERO SECTION =====
const Hero = () => (
  <section className="relative h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden">
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} fade />
      <Earth />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>

    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="absolute text-center px-6"
    >
      <h1 className="text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
        Welcome to  Hackathon 2025
      </h1>
      <p className="mt-6 text-lg text-gray-300">
        Collaborate, Innovate, Compete — Shape the Future 🚀
      </p>
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px #0ff" }}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl shadow-lg"
      >
        Get Started
      </motion.button>
    </motion.div>
  </section>
);

// ===== TIMELINE SECTION =====
const Timeline = () => {
  const events = [
    { time: "Day 1", desc: "QUIZ & PDF Submission" },
    { time: "Day 2", desc: "Coding Round" },
    { time: "Day 2", desc: "Final Submission & Judging" },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400 drop-shadow-lg">
        Timeline
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-12 px-6">
        {events.map((event, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px #0ff" }}
            className="p-6 border border-cyan-400 rounded-xl bg-black/70 backdrop-blur-md text-center shadow-lg"
          >
            <h3 className="text-2xl font-semibold text-cyan-400">{event.time}</h3>
            <p className="mt-2 text-gray-300">{event.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ===== LEADERBOARD SECTION =====
const Leaderboard = () => {
  const leaders = [
    { name: "Tech Titans", score: 98 },
    { name: "Team Beta", score: 92 },
    { name: "Team Gamma", score: 89 },
  ];

  return (
    <section className="py-20 bg-black text-white">
      <h2 className="text-4xl font-bold text-center mb-12 text-purple-400 drop-shadow-lg">
        Leaderboard
      </h2>
      <div className="max-w-3xl mx-auto bg-black/60 p-6 rounded-2xl border border-purple-500 shadow-2xl">
        {leaders.map((team, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="flex justify-between p-4 border-b border-gray-700 last:border-none"
          >
            <span className="text-lg font-medium text-cyan-300">{team.name}</span>
            <span className="font-bold text-purple-400">{team.score}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ===== SPONSORS SECTION =====
const Sponsors = () => {
  const sponsors = ["CodeNestia", "SRIMT", "Nexxplora", "SRGI" ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400 drop-shadow-lg">
        Our Sponsors
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {sponsors.map((s, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.1, rotate: 3 }}
            className="p-6 bg-black/60 border border-cyan-400 rounded-xl shadow-xl text-center"
          >
            <span className="text-lg font-semibold">{s}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ===== FOOTER SECTION =====
const Footer = () => (
  <footer className="py-12 bg-black text-gray-400 text-center border-t border-purple-500">
    <h3 className="text-xl font-semibold text-white mb-4">
      🏆 Top 3 Winners — Hackathon 2025
    </h3>
    <p className="text-cyan-300">Download Full Report (PDF)</p>
    <p className="mt-2 text-sm">
      © 2025 Hackathon Platform | Built with ❤️  Ziya Rashid
    </p>
  </footer>
);

// ===== MAIN HOME COMPONENT =====
const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Timeline />
      <Leaderboard />
      <Sponsors />
      <Footer />
    </div>
  );
};

export default Home;
