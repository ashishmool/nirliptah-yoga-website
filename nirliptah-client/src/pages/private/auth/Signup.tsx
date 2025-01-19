import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// UI Components
import { Button } from "@/pages/components/ui/button.tsx";
import { Input } from "@/pages/components/ui/input.tsx";
import { Label } from "@/pages/components/ui/label.tsx";
import { toast } from "sonner";
import Loading from "@/pages/components/ui/loading.tsx";


type FormDataTypes = {
    email: string;
    medical_conditions: string;
};

export default function Signup({
                                   onClose,
                                   onSwitchToLogin,
                               }: {
    onClose: () => void;
    onSwitchToLogin: () => void;
}) {
    const schema = yup.object().shape({
        email: yup.string().email("Invalid email address").required("Email is required"),
        medical_conditions: yup.string(),
    });

    const {
        register,
        handleSubmit, // Ensure this is destructured
        formState: { errors },
        setValue,
        reset
    } = useForm<FormDataTypes>({
        resolver: yupResolver(schema),
    });

    const [loading, setLoading] = useState(false);
    const [noneApplicable, setNoneApplicable] = useState(false);
    const navigate = useNavigate();

    const toggleNoneApplicable = () => {
        const newValue = !noneApplicable;
        setNoneApplicable(newValue);
        setValue("medical_conditions", newValue ? "None" : "");
    };

    const handleDataSubmit = async (data: FormDataTypes) => {
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", {
                email: data.email.toLowerCase(),
                medical_conditions: data.medical_conditions || "None",
                role: "student",
            });

            if (response.status === 201) {
                toast.success("Account created successfully! Please verify email.");
                reset();
                onClose();
                toggleNoneApplicable();
                navigate("/"); // Redirect to homepage
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6">
            <form onSubmit={handleSubmit(handleDataSubmit)} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                    <Label htmlFor="email-signup" className="font-bold text-black text-[15px]">
                        Email Address
                    </Label>
                    <Input
                        id="email-signup" // Unique ID for the email input
                        type="email"
                        placeholder="hello@example.com"
                        {...register("email")}
                        aria-describedby={errors.email ? "emailError" : undefined}
                        disabled={loading}
                    />
                    {errors.email && (
                        <p id="emailError" className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                </div>

                {/* Medical Conditions Field */}
                <div className="space-y-2 mt-4">
                    <Label htmlFor="medical_conditions" className="font-bold text-black text-[15px]">
                        Medical Conditions
                    </Label>
                    <Input
                        id="medical_conditions"
                        type="text"
                        {...register("medical_conditions")}
                        placeholder="Diabetes, Uric Acid, etc."
                        disabled={noneApplicable || loading}
                    />
                    <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            checked={noneApplicable}
                            onChange={toggleNoneApplicable}
                            id="noneApplicable"
                            disabled={loading}
                        />
                        <Label htmlFor="noneApplicable" className="ml-2 text-sm">
                            Not Applicable
                        </Label>
                    </div>
                </div>

                {/* Signup Button */}
                <Button
                    type="submit"
                    className="w-full bg-[#9B6763] hover:bg-[#B8978C] mt-6"
                    disabled={loading}
                    aria-label="Signup Button"
                >
                    {loading ? <Loading w={24} /> : "Signup Now"}
                </Button>

                {/* Switch to Login Link */}
                <p className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <span
                        className="text-blue-900 hover:underline cursor-pointer"
                        onClick={onSwitchToLogin}
                    >
                    Login
                </span>
                </p>
            </form>
        </div>
    );

}
