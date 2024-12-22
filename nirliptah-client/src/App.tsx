import { useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";

// SVG Background
import BackgroundSvg from "@/assets/bg.svg";

// SERVICES
import { checkSession } from "@/backend/services/auth/checkSession";

// CONTEXT
import { UserInfoProvider } from "@/context/UserInfoContext";

// UI
import { Footer, Navbar } from "@/components";
import { LoadingScreen } from "@/components/ui/loading";
import { Toaster } from "sonner";

// Components
import MainNav from "@/components/common/MainNav";
import Routing from "./Routing";
import { AuthProvider } from "@/context/AuthContext.tsx";

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

    const Layout = () => {
        const location = useLocation();

        // Check if the current route starts with "/admin"
        const isAdminRoute = location.pathname.startsWith("/admin");

        return (
            <>
                <Routing />
                {/* Conditionally render Navbar or MainNav */}
                {isAdminRoute ? <Navbar /> : <MainNav />}
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
                    </BrowserRouter>
                )}
            </div>
        </AuthProvider>
    );
}
