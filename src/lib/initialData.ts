import { CompetencyProgressItem } from '../types';

export const INITIAL_COMPETENCIES: CompetencyProgressItem[] = [
  {
    id: 'kreativitas',
    name: 'Kreativitas',
    key: 'creativity',
    currentScore: 0,
    initialScore: 0,
    delta: 0,
    color: '#EF4444' // red/coral
  },
  {
    id: 'critical-thinking',
    name: 'Critical Thinking',
    key: 'criticalThinking',
    currentScore: 0,
    initialScore: 0,
    delta: 0,
    color: '#F59E0B' // amber/gold
  },
  {
    id: 'komunikasi',
    name: 'Komunikasi',
    key: 'communication',
    currentScore: 0,
    initialScore: 0,
    delta: 0,
    color: '#3B82F6' // blue
  },
  {
    id: 'digital-skills',
    name: 'Digital Skills',
    key: 'digitalSkills',
    currentScore: 0,
    initialScore: 0,
    delta: 0,
    color: '#10B981' // emerald
  },
  {
    id: 'kemandirian',
    name: 'Kemandirian',
    key: 'independence',
    currentScore: 0,
    initialScore: 0,
    delta: 0,
    color: '#8B5CF6' // violet/purple
  }
];
