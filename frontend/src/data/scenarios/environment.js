export const environmentScenario = {
  id: "environment_01",
  title: "Urban Waste Management",
  description: "You're creating a 'Plastic-for-Goods' economy in an overcrowded urban slum. Your goal is to incentivize recycling while avoiding conflict with the powerful informal waste-picker syndicates.",
  stakeholders: ["Private Sector / Corporations", "Local Community", "Government / Policymakers"],
  startingStats: {
    impact: 5,
    budget: 50000,
    risk: 25,
    trust: 30
  },
  steps: [
    {
      id: "step_1",
      question: "To launch the 'Plastic-for-Goods' market, you need a physical collection hub. Where do you build?",
      options: [
        {
          id: "hub_1",
          text: "Lease a premium space at the edge of the slum for visibility.",
          effects: { impact: 15, budget: -15000, risk: 5, trust: 5 },
          delayedEffect: null
        },
        {
          id: "hub_2",
          text: "Repurpose an abandoned warehouse deep inside the slum.",
          effects: { impact: 20, budget: -5000, risk: 15, trust: 10 },
          delayedEffect: { stepToTriggerOn: 3, effect: { risk: 20, budget: -5000, message: "Local gangs extorted your deep-slum warehouse for protection money." } }
        }
      ]
    },
    {
      id: "step_2",
      question: "The existing informal waste-pickers demand you stop 'stealing' their plastic. How do you react?",
      options: [
        {
          id: "syndicate_1",
          text: "Hire them as official salaried employees.",
          effects: { impact: 15, budget: -20000, risk: -15, trust: 20 },
          delayedEffect: null
        },
        {
          id: "syndicate_2",
          text: "Ignore them and rely on police protection.",
          effects: { impact: 5, budget: -5000, risk: 35, trust: -25 },
          delayedEffect: { stepToTriggerOn: 4, effect: { impact: -20, trust: -15, message: "Waste-picker syndicates staged a massive protest, halting your operations." } }
        },
        {
          id: "syndicate_3",
          text: "Pay them a premium for the plastic they bring to you.",
          effects: { impact: 10, budget: -15000, risk: -5, trust: 10 },
          delayedEffect: null
        }
      ]
    },
    {
      id: "step_3",
      question: "A corporation offers heavily discounted food supplies to trade for plastic, but their food is low quality and highly processed.",
      options: [
        {
          id: "corp_1",
          text: "Refuse the deal. Health of the community comes first.",
          effects: { impact: 10, budget: 0, risk: -5, trust: 15 },
          delayedEffect: null
        },
        {
          id: "corp_2",
          text: "Accept it. You need cheap goods to keep the plastic flowing.",
          effects: { impact: -5, budget: 10000, risk: 10, trust: -10 },
          delayedEffect: { stepToTriggerOn: 5, effect: { impact: -15, trust: -20, message: "Health issues linked to the processed food caused severe community backlash." } }
        }
      ]
    },
    {
      id: "step_4",
      question: "The monsoon hits, and the slum floods. The government asks you to pivot operations to emergency relief.",
      options: [
        {
          id: "flood_1",
          text: "Pivot immediately to emergency relief operations.",
          effects: { impact: 30, budget: -15000, risk: -10, trust: 30 },
          delayedEffect: null
        },
        {
          id: "flood_2",
          text: "Stay focused on plastic collection. It prevents further clogging.",
          effects: { impact: 5, budget: 0, risk: 15, trust: -20 },
          delayedEffect: null
        }
      ]
    },
    {
      id: "step_5",
      question: "You've successfully collected 100 tons of plastic. Who gets the contract to process it?",
      options: [
        {
          id: "process_1",
          text: "A highly-rated, expensive green-tech factory.",
          effects: { impact: 20, budget: -20000, risk: -10, trust: 15 },
          delayedEffect: null
        },
        {
          id: "process_2",
          text: "A cheap, unverified local melting plant.",
          effects: { impact: -10, budget: 15000, risk: 25, trust: -15 },
          delayedEffect: null
        }
      ]
    }
  ]
};
