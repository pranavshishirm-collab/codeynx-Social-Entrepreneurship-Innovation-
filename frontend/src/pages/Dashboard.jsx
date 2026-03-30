import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Award, User, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy, getCountFromServer } from 'firebase/firestore';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState(null);
  
  const [userData, setUserData] = useState({
    name: auth.currentUser ? auth.currentUser.displayName || "Entrepreneur" : "Entrepreneur",
    highestRank: "--",
    totalImpact: 0,
    recentRuns: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch personal runs (No orderBy to prevent Firebase Composite Index requirement)
        const runsQuery = query(
          collection(db, "runs"), 
          where("uid", "==", user.uid)
        );
        const runsSnapshot = await getDocs(runsQuery);
        
        let impactSum = 0;
        let personalBestScore = 0;
        const runsData = [];
        
        runsSnapshot.forEach((doc) => {
          const data = doc.data();
          impactSum += (data.impact || 0);
          if (data.score > personalBestScore) {
            personalBestScore = data.score;
          }
          runsData.push({ id: doc.id, ...data });
        });

        // Sort strictly on the frontend to gracefully bypass indexing rules
        runsData.sort((a, b) => {
          const timeA = a.timestamp?.toMillis() || 0;
          const timeB = b.timestamp?.toMillis() || 0;
          return timeB - timeA;
        });

        // 2. Fetch Global Rank based on best score
        let rank = "--";
        if (personalBestScore > 0) {
          const rankQuery = query(collection(db, "runs"), where("score", ">", personalBestScore));
          const rankSnapshot = await getCountFromServer(rankQuery);
          rank = rankSnapshot.data().count + 1;
        }

        setUserData(prev => ({
          ...prev,
          totalImpact: impactSum,
          highestRank: rank,
          recentRuns: runsData.slice(0, 3)
        }));
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="flex justify-between items-center mb-10 w-full">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="bg-slate-800 p-2 rounded-xl text-indigo-400 border border-slate-700">
               <User className="w-6 h-6" />
            </span>
            Welcome back, {userData.name}
          </h1>
          <p className="text-slate-400 mt-1 ml-14">Ready to make an impact today?</p>
        </motion.div>
        
        <motion.button 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/login')}
          className="text-slate-400 hover:text-white transition-colors text-sm font-medium border border-transparent hover:border-slate-800 px-4 py-2 rounded-xl"
        >
          Sign Out
        </motion.button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        {/* Quick Start Card */}
        <motion.div variants={itemVariants} className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 shadow-xl shadow-indigo-500/10">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/4 pointer-events-none" />
          
          <div className="p-8 h-full flex flex-col justify-between relative z-10">
            <div>
              <div className="bg-indigo-500/20 w-fit p-3 rounded-2xl mb-4 border border-indigo-500/30">
                <Play className="w-6 h-6 text-indigo-300 fill-indigo-400/20" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">New Simulation</h2>
              <p className="text-indigo-200/80 mb-8 max-w-md">
                Tackle a new social entrepreneurship challenge. Make decisions, balance stakeholder needs, and learn from the consequences.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/setup')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 w-fit transition-all hover:gap-4"
            >
              Start Mission <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Stats Column */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl bg-slate-800/50 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-colors" />
            <div className="flex items-start justify-between mb-4">
              <p className="text-slate-400 font-medium">Total Impact</p>
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-cyan-500" /> : (
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {userData.totalImpact}
              </h3>
            )}
          </div>

          <div className="glass-panel p-6 rounded-3xl bg-slate-800/50 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors" />
            <div className="flex items-start justify-between mb-4">
              <p className="text-slate-400 font-medium">Global Rank</p>
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-purple-500" /> : (
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                #{userData.highestRank}
              </h3>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activity / Leaderboard Link */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="glass-panel rounded-3xl p-6 bg-slate-800/30 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" /> Recent Runs
              </h3>
            </div>
            <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-slate-500" /></div>
                ) : userData.recentRuns.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">No completed missions yet. Start a simulation!</p>
                ) : userData.recentRuns.map((run) => (
                  <div 
                    key={run.id} 
                    onClick={() => setSelectedRun(run)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-indigo-500/50 group"
                  >
                    <div className="max-w-[80%]">
                      <h4 className="font-semibold text-slate-200 truncate group-hover:text-indigo-400 transition-colors">{run.mission}</h4>
                      <p className="text-sm text-slate-500 mt-1">
                        {run.isSuccess ? <span className="text-emerald-500 font-medium">Success</span> : <span className="text-red-500 font-medium">Failed</span>} 
                        <span className="mx-2">•</span> 
                        <span className="text-slate-400">Score: {run.score.toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="bg-slate-800 p-2 rounded-xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                ))}
            </div>
         </div>

         <div className="glass-panel rounded-3xl p-6 bg-gradient-to-b from-slate-800/50 to-slate-900/80 border border-slate-700/50 flex flex-col justify-center items-center text-center">
            <div className="bg-purple-500/20 p-4 rounded-full mb-4 border border-purple-500/20">
              <Award className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Global Leaderboard</h3>
            <p className="text-slate-400 mb-6 text-sm max-w-[250px]">See how your entrepreneurial skills compare against top players worldwide.</p>
            <button 
              onClick={() => navigate('/leaderboard')}
              className="px-6 py-2.5 rounded-xl border border-slate-600 hover:bg-slate-800 hover:border-purple-500/50 text-white font-medium transition-all group"
            >
              View Rankings <ChevronRight className="w-4 h-4 inline group-hover:translate-x-1" />
            </button>
         </div>
      </motion.div>

      {/* --- Run Summary Modal --- */}
      {selectedRun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedRun(null)}
          ></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`relative w-full max-w-lg glass-panel p-8 rounded-3xl border shadow-2xl ${
              selectedRun.isSuccess ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-red-500/50 bg-red-950/20'
            }`}
          >
            <div className="mb-6 pb-6 border-b border-slate-700/50">
               <div className="flex justify-between items-start mb-4">
                 <h2 className="text-2xl font-bold text-white pr-8">{selectedRun.mission}</h2>
                 <button 
                   onClick={() => setSelectedRun(null)}
                   className="text-slate-400 hover:text-white p-2 bg-slate-800 rounded-lg shrink-0"
                 >
                   ✕
                 </button>
               </div>
               
               <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold tracking-wider uppercase ${
                 selectedRun.isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
               }`}>
                 {selectedRun.isSuccess ? 'Mission Accomplished' : 'Simulation Failed'}
               </div>
            </div>

            {!selectedRun.isSuccess && selectedRun.failureReason && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-6">
                 <p className="text-sm text-red-300">
                   <strong>Reason for Failure:</strong> {selectedRun.failureReason}
                 </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-slate-800/60 p-4 rounded-2xl">
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Final Score</p>
                 <p className="text-2xl font-bold text-white">{selectedRun.score.toLocaleString()}</p>
               </div>
               <div className="bg-slate-800/60 p-4 rounded-2xl">
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Impact</p>
                 <p className="text-2xl font-bold text-emerald-400">{selectedRun.impact}</p>
               </div>
               <div className="bg-slate-800/60 p-4 rounded-2xl">
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Final Risk</p>
                 <p className="text-2xl font-bold text-amber-400">{selectedRun.risk}%</p>
               </div>
               <div className="bg-slate-800/60 p-4 rounded-2xl">
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Trust Kept</p>
                 <p className="text-2xl font-bold text-cyan-400">{selectedRun.trust}%</p>
               </div>
            </div>

            <button 
              onClick={() => setSelectedRun(null)}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
            >
              Close Record
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
