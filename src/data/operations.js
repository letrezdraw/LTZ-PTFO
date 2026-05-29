// Operations/Categories data structure
// This defines the gallery categories and sub-categories

export const defaultOperations = [
  {
    id: 'character-art',
    name: 'Character Art',
    icon: '👤',
    order: 1,
    subcategories: [
      { id: 'full-character', name: 'Full Character', order: 1 },
      { id: 'character-design', name: 'Character Design', order: 2 },
      { id: 'expression-study', name: 'Expression Studies', order: 3 },
      { id: 'costume-design', name: 'Costume Design', order: 4 }
    ]
  },
  {
    id: 'concept-art',
    name: 'Concept Art',
    icon: '🎨',
    order: 2,
    subcategories: [
      { id: 'mech-concept', name: 'Mech Concept', order: 1 },
      { id: 'environment-concept', name: 'Environment', order: 2 },
      { id: 'creature-concept', name: 'Creature Design', order: 3 },
      { id: 'prop-design', name: 'Prop Design', order: 4 }
    ]
  },
  {
    id: 'splash-art',
    name: 'Splash Art',
    icon: '💥',
    order: 3,
    subcategories: [
      { id: 'character-splash', name: 'Character Splash', order: 1 },
      { id: 'action-splash', name: 'Action Splash', order: 2 },
      { id: 'promotional', name: 'Promotional', order: 3 }
    ]
  },
  {
    id: 'illustration',
    name: 'Illustration',
    icon: '🖼️',
    order: 4,
    subcategories: [
      { id: 'digital-illustration', name: 'Digital', order: 1 },
      { id: 'traditional', name: 'Traditional', order: 2 },
      { id: 'mixed-media', name: 'Mixed Media', order: 3 }
    ]
  },
  {
    id: 'sketch',
    name: 'Sketch',
    icon: '✏️',
    order: 5,
    subcategories: [
      { id: 'character-sketch', name: 'Character Sketch', order: 1 },
      { id: 'anatomy-study', name: 'Anatomy Study', order: 2 },
      { id: 'quick-sketch', name: 'Quick Sketch', order: 3 }
    ]
  },
  {
    id: 'animation',
    name: 'Animation',
    icon: '🎬',
    order: 6,
    subcategories: [
      { id: 'character-animation', name: 'Character', order: 1 },
      { id: 'motion-graphics', name: 'Motion Graphics', order: 2 },
      { id: 'gif-animation', name: 'GIF', order: 3 }
    ]
  }
];

// Helper functions for managing operations
export const getOperationById = (operations, id) => {
  return operations.find((op) => op.id === id);
};

export const getSubcategoryById = (operation, subcatId) => {
  if (!operation) return null;
  return operation.subcategories?.find((sub) => sub.id === subcatId);
};

export const getArtworksForOperation = (artworks, operationId, subcategoryId) => {
  if (!artworks) return [];
  return artworks.filter((art) => {
    const opMatch = art.operation === operationId;
    const subMatch = !subcategoryId || art.subcategory === subcategoryId;
    return opMatch && subMatch;
  });
};

export const updateOperationOrder = (operations, fromIndex, toIndex) => {
  const items = Array.from(operations);
  const [removed] = items.splice(fromIndex, 1);
  items.splice(toIndex, 0, removed);
  return items.map((item, idx) => ({ ...item, order: idx + 1 }));
};
