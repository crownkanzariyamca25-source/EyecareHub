import { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  createdAt: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  addresses: Address[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock registered users storage
const registeredUsers: { email: string; password: string; name: string }[] = [
  { email: 'user@test.com', password: 'Test@123', name: 'Test User' }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      name: 'Test User',
      phone: '+1 234 567 8900',
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true
    }
  ]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser({
        id: Date.now().toString(),
        name: foundUser.name,
        email: foundUser.email,
        phone: '',
        avatar: foundUser.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        createdAt: new Date().toISOString()
      });
      return { success: true, message: 'Login successful!' };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const existingUser = registeredUsers.find(u => u.email === email);
    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }
    
    registeredUsers.push({ email, password, name });
    
    setUser({
      id: Date.now().toString(),
      name,
      email,
      phone: '',
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
      createdAt: new Date().toISOString()
    });
    
    return { success: true, message: 'Registration successful!' };
  };

  const logout = () => {
    setUser(null);
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = registeredUsers.find(u => u.email === email);
    if (foundUser) {
      return { success: true, message: 'Password reset link sent to your email!' };
    }
    
    return { success: false, message: 'Email not found' };
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (user) {
      setUser({ ...user, ...data });
      return { success: true, message: 'Profile updated successfully!' };
    }
    
    return { success: false, message: 'User not found' };
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!user) return { success: false, message: 'User not found' };
    
    const foundUser = registeredUsers.find(u => u.email === user.email);
    if (!foundUser || foundUser.password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }
    
    foundUser.password = newPassword;
    return { success: true, message: 'Password changed successfully!' };
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString()
    };
    
    if (address.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(newAddress));
    } else {
      setAddresses(prev => [...prev, newAddress]);
    }
  };

  const updateAddress = (id: string, addressData: Partial<Address>) => {
    setAddresses(prev => prev.map(addr => {
      if (addr.id === id) {
        return { ...addr, ...addressData };
      }
      if (addressData.isDefault && addr.id !== id) {
        return { ...addr, isDefault: false };
      }
      return addr;
    }));
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => {
      const filtered = prev.filter(a => a.id !== id);
      if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <AuthContext.Provider value={{
      user,
      addresses,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      forgotPassword,
      updateProfile,
      changePassword,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
