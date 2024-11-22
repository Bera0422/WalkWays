import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { listenToAuthState } from "../services/authService";

// Define the type for user
interface User {
  displayName: string;
  email: string;
  uid: string;
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listenToAuthState((currentUser: User | null) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
