import { useState } from "react";

// UI
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";

// ICONS
import { GoInbox } from "react-icons/go";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";
import { LuSend } from "react-icons/lu";

export default function ContactForm() {
    // Update the page title
    document.title = `Nirlipta Yoga | Contact Us`;

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Form inputs validation
        if (!username) {
            toast.error("You must enter your name to continue");
            return;
        } else if (!email) {
            toast.error("You must enter your email to continue");
            return;
        } else if (!subject) {
            toast.error("You must enter your subject to continue");
            return;
        } else if (!message) {
            toast.error("You must enter your message to continue");
            return;
        }

        // Simulate sending an email
        setLoadingSubmit(true);
        setTimeout(() => {
            console.log({
                to: "nirliptayoga@gmail.com",
                from: email,
                subject,
                message,
            });
            toast.success("Message sent successfully!");
            setUsername("");
            setEmail("");
            setSubject("");
            setMessage("");
            setLoadingSubmit(false);
        }, 1500);
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 lg:py-24">
            <div className="grid gap-12 md:gap-16">
                {/* Page Title */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Get in Touch</h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-[700px]">
                        Have a question, comment, or concern about our services? We're here to help. Reach out, and we'll respond as soon as possible.
                    </p>
                </div>

                {/* Map and Contact Information */}
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Map */}
                    <div>
                        <iframe
                            title="Google Map"
                            src="https://maps.google.com/maps?q=Australia&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            className="w-full h-48 rounded-md border"
                            loading="lazy"
                        ></iframe>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Contact Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <GoInbox className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                <span>hello@nirlipta-yoga.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdOutlinePhoneInTalk className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                <span>+977 9813131313</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FiMapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                <span>Harmony Lane, 123 Calm Lane, Australia</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full-Width Contact Form */}
                <div className="w-full max-w-[60%] mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                    id="name"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    onChange={(e) => setSubject(e.target.value)}
                                    value={subject}
                                    id="subject"
                                    placeholder="Enter a subject"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                onChange={(e) => setMessage(e.target.value)}
                                value={message}
                                id="message"
                                placeholder="Enter your message"
                                className="min-h-[150px]"
                            />
                        </div>
                        <Button disabled={loadingSubmit} type="submit" className="w-full md:w-auto">
                            {loadingSubmit ? (
                                "Sending..."
                            ) : (
                                <span className="flex items-center">
                                    <p className="mr-2">Send</p> <LuSend size={16} />
                                </span>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
