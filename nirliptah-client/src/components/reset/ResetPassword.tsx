import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "../ui/loading";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

type FormDataTypes = {
    newPassword: string;
    confirmPassword: string;
};

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get("token");

    const [loading, setLoading] = useState<boolean>(false);

    // Validation schema
    const schema = yup.object().shape({
        newPassword: yup.string().min(6).required("Password must be at least 6 characters."),
        confirmPassword: yup.string().oneOf([yup.ref("newPassword"), null], "Passwords must match").required("Confirm password is required."),
    });

    const { handleSubmit, formState: { errors }, register } = useForm<FormDataTypes>({
        resolver: yupResolver(schema),
    });

    const handleResetPasswordSubmit = async (data: FormDataTypes) => {
        setLoading(true);

        try {
            // Ensure the token exists before submitting the request
            if (!token) {
                toast.error("Invalid or expired reset token.");
                return;
            }

            const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
                token: token,
                newPassword: data.newPassword,
            });

            if (response.status === 200) {
                toast.success("Password reset successful.");
                setTimeout(() => navigate("/"), 2000); // Redirect to home after success
            }
        } catch (error) {
            // Handle token validation errors
            if (error.response && error.response.status === 400) {
                toast.error("Invalid or expired reset token.");
            } else {
                toast.error("Failed to reset password.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md space-y-6 h-[500px] mb-24 flex flex-col justify-center px-4">
            <h1 className="text-2xl font-bold">Reset Your Password</h1>
            <form onSubmit={handleSubmit(handleResetPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter your new password"
                        className="text-black"
                        {...register("newPassword")}
                    />
                    {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your new password"
                        className="text-black"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" className="w-full">
                    {loading ? <Loading w={24} /> : "Reset Password"}
                </Button>
            </form>
        </div>
    );
}
