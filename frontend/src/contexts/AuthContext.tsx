// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { authClient } from '@/api/client';

// interface User {
//   username: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Check for existing token on mount
//     const token = localStorage.getItem('token');
//     const savedUser = localStorage.getItem('user');
    
//     if (token && savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       }
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
//     try {
//       // Send as application/x-www-form-urlencoded for FastAPI OAuth2
//       const formData = new URLSearchParams();
//       formData.append('username', username);
//       formData.append('password', password);

//       const response = await authClient.post('/auth/login', formData);
      
//       const { access_token } = response.data;
      
//       localStorage.setItem('token', access_token);
//       localStorage.setItem('user', JSON.stringify({ username }));
//       setUser({ username });
      
//       return { success: true };
//     } catch (error: unknown) {
//       // For demo purposes, allow mock login when backend is unavailable
//       if (username === 'demo' && password === 'demo123') {
//         const mockToken = 'mock-jwt-token-for-development';
//         localStorage.setItem('token', mockToken);
//         localStorage.setItem('user', JSON.stringify({ username }));
//         setUser({ username });
//         return { success: true };
//       }
      
//       const axiosError = error as { response?: { data?: { detail?: string } } };
//       return { 
//         success: false, 
//         error: axiosError.response?.data?.detail || 'Login failed. Please check your credentials.' 
//       };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         isLoading,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authClient } from '@/api/client';

interface User {
  username: string;
  name?: string;
  shop_id?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await authClient.post('/auth/login', formData);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      
      // Since your backend response_model is just Token, we store the username locally
      // Later, we can add a /me endpoint to get full user details
      const userData = { username };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};