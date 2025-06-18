export interface User {
  email: string;
  password: string;
  createdAt: string;
  settings: Record<string, any>;
  savedPrograms: string[];
  mealPlans: any[];
}

export const getCurrentUser = (): string | null => {
  return localStorage.getItem('fitness-current-user');
};

export const isLoggedIn = (): boolean => {
  return getCurrentUser() !== null;
};

export const logout = (): void => {
  localStorage.removeItem('fitness-current-user');
};

export const getUserData = (username?: string): User | null => {
  const currentUser = username || getCurrentUser();
  if (!currentUser) return null;
  
  const users = JSON.parse(localStorage.getItem('fitness-users') || '{}');
  return users[currentUser] || null;
};

export const saveUserData = (data: Partial<User>, username?: string): void => {
  const currentUser = username || getCurrentUser();
  if (!currentUser) return;
  
  const users = JSON.parse(localStorage.getItem('fitness-users') || '{}');
  if (users[currentUser]) {
    users[currentUser] = { ...users[currentUser], ...data };
    localStorage.setItem('fitness-users', JSON.stringify(users));
  }
};

export const saveUserSetting = (key: string, value: any, username?: string): void => {
  const currentUser = username || getCurrentUser();
  if (!currentUser) return;
  
  const userData = getUserData(currentUser);
  if (userData) {
    userData.settings[key] = value;
    saveUserData(userData, currentUser);
  }
};

export const getUserSetting = (key: string, defaultValue?: any, username?: string): any => {
  const userData = getUserData(username);
  return userData?.settings[key] ?? defaultValue;
};

export const getUserEmail = (username?: string): string | null => {
  const userData = getUserData(username);
  return userData?.email || null;
};

export const getAllUsers = (): Record<string, User> => {
  return JSON.parse(localStorage.getItem('fitness-users') || '{}');
};

export const getUserCreatedDate = (username?: string): string | null => {
  const userData = getUserData(username);
  return userData?.createdAt || null;
}; 