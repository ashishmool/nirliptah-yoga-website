import { Button } from "@/components/ui/button";
import Signup from "./Signup";
import Login from "./Login";
import useJoinFormType from "@/lib/states/joinFormType";
import useErrorAlert from "@/lib/states/errorAlert";
import useSignupData from "@/lib/states/signupData";
import { useUserInfo } from "@/context/UserInfoContext";

export default function Auth() {
    const { setEmail, setPassword, setUsername } = useSignupData();
    const { formType, setFormType } = useJoinFormType();
    const { showSignupAlert, setShowSignupAlert } = useErrorAlert();
    const { setIsLoggedIn } = useUserInfo();

    const login = () => {
        setFormType("login");
        setShowSignupAlert(false);
    };

    const signup = () => {
        setFormType("signup");
        setShowSignupAlert(false);
        setEmail("");
        setPassword("");
        setUsername("");
    };

    return (
        <div className="flex flex-col w-full">
            <header className="mx-auto max-w-md space-y-3 border-b pb-2">
                <h1 className="text-lg font-bold mb-3 text-center">Welcome to Nirlipta Yoga</h1>
            </header>

            {formType === "signup" ? <Signup /> : <Login onLoginSuccess={() => setIsLoggedIn(true)} />}

            <div className="text-center space-y-2 mt-4">
                {formType === "signup" ? (
                    <p className="text-sm">
                        Already have an account?{" "}
                        <Button variant="link" onClick={login}>
                            Login now!
                        </Button>
                    </p>
                ) : (
                    <p className="text-sm">
                        Don’t have an account?{" "}
                        <Button variant="link" onClick={signup}>
                            Sign Up Now!
                        </Button>
                    </p>
                )}
            </div>
        </div>
    );
}
