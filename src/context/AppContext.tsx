import axios from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role: string;
}

interface AppContextType {
  backendUrl: string;
  isLoggedIn: boolean;
  checkAuth: () => Promise<void>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  authLoading: boolean;
  setAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider =({ children }: AppContextProviderProps) => {
    const backendUrl: string = import.meta.env.VITE_BACKEND_URL as string;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    const checkAuth =  async () => {
      try{
        axios.defaults.withCredentials = true;

        const {data} = await axios.post(backendUrl + "/api/auth/is-auth");
        if (data.isLoggedIn) {
          setUserData(data.userData);
          setIsLoggedIn(true);
        } else {
          setUserData(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log("Error during login:", error);
      } finally {
        setAuthLoading(false);
      }
    }

    useEffect(() => {
      checkAuth();
    },[])

    const value : AppContextType = {
        backendUrl,
        checkAuth,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        authLoading, setAuthLoading
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
