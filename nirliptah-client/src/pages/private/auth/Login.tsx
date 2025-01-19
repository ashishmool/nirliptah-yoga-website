import { useContext, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/pages/components/ui/button.tsx";
import { Input } from "@/pages/components/ui/input.tsx";
import { Label } from "@/pages/components/ui/label.tsx";
import Loading from "@/pages/components/ui/loading.tsx";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/pages/components/ui/dialog.tsx";
import Signup from "@/pages/private/auth/Signup.tsx";
import ResetRequest from "@/pages/private/auth/ResetRequest.tsx";
import { UserInfoContext } from "@/context/UserInfoContext.tsx";
import { AuthContext } from "@/context/AuthContext.tsx";

type LoginRegisterModalProps = {
    onClose: () => void;
    onLoginSuccess?: () => void;
};

export default function Login({ onClose, onLoginSuccess }: LoginRegisterModalProps) {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [isResetPassword, setIsResetPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const { setIsLoggedIn } = useContext(UserInfoContext);
    const { setInfo } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Email and Password are required");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email: email.toLowerCase(),
                password,
            });

            const { token, user_id, email: userEmail, role, photo } = response.data;

            // Save credentials to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user_id", user_id);
            localStorage.setItem("email", userEmail);
            localStorage.setItem("role", role);
            localStorage.setItem("photo", photo);

            // Update AuthContext
            setInfo({ email: userEmail, role, user_id, photo });

            toast.success("Login successful!");

            // Update login state
            setIsLoggedIn(true);

            // Optional success callback
            onLoginSuccess?.();

            // Redirect based on role
            const roleRedirects: Record<string, string> = {
                admin: "/admin/home",
            };

            // Check if role exists in roleRedirects and redirect, else do nothing
            if (role === "admin" && roleRedirects[role]) {
                window.location.href = roleRedirects[role];
            }
            onClose();
        } catch (error) {
            const errorMessage =
                (error as AxiosError)?.response?.data?.message || "Unable to login. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isResetPassword ? "Reset Password" : "Login"}</DialogTitle>
                    <DialogDescription>
                        {isResetPassword
                            ? "Enter your email to reset your password."
                            : "Enter your credentials to access your account."}
                    </DialogDescription>
                </DialogHeader>

                {isResetPassword ? (
                    <ResetRequest onClose={onClose} />
                ) : isLogin ? (
                    <div className="mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="login-email" className="font-bold text-black text-[15px]">
                                Email Address
                            </Label>
                            <Input
                                id="login-email" // Make sure the ID is unique
                                type="email"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div className="mt-4 space-y-2">
                            <Label htmlFor="password" className="font-bold text-black text-[15px]">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <p className="mt-2 text-center text-sm">
                            Having trouble logging in?{" "}
                            <span
                                className="text-blue-900 hover:underline cursor-pointer"
                                onClick={() => setIsResetPassword(true)}
                            >
                        Reset it
                    </span>
                        </p>

                        <Button
                            className="w-full mt-4"
                            disabled={loading || email.length < 3 || password.length < 8}
                            onClick={handleLogin}
                        >
                            {loading ? <Loading w={24} /> : "Log In"}
                        </Button>

                        <p className="mt-4 text-center text-sm">
                            Don't have an account?{" "}
                            <span
                                className="text-blue-900 hover:underline cursor-pointer"
                                onClick={() => setIsLogin(false)}
                            >
                        Register
                    </span>
                        </p>
                    </div>
                ) : (
                    <Signup onClose={onClose} onSwitchToLogin={() => setIsLogin(true)} />
                )}

                <DialogClose className="absolute right-4 top-4">
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogContent>
        </Dialog>

    );
}
