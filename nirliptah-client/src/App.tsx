import { useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";

// SVG Background
import BackgroundSvg from "@/assets/bg.svg";

// SERVICES
import { checkSession } from "@/backend/services/auth/checkSession";

// CONTEXT
import { AuthProvider } from "@/context/AuthContext.tsx";

// UI
import { Footer } from "@/pages/components";
import { LoadingScreen } from "@/pages/components/ui/loading";
import { Toaster } from "sonner";

// Components
import MainNav from "@/pages/public/MainNav.tsx";
import Routing from "./Routing";
import FloatingAction from "@/pages/components/FloatingAction.tsx";

export default function App() {
    const [activeLoadingScreen, setActiveLoadingScreen] = useState<boolean>(true);

    useEffect(() => {
        const validateSession = async () => {
            try {
                await checkSession();
            } catch (error) {
                console.error("Error validating session:", error);
            } finally {
                setActiveLoadingScreen(false);
            }
        };

        validateSession();
    }, []);

    useEffect(() => {
        // Apply saved theme on load
        const savedTheme = localStorage.getItem("theme") || "light";
        document.documentElement.setAttribute("data-theme", savedTheme);

        // Attach theme change listener
        const themeToggle = document.querySelector(".theme-controller");
        themeToggle?.addEventListener("change", (e) => {
            const theme = (e.target as HTMLInputElement).value;
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
        });
    }, []);

    const Layout = () => {
        const location = useLocation();

        // Check if the current route starts with "/admin"
        const isAdminRoute = location.pathname.startsWith("/admin");

        return (
            <>
                <Routing />
                {!isAdminRoute && <MainNav />}
                {!isAdminRoute && <Footer />}
            </>
        );
    };

    return (
        <AuthProvider>
            <div
                style={{
                    backgroundImage: `url(${BackgroundSvg})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundAttachment: "fixed",
                    backgroundPosition: "center",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {activeLoadingScreen ? (
                    <LoadingScreen />
                ) : (
                    <BrowserRouter>
                        <Toaster richColors />
                        <Layout />
                        <FloatingAction />
                    </BrowserRouter>
                )}
            </div>
        </AuthProvider>
    );
}
