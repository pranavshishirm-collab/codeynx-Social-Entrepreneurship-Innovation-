import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const SimulationContext = createContext();

export const useSimulation = () => useContext(SimulationContext);

export const SimulationProvider = ({ children }) => {
  // Global Game State
  const [currentScenario, setCurrentScenario] = useState(null);
  const [stakeholders, setStakeholders] = useState([]);
  
  // Stats
  const [stats, setStats] = useState({
    impact: 0,
    budget: 0,
    risk: 0,
    trust: 0,
  });

  // Flow State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [delayedEffectsQueue, setDelayedEffectsQueue] = useState([]);
  
  // Game Status: 'setup', 'generating', 'playing', 'success', 'failure'
  const [gameStatus, setGameStatus] = useState("setup");
  const [failureReason, setFailureReason] = useState("");
  
  // Keep track of the absolute starting budget to recalculate percentages
  const [initialBudget, setInitialBudget] = useState(0);

  // UI State
  const [activeMessage, setActiveMessage] = useState(null);

  // Initialization (Now Async because we query the local backend!)
  const startSimulation = async (missionText, selectedStakeholders, startingBudget) => {
    setGameStatus("generating");
    setInitialBudget(startingBudget);

    try {
      // Hit our own Node.js backend to secure the massive Gemini API transaction
      const response = await fetch("http://localhost:8080/api/generate-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionText,
          stakeholders: selectedStakeholders,
          budget: startingBudget
        })
      });

      if (!response.ok) {
        const errPayload = await response.json();
        throw new Error(errPayload.error || "Failed to generate mission via AI API.");
      }

      const generatedScenario = await response.json();
      
      setCurrentScenario(generatedScenario);
      setStakeholders(selectedStakeholders);
      
      setStats({
        ...generatedScenario.startingStats,
        budget: startingBudget
      });
      
      setCurrentStepIndex(0);
      setDecisions([]);
      setDelayedEffectsQueue([]);
      setGameStatus("playing");
      setFailureReason("");
      setActiveMessage(null);

    } catch (error) {
      console.error(error);
      alert(`AI Engine Disabled: ${error.message}`);
      setGameStatus("setup");
    }
  };

  // Calculate robust score
  const calculateScore = (finalStats, isSuccess) => {
    let score = (finalStats.impact * 10) + (finalStats.trust * 5) - (finalStats.risk * 5) + (finalStats.budget / 10000);
    if (!isSuccess) score /= 2; // Penalize failures
    return Math.max(0, Math.round(score));
  };

  const saveRunToFirebase = async (isSuccess, finalReason) => {
    try {
      const user = auth.currentUser;
      if (!user) return; // Silent return if anonymous or not loaded

      const finalScore = calculateScore(stats, isSuccess);

      await addDoc(collection(db, "runs"), {
        uid: user.uid,
        playerName: user.displayName || "Unknown Entrepreneur",
        playerEmail: user.email || null,
        mission: currentScenario?.title || "Custom Mission",
        score: finalScore,
        impact: stats.impact,
        risk: Math.round(stats.risk),
        trust: Math.round(stats.trust),
        budget: Math.round(stats.budget),
        isSuccess,
        failureReason: finalReason || null,
        timestamp: serverTimestamp()
      });
      console.log("Run saved to Global Leaderboard!");
    } catch (err) {
      console.error("Failed to save run to Firebase:", err);
    }
  };

  // Checking Failure Conditions
  useEffect(() => {
    if (gameStatus !== "playing") return;

    if (stats.budget < 0) {
      failSimulation("You ran out of budget! Without funds, your initiative collapsed.");
    } else if (stats.risk >= 100) {
      failSimulation("The risks became too high! The administration forcefully shut down your operation.");
    } else if (stats.trust <= 0) {
      failSimulation("You lost all trust from your stakeholders. No one supports your initiative anymore.");
    }
  }, [stats, gameStatus]);

  const failSimulation = (reason) => {
    setFailureReason(reason);
    setGameStatus("failure");
    saveRunToFirebase(false, reason);
  };

  // Processing a Decision
  const makeDecision = (option) => {
    // 1. Record Decision
    setDecisions([...decisions, { step: currentStepIndex, option }]);

    // 2. Apply Immediate Effects
    // Crucial Update: AI output now returns `budgetPercentage`. 
    // We deduct or add percentages of their initial 10-Crore-scale budget.
    setStats((prev) => {
      let budgetMod = option.effects.budgetPercentage 
        ? (initialBudget * (option.effects.budgetPercentage / 100))
        : (option.effects.budget || 0);

      return {
        impact: Math.max(0, prev.impact + (option.effects.impact || 0)),
        budget: prev.budget + budgetMod,
        risk: Math.max(0, prev.risk + (option.effects.risk || 0)),
        trust: Math.max(0, Math.min(100, prev.trust + (option.effects.trust || 0)))
      };
    });

    // 3. Queue Delayed Effects if any
    if (option.delayedEffect) {
      setDelayedEffectsQueue([...delayedEffectsQueue, option.delayedEffect]);
    }

    // 4. Move to next logic
    advanceStep();
  };

  const executeCustomAction = async (customText, currentQuestion) => {
    setActiveMessage("The AI Game Master is currently calculating the mathematical impact of your custom decision...");
    
    try {
      const response = await fetch("http://localhost:8080/api/judge-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionText: currentScenario.title || "Custom Mission",
          currentQuestion,
          userAction: customText
        })
      });

      if (!response.ok) {
        const errPayload = await response.json();
        throw new Error(errPayload.error || "AI Judging failed.");
      }

      const generatedOption = await response.json();
      setActiveMessage(null); // Clear loading state
      
      // Feed the dynamically generated option right into the standard choice engine
      makeDecision(generatedOption);

    } catch (error) {
      console.error(error);
      alert(`AI Judge Disabled: ${error.message}`);
      setActiveMessage(null);
    }
  };

  const advanceStep = () => {
    const nextIndex = currentStepIndex + 1;
    
    // Check if we reached the end
    if (nextIndex >= currentScenario.steps.length) {
      setGameStatus("success");
      saveRunToFirebase(true, null);
      return;
    }

    setCurrentStepIndex(nextIndex);

    // Process any delayed effects that should trigger on this NEW step
    const triggeredEffects = delayedEffectsQueue.filter(
      (effect) => effect.stepToTriggerOn === nextIndex
    );
    
    if (triggeredEffects.length > 0) {
      // Apply them
      let impactMod = 0;
      let budgetMod = 0;
      let riskMod = 0;
      let trustMod = 0;
      let messages = [];

      triggeredEffects.forEach((eff) => {
        impactMod += eff.effect.impact || 0;
        
        // Handle delayed percentages
        if (eff.effect.budgetPercentage) {
           budgetMod += (initialBudget * (eff.effect.budgetPercentage / 100));
        } else if (eff.effect.budget) {
           budgetMod += eff.effect.budget;
        }

        riskMod += eff.effect.risk || 0;
        trustMod += eff.effect.trust || 0;
        if (eff.effect.message) messages.push(eff.effect.message);
      });

      setStats((prev) => ({
         impact: Math.max(0, prev.impact + impactMod),
         budget: prev.budget + budgetMod,
         risk: Math.max(0, prev.risk + riskMod),
         trust: Math.max(0, Math.min(100, prev.trust + trustMod))
      }));

      // Show the message to the user
      setActiveMessage(messages.join(" "));

      // Remove triggered effects from queue
      setDelayedEffectsQueue(
        delayedEffectsQueue.filter(eff => eff.stepToTriggerOn !== nextIndex)
      );
    }
  };

  // Helper to clear active message
  const dismissMessage = () => setActiveMessage(null);

  // Restart / Rewind
  const restart = () => {
    setGameStatus("setup");
  };

  return (
    <SimulationContext.Provider
      value={{
        currentScenario,
        initialBudget,
        stakeholders,
        stats,
        currentStepIndex,
        decisions,
        gameStatus,
        failureReason,
        activeMessage,
        executeCustomAction,
        startSimulation,
        makeDecision,
        dismissMessage,
        restart,
        restartSimulation: restart
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};
