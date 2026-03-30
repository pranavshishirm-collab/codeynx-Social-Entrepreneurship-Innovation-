export const educationScenario = {
  id: "education_01",
  title: "Rural Education Access",
  description: "You are leading a project to bring digital literacy and resources to isolated rural communities. The task is complex and requires balancing funds between tech infrastructure and teacher training.",
  stakeholders: ["NGO Partners", "Government / Policymakers", "Local Community"],
  startingStats: {
    impact: 10,
    budget: 50000,
    risk: 15,
    trust: 40
  },
  steps: [
    {
      id: "step_1",
      question: "The project kicks off. Where do you allocate the bulk of your initial funding?",
      options: [
        {
          id: "launch_1",
          text: "Purchase high-end laptops for specific 'hub' schools.",
          effects: { impact: 20, budget: -20000, risk: 10, trust: 5 },
          delayedEffect: { stepToTriggerOn: 4, effect: { trust: -15, risk: 10, message: "Due to lack of training, many of the high-end laptops lay unused or broken." } }
        },
        {
          id: "launch_2",
          text: "Invest heavily in training local teachers first using basic tech.",
          effects: { impact: 10, budget: -10000, risk: -5, trust: 15 },
          delayedEffect: { stepToTriggerOn: 3, effect: { impact: 15, trust: 10, message: "Well-trained teachers are now scaling the curriculum on their own!" } }
        },
        {
          id: "launch_3",
          text: "Partner with an overpriced corporate firm for a quick digital rollout.",
          effects: { impact: 15, budget: -30000, risk: 20, trust: -10 },
          delayedEffect: null
        }
      ]
    },
    {
      id: "step_2",
      question: "The local government demands alignment with their outdated curriculum. Your response?",
      options: [
        {
          id: "gov_1",
          text: "Comply fully. It jeopardizes quality but secures legal safety.",
          effects: { impact: -10, budget: 0, risk: -15, trust: 10 },
          delayedEffect: null
        },
        {
          id: "gov_2",
          text: "Negotiate a 'pilot' program to test your modern curriculum.",
          effects: { impact: 10, budget: -2000, risk: 15, trust: 5 },
          delayedEffect: null
        },
        {
          id: "gov_3",
          text: "Ignore them and push modern curriculum under the radar.",
          effects: { impact: 15, budget: 0, risk: 30, trust: -20 },
          delayedEffect: { stepToTriggerOn: 5, effect: { budget: -15000, risk: 20, message: "The government discovered your unapproved curriculum and fined the initiative." } }
        }
      ]
    },
    {
      id: "step_3",
      question: "A severe monsoon season damages the only road to three major villages. How do you maintain access?",
      options: [
        {
          id: "road_1",
          text: "Pay heavily for helicopter/drone drops for educational materials.",
          effects: { impact: 5, budget: -25000, risk: 5, trust: 20 },
          delayedEffect: null
        },
        {
          id: "road_2",
          text: "Pause the program entirely until roads are fixed.",
          effects: { impact: -15, budget: 0, risk: -10, trust: -25 },
          delayedEffect: null
        },
        {
          id: "road_3",
          text: "Mobilize local community volunteers to hand-deliver packages.",
          effects: { impact: 10, budget: -1000, risk: 15, trust: 25 },
          delayedEffect: null
        }
      ]
    },
    {
      id: "step_4",
      question: "A major news outlet wants to cover your progress, but they want an exclusive, slightly sensationalized story.",
      options: [
        {
          id: "media_1",
          text: "Reject their offer. You control your own PR.",
          effects: { impact: -5, budget: 0, risk: -5, trust: 10 },
          delayedEffect: null
        },
        {
          id: "media_2",
          text: "Accept the exclusive. Free marketing is essential.",
          effects: { impact: 20, budget: 0, risk: 20, trust: -10 },
          delayedEffect: { stepToTriggerOn: 5, effect: { budget: 15000, trust: -15, message: "The sensational news story generated massive donations, but local NGOs felt betrayed." } }
        }
      ]
    },
    {
      id: "step_5",
      question: "The academic year concludes. What's your sustainability plan?",
      options: [
        {
          id: "end_1",
          text: "Hand over full ownership to the local community.",
          effects: { impact: 15, budget: 0, risk: 10, trust: 20 },
          delayedEffect: null
        },
        {
          id: "end_2",
          text: "Scale the project to 10 more villages using remaining funds.",
          effects: { impact: 25, budget: -15000, risk: 25, trust: 5 },
          delayedEffect: null
        }
      ]
    }
  ]
};
