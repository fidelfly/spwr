import React, { Suspense, lazy } from "react";
import { Spin } from "antd";
import { AuthComponent } from "../auth";
import { useLocation, Redirect } from "react-router-dom";

export * from "./Login";
export * from "./Logout";
export * from "./Registration";

const App = lazy(() => import("./app"));

export const AppPage: React.FC = () => {
    const location = useLocation();
    return (
        <Suspense fallback={<Spin />}>
            <AuthComponent fallback={<Redirect to={{ pathname: "/login", state: { from: location } }} />}>
                <App />
            </AuthComponent>
        </Suspense>
    );
};
