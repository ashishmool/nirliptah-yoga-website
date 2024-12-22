import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import {useNavigate} from "react-router-dom";

type FormDataTypes = {
    email: string;
};

export default function ResetRequest() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const { handleSubmit, register, formState: { errors } } = useForm<FormDataTypes>();

    const handleResetPasswordRequest = async (data: FormDataTypes) => {
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/auth/reset-password-request", {
                email: data.email,
            });

            if (response.status === 200) {
                toast.success("Password reset email sent.");
                setTimeout(() => navigate("/"), 2000); // Redirect to home after success

            }
        } catch (error) {
            toast.error("Error sending password reset email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md space-y-6 h-[500px] mb-24 flex flex-col justify-center px-4">
            <h1 className="text-2xl font-bold">Request Password Reset</h1>
            <form onSubmit={handleSubmit(handleResetPasswordRequest)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="text-black"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email address"
                            }
                        })}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <Button type="submit" className="w-full">
                    {loading ? "Loading..." : "Send Reset Link"}
                </Button>
            </form>
        </div>
    );
}
