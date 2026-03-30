export const mentalHealthScenario = {
  id: "mental_health_01",
  title: "Mental Health Care Initiative",
  description: "You are starting an initiative to support students' mental health. You have limited budget and must balance the needs of students, administration, and the wider community.",
  stakeholders: ["Students", "University Administration", "Parents"],
  startingStats: {
    impact: 10,
    budget: 50000,
    risk: 10,
    trust: 50
  },
  steps: [
    {
      id: "step_1",
      question: "How will you launch your initiative?",
      options: [
        {
          id: "launch_1",
          text: "Host a large awareness campaign campus-wide.",
          effects: { impact: 15, budget: -10000, risk: 5, trust: 10 },
          delayedEffect: null
        },
        {
          id: "launch_2",
          text: "Start small targeting only high-risk students.",
          effects: { impact: 10, budget: -2000, risk: -5, trust: 5 },
          delayedEffect: { stepToTriggerOn: 4, effect: { trust: -15, message: "General student body feels ignored because you only focused on a small group." } }
        },
        {
          id: "launch_3",
          text: "Launch an aggressive social media campaign.",
          effects: { impact: 20, budget: -5000, risk: 15, trust: 5 },
          delayedEffect: null
        }
      ]
    },
    {
      id: "step_2",
      question: "A group of parents are concerned about the stigma of your initiative. How do you respond?",
      options: [
        {
          id: "parents_1",
          text: "Organize an educational workshop for parents.",
          effects: { impact: 5, budget: -3000, risk: -10, trust: 20 },
          delayedEffect: null
        },
        {
          id: "parents_2",
          text: "Ignore them; the students are the priority.",
          effects: { impact: 5, budget: 0, risk: 20, trust: -25 },
          delayedEffect: { stepToTriggerOn: 5, effect: { budget: -10000, risk: 20, message: "Angry parents lobbied the administration to cut your funding." } }
        }
      ]
    },
    {
      id: "step_3",
      question: "You need more counselors. What's your hiring strategy?",
      options: [
        {
          id: "hire_1",
          text: "Hire expensive, highly experienced professionals.",
          effects: { impact: 25, budget: -25000, risk: -15, trust: 15 },
          delayedEffect: null
        },
        {
          id: "hire_2",
          text: "Hire recent graduates at a lower cost.",
          effects: { impact: 10, budget: -10000, risk: 10, trust: 0 },
          delayedEffect: { stepToTriggerOn: 5, effect: { risk: 15, trust: -10, impact: -5, message: "Inexperienced counselors mishandled a few cases, causing trust to drop." } }
        }
      ]
    },
    {
      id: "step_4",
      question: "The administration demands a mid-term impact report.",
      options: [
        {
          id: "report_1",
          text: "Spend time and resources to prepare a comprehensive report.",
          effects: { impact: 0, budget: -2000, risk: -10, trust: 15 },
          delayedEffect: null
        },
        {
          id: "report_2",
          text: "Provide a quick, bare-bones summary to save money.",
          effects: { impact: 0, budget: 0, risk: 15, trust: -15 },
          delayedEffect: null
        }
      ]
    },
    {
      id: "step_5",
      question: "End of the year is approaching. How do you prepare for the future?",
      options: [
        {
          id: "future_1",
          text: "Secure long-term partnerships.",
          effects: { impact: 10, budget: -5000, risk: -20, trust: 20 },
          delayedEffect: null
        },
        {
          id: "future_2",
          text: "Push for a massive final push to boost numbers.",
          effects: { impact: 20, budget: -15000, risk: 15, trust: 5 },
          delayedEffect: null
        }
      ]
    }
  ]
};
