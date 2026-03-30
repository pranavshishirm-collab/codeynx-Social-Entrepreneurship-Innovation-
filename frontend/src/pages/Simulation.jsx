import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, DollarSign, Users, AlertTriangle, ArrowRight, XCircle, RotateCcw, PenTool, CheckCircle2, Loader2 } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const StatCard = ({ icon: Icon, label, value, colorClass, isPercentage = false, currencyScale = 1 }) => {
  const displayValue = isPercentage 
    ? `${Math.round(value)}%` 
    : currencyScale > 1 
      ? value >= 10000000 ? `₹${(value / 10000000).toFixed(2)}Cr` : `₹${value.toLocaleString()}`
      : value;

  return (
    <div className="glass-panel-light p-4 rounded-2xl flex items-center gap-4 transition-all hover:bg-white/10">
      <div className={`p-3 rounded-xl bg-white/5 ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{label}</p>
        <p className="text-xl font-bold font-mono text-white">{displayValue}</p>
      </div>
    </div>
  );
};

const Simulation = () => {
  const { 
    currentScenario, 
    stats, 
    currentStepIndex,
    makeDecision,
    executeCustomAction, 
    gameStatus, 
    failureReason, 
    restartSimulation,
    activeMessage
  } = useSimulation();

  const [customActionText, setCustomActionText] = useState("");
  const [isTypingCustom, setIsTypingCustom] = useState(false);

  // Protected Route Check
  if (!currentScenario || gameStatus === "setup") {
    return <Navigate to="/dashboard" />;
  }

  // Handle Loading State blocking UI when the AI is processing the string
  if (activeMessage && activeMessage.includes("calculating")) {
    return (
      <div className="w-full max-w-lg flex flex-col items-center justify-center p-12 text-center h-screen">
        <Loader2 className="w-16 h-16 text-indigo-400 animate-spin mb-6" />
        <h2 className="text-2xl font-bold mb-2 text-white">Consulting AI Game Master...</h2>
        <p className="text-slate-400">{activeMessage}</p>
      </div>
    );
  }

  // Handle Game Over
  if (gameStatus === "failure" || gameStatus === "success") {
    const isSuccess = gameStatus === "success";
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl text-center"
      >
        <div className={`glass-panel p-12 rounded-3xl border ${isSuccess ? 'border-emerald-500/50 bg-emerald-900/20' : 'border-red-500/50 bg-red-900/20'}`}>
          <div className="flex justify-center mb-6">
            <div className={`p-6 rounded-full inline-block ${isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {isSuccess ? <Heart className="w-16 h-16" /> : <XCircle className="w-16 h-16" />}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            {isSuccess ? "Mission Accomplished!" : "Simulation Failed"}
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            {isSuccess 
              ? "You successfully navigated the complexities of social entrepreneurship and delivered sustainable impact."
              : failureReason}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-slate-800/50 p-4 rounded-xl">
              <p className="text-slate-400 text-sm mb-1">Final Impact</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.impact}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl">
              <p className="text-slate-400 text-sm mb-1">Final Risk</p>
              <p className="text-2xl font-bold text-red-400">{stats.risk}%</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl">
              <p className="text-slate-400 text-sm mb-1">Final Trust</p>
              <p className="text-2xl font-bold text-blue-400">{stats.trust}%</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl">
              <p className="text-slate-400 text-sm mb-1">Remaining Budget</p>
              <p className="text-xl font-bold text-amber-400 truncate">₹{stats.budget.toLocaleString()}</p>
            </div>
          </div>

          <button 
            onClick={restartSimulation}
            className={`px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all hover:scale-105 ${isSuccess ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}`}
          >
            <RotateCcw className="w-5 h-5" /> Return to Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  const currentStep = currentScenario.steps[currentStepIndex];

  const handleCustomSubmit = () => {
    if (customActionText.length < 5) return;
    executeCustomAction(customActionText, currentStep.question);
    setCustomActionText("");
    setIsTypingCustom(false);
  };

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative pb-20">
      
      {/* 🟢 Notifications / Delayed Effects Popup */}
      <AnimatePresence>
        {activeMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 glass-panel border border-indigo-500/50 bg-indigo-900/80 p-6 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] max-w-lg w-full flex items-start gap-4"
          >
            <AlertTriangle className="w-8 h-8 text-yellow-400 shrink-0" />
            <div>
              <h4 className="font-bold text-white mb-1">Consequence Alert</h4>
              <p className="text-indigo-100 text-sm leading-relaxed">{activeMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Sidebar */}
      <div className="lg:col-span-3 space-y-4">
        <div className="glass-panel p-6 rounded-3xl border border-slate-700/50 sticky top-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Live Dashboard</h3>
          <div className="space-y-4">
            <StatCard icon={Activity} label="Impact" value={stats.impact} colorClass="text-emerald-400" />
            <StatCard icon={DollarSign} label="Budget" value={stats.budget} colorClass="text-amber-400" currencyScale={10} />
            <StatCard icon={AlertTriangle} label="Risk" value={stats.risk} isPercentage={true} colorClass={stats.risk > 70 ? 'text-red-500' : 'text-orange-400'} />
            <StatCard icon={Users} label="Trust" value={stats.trust} isPercentage={true} colorClass="text-blue-400" />
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800">
             <div className="flex justify-between items-center mb-2">
               <span className="text-xs text-slate-400 font-bold uppercase">Progress</span>
               <span className="text-xs text-indigo-400 font-bold">{currentStepIndex + 1} / {currentScenario.steps.length}</span>
             </div>
             <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: `${(currentStepIndex / currentScenario.steps.length) * 100}%` }}
                 animate={{ width: `${((currentStepIndex + 1) / currentScenario.steps.length) * 100}%` }}
                 className="h-full bg-indigo-500 rounded-full"
               />
             </div>
          </div>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="lg:col-span-9">
        <motion.div 
          key={currentStep.id} 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-8 md:p-12 rounded-3xl border border-slate-700/50"
        >
          {/* Mission Context */}
          <div className="bg-slate-800/40 rounded-2xl p-6 mb-10 border border-slate-700/50">
             <h2 className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-2">Current Mission</h2>
             <p className="text-lg text-slate-300">{currentScenario.title}</p>
          </div>

          <h3 className="text-3xl font-bold mb-10 leading-snug">{currentStep.question}</h3>

          {!isTypingCustom ? (
            <div className="space-y-4">
              {currentStep.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => makeDecision(opt)}
                  className="w-full text-left p-6 rounded-2xl bg-slate-800/50 hover:bg-indigo-600/20 border border-slate-700 hover:border-indigo-500 transition-all group flex items-start gap-4"
                >
                  <div className="p-2 rounded-lg bg-slate-700 group-hover:bg-indigo-500 transition-colors mt-1 shrink-0">
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-200 group-hover:text-white mb-2">{opt.text}</p>
                    {/* Mini Consequence Preview */}
                    <div className="flex gap-4 text-xs font-mono text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity">
                      {opt.effects.budgetPercentage && <span className={opt.effects.budgetPercentage < 0 ? 'text-red-400' : 'text-emerald-400'}>Budget: {opt.effects.budgetPercentage}%</span>}
                      {opt.effects.impact !== 0 && <span className={opt.effects.impact > 0 ? 'text-emerald-400' : 'text-red-400'}>Impact: {opt.effects.impact > 0 ? '+' : ''}{opt.effects.impact}</span>}
                    </div>
                  </div>
                </button>
              ))}

              <div className="relative py-4 flex items-center">
                <div className="flex-grow border-t border-slate-700"></div>
                <span className="flex-shrink-0 mx-4 text-slate-500 text-sm font-bold uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-slate-700"></div>
              </div>

              <button
                onClick={() => setIsTypingCustom(true)}
                className="w-full text-center py-6 px-6 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 hover:border-teal-500 transition-all group flex justify-center items-center gap-3 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <PenTool className="w-5 h-5 text-teal-400 relative z-10" />
                <span className="font-bold text-teal-300 tracking-wide relative z-10">TAKE CUSTOM ACTION (AI JUDGE)</span>
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/80 rounded-2xl border border-teal-500/50 p-6 shadow-[0_0_30px_rgba(20,184,166,0.15)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-bold text-teal-400 flex items-center gap-2">
                  <PenTool className="w-4 h-4" /> Type your unique strategy
                </h4>
                <button onClick={() => setIsTypingCustom(false)} className="text-slate-500 hover:text-white text-sm uppercase tracking-wider font-bold">Cancel</button>
              </div>

              <textarea 
                autoFocus
                value={customActionText}
                onChange={e => setCustomActionText(e.target.value)}
                placeholder="E.g., I will leverage local radio stations to broadcast our public health data while secretly meeting with the syndicate boss..."
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-white placeholder:text-slate-600 outline-none focus:border-teal-500/50 h-32 resize-none mb-4"
              />

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">The AI will mathematically judge the realism and impact of your action.</span>
                <button 
                  disabled={customActionText.length < 5}
                  onClick={handleCustomSubmit}
                  className="bg-teal-600 disabled:opacity-50 hover:bg-teal-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors"
                >
                  Submit to Game Master <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default Simulation;
