import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginResponse } from "../../core/auth/auth.dto.ts";
import { initializeUser, logout } from "../../core/auth/auth.slice.ts";

const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("usah");
    if (storedUser) {
      try {
        const userData: LoginResponse = JSON.parse(storedUser);
        dispatch(initializeUser(userData));
      } catch (error) {
        console.error("Failed to parse user data from localStorage");
        dispatch(logout());
        localStorage.removeItem("usah");
      }
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthContainer;
