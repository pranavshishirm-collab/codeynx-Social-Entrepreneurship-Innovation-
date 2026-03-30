import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, Medal, Target, TrendingDown, BookOpen, AlertOctagon, CheckCircle } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

// Emotion Mapping Logic
const generateFeedback = (stats, decisions, status, failureReason) => {
  let mistakes = [];
  let successes = [];
  let summary = "";

  if (status === 'failure') {
    summary = "Your initiative collapsed before it could reach its potential.";
    mistakes.push(failureReason);
  } else {
    summary = "You successfully navigated the complexities of social entrepreneurship!";
    successes.push("Completed the initiative timeline.");
  }

  // Analyzing stats for insights
  if (stats.budget < 5000) mistakes.push("You ended up severely underfunded, risking operations.");
  else if (stats.budget > 25000) successes.push("Excellent financial management left you with a surplus.");

  if (stats.trust < 40) mistakes.push("Many stakeholders felt ignored or alienated by your choices.");
  else if (stats.trust > 80) successes.push("You built exceptional trust within the community.");

  if (stats.risk > 70) mistakes.push("You took potentially dangerous gambles that threatened the stability of the project.");
  else if (stats.risk < 30) successes.push("You managed risks carefully, ensuring steady progress.");

  if (stats.impact < 50) mistakes.push("Your overall footprint and impact on the issue was relatively small.");
  else if (stats.impact > 80) successes.push("Your initiative made a massive, life-changing impact.");

  return { summary, mistakes, successes };
};

const Result = () => {
  const navigate = useNavigate();
  const { stats, gameStatus, failureReason, decisions, restart } = useSimulation();
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (gameStatus === 'setup') {
      navigate('/setup');
    } else {
      setFeedback(generateFeedback(stats, decisions, gameStatus, failureReason));
    }
  }, [gameStatus, stats, decisions, failureReason, navigate]);

  const handleReplay = () => {
    restart();
    navigate('/setup');
  };

  const handleDashboard = () => {
    restart();
    navigate('/dashboard');
  };

  if (!feedback) return null;

  const isSuccess = gameStatus === 'success';
  const score = Math.floor(stats.impact + stats.trust - stats.risk + (stats.budget / 100));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-4xl"
    >
      <div className="text-center mb-10">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-6 shadow-2xl relative ${isSuccess ? 'bg-emerald-500/20 text-emerald-400 shadow-emerald-500/30' : 'bg-red-500/20 text-red-500 shadow-red-500/30'}`}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-white/20 blur-sm pointer-events-none" />
          {isSuccess ? <CheckCircle className="w-14 h-14" /> : <AlertOctagon className="w-14 h-14" />}
        </motion.div>
        
        <h1 className="text-5xl font-bold mb-4 font-heading tracking-tight">
          {isSuccess ? "Simulation Complete" : "Simulation Failed"}
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          {feedback.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-3xl bg-slate-900/60 flex flex-col items-center justify-center text-center">
           <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-2">Final Score</h3>
           <motion.div 
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500 mb-2"
           >
             {score}
           </motion.div>
           <div className="flex items-center gap-1 text-xs text-amber-500/80 mt-1">
             <Medal className="w-4 h-4" /> Top 15% Today
           </div>
        </div>

        <div className="md:col-span-2 glass-panel p-6 rounded-3xl bg-slate-800/40">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-full items-center">
             <div className="text-center p-3">
               <div className="text-rose-400 font-bold text-2xl mb-1">{stats.impact}</div>
               <div className="text-xs text-slate-500 uppercase tracking-wide">Impact</div>
             </div>
             <div className="text-center p-3 border-l border-slate-700/50">
               <div className="text-emerald-400 font-bold text-2xl mb-1">{(stats.budget/1000).toFixed(1)}k</div>
               <div className="text-xs text-slate-500 uppercase tracking-wide">Budget</div>
             </div>
             <div className="text-center p-3 border-l border-slate-700/50">
               <div className="text-amber-400 font-bold text-2xl mb-1">{stats.risk}%</div>
               <div className="text-xs text-slate-500 uppercase tracking-wide">Risk</div>
             </div>
             <div className="text-center p-3 border-l border-slate-700/50">
               <div className="text-cyan-400 font-bold text-2xl mb-1">{stats.trust}%</div>
               <div className="text-xs text-slate-500 uppercase tracking-wide">Trust</div>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Insights - Mistakes */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}
          className="glass-panel p-8 rounded-3xl bg-red-900/10 border-red-500/20"
        >
          <h3 className="flex items-center gap-2 text-xl font-bold text-red-400 mb-6 border-b border-red-500/20 pb-4">
            <TrendingDown className="w-6 h-6" /> Areas for Improvement
          </h3>
          <ul className="space-y-4">
            {feedback.mistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                <span className="text-slate-300">{m}</span>
              </li>
            ))}
            {feedback.mistakes.length === 0 && (
              <p className="text-slate-400 italic">No major critical errors detected. Excellent execution.</p>
            )}
          </ul>
        </motion.div>

        {/* Insights - Successes */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}
          className="glass-panel p-8 rounded-3xl bg-emerald-900/10 border-emerald-500/20"
        >
          <h3 className="flex items-center gap-2 text-xl font-bold text-emerald-400 mb-6 border-b border-emerald-500/20 pb-4">
            <Target className="w-6 h-6" /> What You Did Right
          </h3>
          <ul className="space-y-4">
            {feedback.successes.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                <span className="text-slate-300">{s}</span>
              </li>
            ))}
            {feedback.successes.length === 0 && (
              <p className="text-slate-400 italic">Consider taking more calculated positive actions next time.</p>
            )}
          </ul>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-8 border-t border-slate-800">
        <button 
          onClick={handleReplay}
          className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:-translate-y-1"
        >
          <RefreshCw className="w-5 h-5" /> Replay Simulation
        </button>
        <button 
          onClick={handleDashboard}
          className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all border border-slate-700 hover:border-slate-500"
        >
          <BookOpen className="w-5 h-5" /> Back to Dashboard
        </button>
      </div>
    </motion.div>
  );
};

export default Result;
