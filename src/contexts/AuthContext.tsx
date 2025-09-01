import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há token salvo ao inicializar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get('auth-token');
        const userData = Cookies.get('user-data');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Limpar cookies inválidos
        Cookies.remove('auth-token');
        Cookies.remove('user-data');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user && data.token) {
        // Salvar token e dados do usuário
        Cookies.set('auth-token', data.token, { expires: 7 }); // 7 dias
        Cookies.set('user-data', JSON.stringify(data.user), { expires: 7 });
        
        setUser(data.user);
        return true;
      } else {
        console.error('Erro no login:', data.message || data.error);
        return false;
      }
    } catch (error) {
      console.error('Erro na requisição de login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Limpar cookies
    Cookies.remove('auth-token');
    Cookies.remove('user-data');
    
    // Limpar estado
    setUser(null);
    
    // Redirecionar para login
    window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
