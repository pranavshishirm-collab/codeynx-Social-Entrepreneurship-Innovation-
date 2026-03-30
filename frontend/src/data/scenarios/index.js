import { mentalHealthScenario } from './mentalHealth';
import { educationScenario } from './education';
import { environmentScenario } from './environment';
import { empowermentScenario } from './empowerment';
import { waterScenario } from './water';

export const scenarios = {
  mental_health: mentalHealthScenario,
  education: educationScenario,
  environment: environmentScenario,
  empowerment: empowermentScenario,
  water: waterScenario
};

// Also export as an array for UI listing
export const getAvailableScenarios = () => Object.values(scenarios);
