import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Banknote, ShieldAlert, Heart, ArrowRight, ArrowLeft, Building2, Globe2, Network, Droplet, Briefcase, Megaphone, Sparkles, Loader2 } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const SimulationSetup = () => {
  const navigate = useNavigate();
  const { startSimulation, gameStatus } = useSimulation();

  const [step, setStep] = useState(1); 
  const [missionText, setMissionText] = useState('');
  const [selectedStakeholders, setSelectedStakeholders] = useState([]);
  
  // High-range slider up to 10 Crores (100,000,000)
  const [budget, setBudget] = useState(50000);
  const minBudget = 10000;
  const maxBudget = 100000000;

  const availableStakeholders = [
    { id: 'NGO Partners', name: 'NGO Partners', icon: Heart, desc: 'Resourceful allies, but ideologically driven.' },
    { id: 'Government', name: 'Government', icon: Building2, desc: 'Controls regulations, grants, and scaling.' },
    { id: 'Private Sector', name: 'Private Sector', icon: Briefcase, desc: 'Massive funding, but demands fast ROI.' },
    { id: 'Local Community', name: 'Local Community', icon: Users, desc: 'Direct beneficiaries. Your true compass.' },
    { id: 'Media', name: 'Media', icon: Megaphone, desc: 'Controls public optics and mass trust.' },
  ];

  const handleStakeholderToggle = (id) => {
    if (selectedStakeholders.includes(id)) {
      setSelectedStakeholders(selectedStakeholders.filter(s => s !== id));
    } else {
      if (selectedStakeholders.length < 3) {
        setSelectedStakeholders([...selectedStakeholders, id]);
      }
    }
  };

  const handleStart = async () => {
    if (selectedStakeholders.length < 2) {
      alert("Please select at least 2 stakeholders.");
      return;
    }
    await startSimulation(missionText, selectedStakeholders, budget);
    navigate('/simulation');
  };

  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString()}`;
  };

  // Generating phase
  if (gameStatus === 'generating') {
    return (
      <div className="w-full max-w-lg flex flex-col items-center justify-center p-12 text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-50" />
            <Loader2 className="w-20 h-20 text-indigo-400 relative z-10" />
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold mb-4 text-white">Synthesizing Mission...</h2>
        <p className="text-slate-400 text-lg">CodeNynx AI is dynamically generating a specialized 5-step interactive entrepreneurship scenario matching your exact prompt.</p>
        <p className="text-indigo-400 text-sm mt-8 opacity-80 uppercase tracking-widest">(Building consequence matrices)</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl relative">
      <div className="flex items-center justify-center mb-12 relative max-w-lg mx-auto">
         <div className="absolute h-1 bg-slate-800 w-full top-1/2 -translate-y-1/2 -z-10 rounded-full" />
         <div className="absolute h-1 bg-indigo-500 top-1/2 -translate-y-1/2 -z-10 rounded-full transition-all duration-500 left-0" 
              style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />
         
         <div className="flex justify-between w-full">
           <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 ${step >= 1 ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>1</div>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 ${step >= 2 ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>2</div>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 ${step >= 3 ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>3</div>
         </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={`step-${step}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-panel p-8 md:p-12 rounded-3xl bg-slate-900/60 border border-slate-700/50 shadow-2xl"
        >
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Define Your Mission</h2>
                <p className="text-slate-400">Describe the exact social issue or startup you want to test in the simulator.</p>
              </div>

              <div className="max-w-3xl mx-auto shadow-inner bg-slate-900/50 rounded-2xl border border-indigo-500/30 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 pointer-events-none" />
                <textarea 
                  value={missionText}
                  onChange={(e) => setMissionText(e.target.value)}
                  placeholder="e.g. Expand high-speed internet to 5 extreme rural villages in northern India..."
                  className="w-full bg-transparent text-white placeholder:text-slate-500 p-6 h-48 outline-none resize-none z-10 relative"
                  maxLength={300}
                />
                <div className="absolute bottom-4 right-4 text-xs font-mono text-slate-500">
                  {missionText.length}/300
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <div className="glass-panel-light p-4 rounded-xl max-w-xl text-center flex items-center gap-3">
                   <Sparkles className="w-8 h-8 text-yellow-400 shrink-0" />
                   <p className="text-sm text-slate-300">CodeNynx AI will mathematically structure your mission into deeply responsive gameplay scenarios, options, and branching feedback loops.</p>
                </div>
              </div>
              
              <div className="flex justify-end mt-8 pt-6 border-t border-slate-800">
                <button 
                  disabled={missionText.length < 10}
                  onClick={() => setStep(2)}
                  className="bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
                >
                  Configure Stakeholders <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Build Your Coalition</h2>
                <p className="text-slate-400">Select exactly 2 or 3 core stakeholders to involve in your project.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableStakeholders.map(s => {
                  const Icon = s.icon;
                  const isSelected = selectedStakeholders.includes(s.id);
                  return (
                    <div 
                      key={s.id}
                      onClick={() => handleStakeholderToggle(s.id)}
                      className={`cursor-pointer p-6 rounded-2xl transition-all border ${isSelected ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'}`}
                    >
                      <div className={`p-3 rounded-xl mb-4 w-fit ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>{s.name}</h3>
                      <p className="text-sm opacity-80 leading-relaxed">{s.desc}</p>
                    </div>
                  )
                })}
              </div>
              
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-800">
                <button 
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" /> Redefine Mission
                </button>
                <div className="flex items-center gap-4">
                  <p className="text-slate-400 text-sm hidden md:block">{selectedStakeholders.length}/3 Selected (Min 2)</p>
                  <button 
                    disabled={selectedStakeholders.length < 2}
                    onClick={() => setStep(3)}
                    className="bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
                  >
                    Set Valuation <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
               <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Fund Allocation</h2>
                <p className="text-slate-400">Set your starting capital. A massive budget protects you, but increases scaling expectations.</p>
              </div>

              <div className="max-w-2xl mx-auto glass-panel p-10 rounded-3xl bg-slate-800/30">
                  <div className="flex justify-center mb-10">
                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 tracking-tight">
                       {formatCurrency(budget)}
                    </div>
                  </div>

                  <div className="relative pt-4 pb-8">
                    <input 
                      type="range" 
                      min={minBudget} 
                      max={maxBudget} 
                      step={10000}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-4 font-mono uppercase tracking-wider">
                      <span>₹10,000 (Hard Mode)</span>
                      <span>₹10 Crores (Sandbox)</span>
                    </div>
                  </div>
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-800 max-w-2xl mx-auto">
                <button 
                  onClick={() => setStep(2)}
                  className="text-slate-400 hover:text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <button 
                  onClick={handleStart}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  Generate Dynamic Simulation
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SimulationSetup;
