export type CategoryKey = 'grow' | 'space' | 'energy' | 'life';

export const CATEGORY_NAMES: Record<CategoryKey, string> = {
  grow: 'Plants & Gardening',
  space: 'Home & Organization',
  energy: 'Energy & Savings',
  life: 'Mindful Living',
};

export const CATEGORIES: Record<
  CategoryKey,
  { name: string; icon: string; description: string; color: string; subtopics: string[] }
> = {
  grow: {
    name: 'Plants & Gardening',
    icon: '🌱',
    description: 'Indoor plants, balcony gardens, herbs, microgreens and beginner-friendly hydroponics.',
    color: '#79A96B',
    subtopics: ['Indoor Plants', 'Plant Care', 'Balcony Gardening', 'Herbs', 'Hydroponics', 'Microgreens', 'Mini Gardens'],
  },
  space: {
    name: 'Home & Organization',
    icon: '🏠',
    description: 'Decluttering, organization and storage ideas that help small homes feel easier to live in.',
    color: '#40A37A',
    subtopics: ['Decluttering', 'Organization', 'Storage', 'Apartment Living', 'Vertical Storage', 'Checklists'],
  },
  energy: {
    name: 'Energy & Savings',
    icon: '⚡',
    description: 'Practical ways to cut waste, understand solar and choose more efficient home technology.',
    color: '#E8C75A',
    subtopics: ['Energy Saving', 'Solar Panels', 'Appliances', 'Battery Storage', 'Smart Thermostats'],
  },
  life: {
    name: 'Mindful Living',
    icon: '🧘',
    description: 'Digital wellness, minimalism and mindful routines for a calmer relationship with time and attention.',
    color: '#A7C99B',
    subtopics: ['Digital Minimalism', 'Digital Detox', 'Underconsumption', 'Slow Living', 'Mindful Routines'],
  },
};
