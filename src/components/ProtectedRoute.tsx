// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import type { JSX } from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    );

    // if (!isAuthenticated) {
    //     return <Navigate to="/login" replace />;
    // }

    return children;
}
