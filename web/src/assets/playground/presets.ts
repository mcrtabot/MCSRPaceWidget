import { TimelineData } from '../../types';

export type Preset = {
  name: string;
  description: string;
  timeline: TimelineData;
};

// PB: nether=267704, bastion=318752, fortress=523752, portal=756002, stronghold=871511, end=935511, credits=1049704

export const presets: Preset[] = [
  {
    name: 'New PB',
    description: 'All splits faster than PB',
    timeline: {
      igt: 980000,
      timelines: [
        { type: 'enter_nether', igt: 200000 },
        { type: 'enter_bastion', igt: 280000 },
        { type: 'enter_fortress', igt: 460000 },
        { type: 'first_portal', igt: 680000 },
        { type: 'enter_stronghold', igt: 790000 },
        { type: 'enter_end', igt: 860000 },
        { type: 'credits', igt: 980000 },
      ],
    },
  },
  {
    name: 'No PB',
    description: 'All splits slower than PB',
    timeline: {
      igt: 1250000,
      timelines: [
        { type: 'enter_nether', igt: 340000 },
        { type: 'enter_bastion', igt: 420000 },
        { type: 'enter_fortress', igt: 650000 },
        { type: 'first_portal', igt: 870000 },
        { type: 'enter_stronghold', igt: 1010000 },
        { type: 'enter_end', igt: 1100000 },
        { type: 'credits', igt: 1250000 },
      ],
    },
  },
  {
    name: 'Behind then Ahead',
    description: 'Behind early, catches up later',
    timeline: {
      igt: 1020000,
      timelines: [
        { type: 'enter_nether', igt: 350000 },
        { type: 'enter_bastion', igt: 430000 },
        { type: 'enter_fortress', igt: 560000 },
        { type: 'first_portal', igt: 730000 },
        { type: 'enter_stronghold', igt: 830000 },
        { type: 'enter_end', igt: 900000 },
        { type: 'credits', igt: 1020000 },
      ],
    },
  },
  {
    name: 'Fortress First',
    description: 'Fortress before Bastion order',
    timeline: {
      igt: 1100000,
      timelines: [
        { type: 'enter_nether', igt: 230000 },
        { type: 'enter_fortress', igt: 380000 },
        { type: 'enter_bastion', igt: 500000 },
        { type: 'first_portal', igt: 720000 },
        { type: 'enter_stronghold', igt: 850000 },
        { type: 'enter_end', igt: 950000 },
        { type: 'credits', igt: 1100000 },
      ],
    },
  },
  {
    name: 'In Progress',
    description: 'Mid-run, not yet finished',
    timeline: {
      igt: 900000,
      timelines: [
        { type: 'enter_nether', igt: 250000 },
        { type: 'enter_bastion', igt: 340000 },
        { type: 'enter_fortress', igt: 520000 },
        { type: 'first_portal', igt: 710000 },
        { type: 'enter_stronghold', igt: 850000 },
      ],
    },
  },
  {
    name: 'Empty',
    description: 'No splits (igt: null)',
    timeline: {
      igt: null,
      timelines: [],
    },
  },
];
