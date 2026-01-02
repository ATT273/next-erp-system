"use client";
import { ISession, Permissions } from "@/types/auth.types";
import { createContext, useContext, useState } from "react";

interface IAuthContext {
  id?: string;
  email?: string;
  name?: string;
  permissions?: Permissions;
  setAuthSession: (value: ISession) => void;
}
const AuthContext = createContext<IAuthContext | null>(null);

const AuthProvider = ({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession?: ISession | null;
}) => {
  const [authSession, setAuthSession] = useState<ISession | undefined>(initialSession || undefined);
  return (
    <AuthContext.Provider
      value={{
        ...authSession,
        setAuthSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export default AuthProvider;
