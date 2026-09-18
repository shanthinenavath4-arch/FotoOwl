export interface User {
  fullName: string;
  email: string;
  gender: "Male" | "Female" | "Other";
  mobile: string;
  address: string;
  city: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  register: (user: User) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  updateProfile: (updatedUser: User) => Promise<void>;
}