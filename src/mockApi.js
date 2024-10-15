let mockSnags = [
  { id: 1, category: 'Bedroom', title: 'Broken lamp', description: 'The bedside lamp is not working', date: new Date().toISOString() },
  { id: 2, category: 'Kitchen', title: 'Leaky faucet', description: 'The kitchen sink is dripping', date: new Date().toISOString() },
];

export const getSnags = () => {
  return Promise.resolve(mockSnags);
};

export const addSnag = (snag) => {
  const newSnag = { ...snag, id: mockSnags.length + 1, date: new Date().toISOString() };
  mockSnags.push(newSnag);
  return Promise.resolve(newSnag);
};

export const deleteSnag = (id) => {
  mockSnags = mockSnags.filter(snag => snag.id !== id);
  return Promise.resolve();
};

