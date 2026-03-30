import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ChevronLeft, Hexagon, Loader2, Mail } from 'lucide-react';
import { db, auth } from '../firebase/config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch a larger batch so we can safely filter out duplicates
        const q = query(collection(db, "runs"), orderBy("score", "desc"), limit(100));
        const snapshot = await getDocs(q);
        
        const fetchedLeads = [];
        const seenPlayers = new Set();
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Because the query is already ordered cleanly by highest score, 
          // the FIRST time we see their UID is guaranteed to be their absolute best run!
          if (data.uid && !seenPlayers.has(data.uid)) {
            seenPlayers.add(data.uid);
            fetchedLeads.push({ id: doc.id, ...data });
          } else if (!data.uid && !seenPlayers.has(data.playerName)) {
            // Fallback for older mock runs without UIDs
            seenPlayers.add(data.playerName);
             fetchedLeads.push({ id: doc.id, ...data });
          }
        });
        
        // Strictly render only the Top 15 absolute best unique global players
        setLeads(fetchedLeads.slice(0, 15));
      } catch (err) {
        console.error("Error fetching leaderboard: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="w-full max-w-4xl">
      <div className="flex items-center gap-4 mb-10 w-full">
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-slate-800 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            Global Rankings <Trophy className="w-6 h-6 text-yellow-400" />
          </h1>
          <p className="text-slate-400 mt-1">Top social entrepreneurs in the CodeNynx simulation.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-3xl bg-slate-900/60 shadow-xl overflow-hidden"
      >
        <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest px-6 pb-4 border-b border-slate-800 mb-4 items-center">
          <div className="col-span-1">Rank</div>
          <div className="col-span-4">Player</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-4 text-center hidden md:block">Stats (I / R / T)</div>
          <div className="col-span-1 text-center">Connect</div>
        </div>

        <div className="space-y-3">
          {leads.map((lead, index) => {
            const isTop3 = index < 3;
            // lead.uid might exist to compare to currentUser.uid
            const isYou = currentUser && lead.uid === currentUser.uid;
            
            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                key={lead.id} 
                className={`grid grid-cols-12 gap-4 items-center p-4 rounded-2xl border ${isYou ? 'bg-indigo-600/20 border-indigo-500/50 relative overflow-hidden' : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 transition-colors'}`}
              >
                {isYou && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none" />
                )}
                
                <div className="col-span-1 font-bold text-lg flex justify-center">
                  {index === 0 ? <span className="text-yellow-400 font-black text-2xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">1</span> :
                   index === 1 ? <span className="text-slate-300 font-bold text-xl drop-shadow-[0_0_10px_rgba(203,213,225,0.3)]">2</span> :
                   index === 2 ? <span className="text-amber-700 font-bold text-xl drop-shadow-[0_0_10px_rgba(180,83,9,0.5)]">3</span> :
                   <span className="text-slate-500">{index + 1}</span>}
                </div>
                
                <div className="col-span-4 flex-col flex justify-center">
                   <div className="font-semibold text-slate-200 flex items-center gap-3">
                     <div className={`p-2 rounded-lg ${isTop3 ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-slate-700'}`}>
                       <Hexagon className="w-4 h-4 text-white" />
                     </div>
                     <span className="truncate">{lead.playerName}</span> {isYou && <span className="text-xs text-indigo-400 shrink-0">(You)</span>}
                   </div>
                   <span className="text-xs text-slate-500 truncate mt-1 ml-11">{lead.mission}</span>
                </div>
                
                <div className="col-span-3 md:col-span-2 text-center text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                  {lead.score.toLocaleString()}
                </div>
                
                <div className="col-span-3 md:col-span-4 hidden md:flex justify-center gap-4 text-sm font-mono items-center">
                  <span className="text-rose-400" title="Impact">{lead.impact}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-amber-400" title="Risk">{lead.risk}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-cyan-400" title="Trust">{lead.trust}</span>
                </div>

                <div className="col-span-1 flex justify-center items-center">
                   {lead.playerEmail ? (
                     <a 
                       href={`mailto:${lead.playerEmail}?subject=${encodeURIComponent(`CodeNynx Synergy: Connecting Re: ${lead.mission}`)}`} 
                       onClick={() => {
                         navigator.clipboard.writeText(lead.playerEmail);
                         alert(`Email copied to clipboard: ${lead.playerEmail}`);
                       }}
                       className="relative z-20 p-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 text-slate-400 transition-all shadow-lg"
                       title="Email Player (Copies to Clipboard)"
                     >
                       <Mail className="w-5 h-5" />
                     </a>
                   ) : (
                     <div 
                       onClick={() => alert("This older run does not have an email attached to it! Only new runs completed after Google Auth was added support direct mailing.")}
                       className="relative z-20 p-2 text-slate-600 cursor-not-allowed" 
                       title="No email available for this older run"
                     >
                       <Mail className="w-5 h-5 opacity-30 cursor-not-allowed" />
                     </div>
                   )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
