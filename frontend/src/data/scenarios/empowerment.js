export const empowermentScenario = {
  id: "empowerment_01",
  title: "Micro-Finance Empowerment",
  description: "You are setting up a micro-finance fund for rural women entrepreneurs to escape exploitative loan sharks. Financial literacy and trust are your primary barriers.",
  stakeholders: ["NGO Partners", "Local Community", "Government / Policymakers"],
  startingStats: {
    impact: 5,
    budget: 50000,
    risk: 40,
    trust: 20
  },
  steps: [
    {
      id: "step_1",
      question: "The first loan application comes from a group of women wanting to buy sewing machines, but they have zero financial history.",
      options: [
        {
          id: "loan_1",
          text: "Approve the loan immediately to build early trust.",
          effects: { impact: 20, budget: -10000, risk: 25, trust: 25 },
          delayedEffect: { stepToTriggerOn: 4, effect: { budget: -15000, risk: 10, message: "Without prior financial literacy training, the first group defaulted on their sewing machine loan." } }
        },
        {
          id: "loan_2",
          text: "Require a 2-week mandatory financial literacy boot camp first.",
          effects: { impact: 10, budget: -5000, risk: -15, trust: 5 },
          delayedEffect: null
        },
        {
          id: "loan_3",
          text: "Deny the application until they find a guarantor.",
          effects: { impact: -10, budget: 0, risk: -25, trust: -20 },
          delayedEffect: null
        }
      ]
    },
    {
      id: "step_2",
      question: "Local loan sharks start threatening the women participating in your program.",
      options: [
        {
          id: "sharks_1",
          text: "Hire private security for your hub and local meetings.",
          effects: { impact: 5, budget: -20000, risk: -20, trust: 15 },
          delayedEffect: null
        },
        {
          id: "sharks_2",
          text: "Partner with local police to conduct raids.",
          effects: { impact: -10, budget: -5000, risk: 35, trust: -15 },
          delayedEffect: { stepToTriggerOn: 5, effect: { risk: 30, trust: -25, message: "Police corruption led to raids on innocent vendors, destroying your organization's reputation." } }
        },
        {
          id: "sharks_3",
          text: "Quietly organize the community to act as neighborhood watches.",
          effects: { impact: 15, budget: 0, risk: 15, trust: 25 },
          delayedEffect: null
        }
      ]
    },
    {
      id: "step_3",
      question: "You have a surplus of funding. How do you scale operations?",
      options: [
        {
          id: "scale_1",
          text: "Increase the maximum loan size for existing successful clients.",
          effects: { impact: 20, budget: -15000, risk: 15, trust: 10 },
          delayedEffect: null
        },
        {
          id: "scale_2",
          text: "Open three new branches in neighboring districts rapidly.",
          effects: { impact: 30, budget: -35000, risk: 40, trust: -5 },
          delayedEffect: { stepToTriggerOn: 5, effect: { budget: -10000, risk: 20, message: "Rapid expansion lacked oversight. Many satellite branches failed due to poor management." } }
        }
      ]
    },
    {
      id: "step_4",
      question: "The Government offers to subsidize your fund, but demands access to your clients' private data.",
      options: [
        {
          id: "data_1",
          text: "Accept the subsidy. The funds are worth the privacy risk.",
          effects: { impact: 15, budget: 30000, risk: 20, trust: -25 },
          delayedEffect: null
        },
        {
          id: "data_2",
          text: "Refuse the subsidy. Protect their privacy at all costs.",
          effects: { impact: 5, budget: -5000, risk: -10, trust: 30 },
          delayedEffect: null
        }
      ]
    },
    {
      id: "step_5",
      question: "A client invents a revolutionary low-cost loom, but needs a massive loan to patent and manufacture it.",
      options: [
        {
          id: "loom_1",
          text: "Drain your remaining reserves to back her entirely. It's a huge gamble.",
          effects: { impact: 40, budget: -30000, risk: 30, trust: 15 },
          delayedEffect: null
        },
        {
          id: "loom_2",
          text: "Connect her to external, ruthless venture capitalists to save your funds.",
          effects: { impact: -15, budget: 0, risk: 10, trust: -25 },
          delayedEffect: null
        }
      ]
    }
  ]
};
