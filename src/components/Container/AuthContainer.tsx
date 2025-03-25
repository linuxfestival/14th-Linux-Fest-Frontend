import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../core/auth/auth.thunk";
import { RootState } from "../../store.ts";
import { LoginResponse } from "../../core/auth/auth.dto.ts";
import { initializeUser, logout } from "../../core/auth/auth.slice.ts";

const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

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

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) return <p>Please log in</p>;

  return <>{children}</>;
};

export default AuthContainer;
