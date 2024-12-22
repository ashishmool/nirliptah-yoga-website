import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Loading from "../ui/loading";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import axios from "axios";

type ResetRequestModalProps = {
    onClose: () => void;
};

type FormDataTypes = {
    email: string;
};

export default function ResetRequestModal({ onClose }: ResetRequestModalProps) {
    const [loading, setLoading] = useState<boolean>(false);

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormDataTypes>();

    const handleResetPasswordRequest = async (data: FormDataTypes) => {
        setLoading(true);
        try {
            // Send POST request
            const response = await axios.post(
                "http://localhost:5000/api/auth/reset-password-request",
                { email: data.email },
                { validateStatus: (status) => status >= 200 && status < 500 } // Catch errors in this range
            );

            if (response.status >= 200 && response.status < 300) {
                // Success response
                toast.success(response.data.message || "Password reset email sent successfully.");
                setTimeout(() => {
                    if (typeof onClose === "function") {
                        onClose(); // Close modal if onClose is defined
                    } else {
                        console.error("onClose is not a function or undefined.");
                    }
                }, 1500);
            } else {
                // Server-side error
                toast.error(response.data.message || "Unexpected response from server.");
            }
        } catch (error: any) {
            // Network or unexpected error
            console.error("Error during request:", error);
            toast.error(
                error.response?.data?.message ||
                "Network error. Please check your connection and try again."
            );
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request Password Reset</DialogTitle>
                    <DialogDescription>
                        Enter your email address, and we'll send you instructions to reset your password.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleResetPasswordRequest)} className="mt-4 space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="font-bold text-black text-[15px]">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address",
                                },
                            })}
                            disabled={loading}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loading w={24} /> : "Send Reset Link"}
                    </Button>
                </form>

                <DialogClose className="absolute right-4 top-4">
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}

