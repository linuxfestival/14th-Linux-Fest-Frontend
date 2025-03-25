import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoginResponse } from "../../core/auth/auth.dto.ts";
import { initializeUser, logout } from "../../core/auth/auth.slice.ts";
import Cookies from "js-cookie";

const AuthContainer = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const accessToken = Cookies.get("access_token");
        const refreshToken = Cookies.get("refresh_token");
        if (accessToken && refreshToken) {
            try {
                dispatch(initializeUser({
                    access: accessToken,
                    refresh: refreshToken
                }));
            } catch (error) {
                console.error("Failed to parse user data from localStorage");
                dispatch(logout());
            }
        }
    }, [dispatch]);

    return <>{children}</>;
};

export default AuthContainer;
