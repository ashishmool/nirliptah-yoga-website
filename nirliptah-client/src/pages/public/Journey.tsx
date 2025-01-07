import React, { useContext, useState, useEffect, useMemo } from "react";
import fotoJourney from "../../assets/journey.jpg";
import Signup from "@/pages/private/auth/Signup.tsx";
import Login from "@/pages/private/auth/Login.tsx";
import { UserInfoContext } from "@/context/UserInfoContext.tsx";
import { AuthContext } from "@/context/AuthContext.tsx";
import axios from "axios";
import {toast} from "sonner";

const API_BASE_URL_RETREATS = "http://localhost:5000/api/retreats";  // Your retreats API URL
const API_BASE_URL_WORKSHOPS = "http://localhost:5000/api/workshops"; // Your workshops API URL

const Journey: React.FC = () => {
    const { isLoggedIn } = useContext(UserInfoContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { info, setInfo } = useContext(AuthContext);

    const [retreats, setRetreats] = useState<any[]>([]);
    const [workshops, setWorkshops] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    // Fetch Users
    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/users");
            const studentList = response.data.filter(user => user.role === "student");
            setUsers(studentList);
        } catch (error) {
            console.error("Error fetching students", error);
            toast.error("Failed to fetch students.");
        }
    };

    // Fetch retreats
    const fetchRetreats = async () => {
        try {
            const response = await axios.get(API_BASE_URL_RETREATS);
            const data = response.data || [];
            setRetreats(data);
        } catch (error) {
            console.error("Error fetching retreats:", error);
        }
    };

    // Fetch workshops
    const fetchWorkshops = async () => {
        try {
            const response = await axios.get(API_BASE_URL_WORKSHOPS);
            setWorkshops(response.data);
        } catch (error) {
            console.error("Error fetching workshops:", error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchRetreats();
        fetchWorkshops();
        fetchStudents();
    }, []);

    // Conditional button to show Signup if info.email and info.role are valid
    const authButton = useMemo(() => {
        if (!info?.email && !info?.role) {
            return <Signup />;
        }
        return null; // Return nothing if info is not valid
    }, [info]);

    // Dynamic cards based on fetched data
    const cards = [
        {
            title: "Community Members",
            quantity: users.length, // Remove admin
            bgColor: "bg-[#B8978C]",
            textColor: "text-white",
        },
        {
            title: "Workshops",
            quantity: workshops.length, // Dynamically showing the number of workshops
            bgColor: "bg-[#9B6763]",
            textColor: "text-white",
        },
        {
            title: "Retreats",
            quantity: retreats.length, // Dynamically showing the number of retreats
            bgColor: "bg-[#A38F85]",
            textColor: "text-white",
        },
    ];

    return (
        <section className="flex flex-col md:flex-row items-center justify-between mx-auto max-w-5xl px-4 py-20">
            {/* Text Section */}
            <div className="max-w-lg text-center md:text-left">
                <h1 className="text-4xl font-light mb-4 relative">
                    Start Your Yoga Journey
                </h1>
                <p className="mb-6 text-gray-700">
                    Whether you're a beginner or experienced, we offer personalized
                    classes, expert guidance, and a supportive community. ✨🧘‍♀️️
                </p>

                {/* Statistics */}
                <ul className="flex flex-wrap justify-center md:justify-start gap-4 mt-8 mb-4">
                    {cards.map((card) => (
                        <li
                            key={card.title}
                            className={`flex flex-col items-center justify-center w-32 h-32 rounded-md text-center ${card.bgColor} ${card.textColor}`}
                        >
                            <p className="text-2xl font-bold">{card.quantity}</p>
                            <p>{card.title}</p>
                        </li>
                    ))}
                </ul>

                {/* Conditional Auth Button */}
                {authButton}

                {/* Login Modal */}
                {showLoginModal && (
                    <Login onClose={() => setShowLoginModal(false)} />
                )}
            </div>

            {/* Image Section */}
            <div className="relative w-full max-w-md mt-10 md:mt-0">
                <div className="absolute -top-6 left-0 text-xs opacity-70">
                    <span className="block">
                        <strong>Photo: Nivedita Pradhan | </strong>20.10.2024
                    </span>
                </div>
                <div className="relative">
                    <div className="absolute top-16 -left-2 w-12 h-40 bg-gray-300 rounded-tr-[4rem]"></div>
                    <div className="absolute bottom-0 -right-2 w-12 h-40 bg-gray-300 rounded-bl-[4rem]"></div>
                    <img
                        src={fotoJourney}
                        alt="Nirlipta"
                        className="relative z-10 w-full h-auto rounded-tr-[4rem] object-cover"
                    />
                </div>
            </div>
        </section>
    );
};

export default Journey;
