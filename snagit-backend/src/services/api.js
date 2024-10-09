// This is a mock API service. Replace with actual API calls when you have a backend.

const mockUsers = [];

export const register = async (username, password) => {
  // Check if user already exists
  if (mockUsers.find(user => user.username === username)) {
    throw new Error('User already exists');
  }

  const newUser = { username, password };
  mockUsers.push(newUser);

  return { user: { username }, token: 'mock-token' };
};

export const login = async (username, password) => {
  const user = mockUsers.find(user => user.username === username && user.password === password);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  return { user: { username }, token: 'mock-token' };
};
