export const waterScenario = {
  id: "water_01",
  title: "Clean Water Distribution",
  description: "An arid, politically tense region completely lacks clean drinking water. Your job is to construct solar-powered filtration hubs and ensure equitable distribution.",
  stakeholders: ["Government / Policymakers", "Private Sector / Corporations", "Media"],
  startingStats: {
    impact: 10,
    budget: 50000,
    risk: 35,
    trust: 10
  },
  steps: [
    {
      id: "step_1",
      question: "You need to drill the first deep borehole. Two locations are available.",
      options: [
        {
          id: "drill_1",
          text: "Drill on government land (cheaper, easier permits).",
          effects: { impact: 10, budget: -10000, risk: -10, trust: -15 },
          delayedEffect: { stepToTriggerOn: 4, effect: { risk: 20, trust: -25, message: "The government seized full control of your borehole for political favoritism during the election season." } }
        },
        {
          id: "drill_2",
          text: "Drill on neutral, remote land (expensive, requires building a pipeline).",
          effects: { impact: 20, budget: -25000, risk: 15, trust: 25 },
          delayedEffect: null
        }
      ]
    },
    {
      id: "step_2",
      question: "The water starts flowing, but local water cartels who sell dirty water at high prices begin sabotaging your pipes.",
      options: [
        {
          id: "cartel_1",
          text: "Pay them a temporary 'tax' to leave your infrastructure alone.",
          effects: { impact: 10, budget: -15000, risk: -20, trust: -10 },
          delayedEffect: null
        },
        {
          id: "cartel_2",
          text: "Spend heavily on armored infrastructure and security personnel.",
          effects: { impact: 15, budget: -30000, risk: 25, trust: 15 },
          delayedEffect: { stepToTriggerOn: 5, effect: { budget: -10000, risk: -10, message: "An intense security confrontation permanently dismantled the local water cartel." } }
        }
      ]
    },
    {
      id: "step_3",
      question: "Filtration filters are degrading rapidly due to heavy heavy metals in the soil.",
      options: [
        {
          id: "filter_1",
          text: "Import expensive military-grade filters from overseas.",
          effects: { impact: 20, budget: -20000, risk: -15, trust: 10 },
          delayedEffect: null
        },
        {
          id: "filter_2",
          text: "Try a cheaper, experimental biodegradable filter produced locally.",
          effects: { impact: 5, budget: -5000, risk: 35, trust: 0 },
          delayedEffect: { stepToTriggerOn: 5, effect: { impact: -20, trust: -30, risk: 25, message: "The experimental filters failed catastrophically, delivering contaminated water to thousands." } }
        }
      ]
    },
    {
      id: "step_4",
      question: "A massive multinational beverage company wants to buy the rights to your filtration technology.",
      options: [
        {
          id: "sell_1",
          text: "Sell the rights immediately. You need the staggering amount of cash.",
          effects: { impact: -15, budget: 50000, risk: 10, trust: -40 },
          delayedEffect: null
        },
        {
          id: "sell_2",
          text: "Refuse the offer. The technology belongs to the public.",
          effects: { impact: 15, budget: 0, risk: -10, trust: 35 },
          delayedEffect: null
        }
      ]
    },
    {
      id: "step_5",
      question: "Drought hits the region. Your filtration hub is the only functioning water source for miles.",
      options: [
        {
          id: "drought_1",
          text: "Ration the water strictly to ensure the machines don't break.",
          effects: { impact: 10, budget: 0, risk: -25, trust: -15 },
          delayedEffect: null
        },
        {
          id: "drought_2",
          text: "Run the machines at 200% capacity to save as many lives as possible.",
          effects: { impact: 40, budget: -15000, risk: 40, trust: 30 },
          delayedEffect: null
        }
      ]
    }
  ]
};
