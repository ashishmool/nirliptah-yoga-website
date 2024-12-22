import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FaMapMarkerAlt, FaUserTie, FaRegClock } from "react-icons/fa"; // React Icons

interface Module {
    name: string;
    duration: number; // Duration in minutes
    _id: string;
}

interface Workshop {
    _id: string;
    title: string;
    description: string;
    difficulty_level: string;
    price: number;
    discountPrice?: number;
    classroom_info: string;
    address: string;
    map_location: string;
    photo: string;
    modules: Module[];
    instructor_id: string;
    category: string;
}

interface Category {
    _id: string;
    name: string;
    label: string;
}

const SingleWorkshop: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [workshop, setWorkshop] = useState<Workshop | null>(null);
    const [category, setCategory] = useState<Category | null>(null);

    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/workshops/${id}`);
                setWorkshop(response.data);
            } catch (error) {
                console.error("Error fetching workshop:", error);
                toast.error("Failed to fetch workshop details.");
            }
        };

        const fetchCategory = async (categoryId: string) => {
            try {
                const response = await axios.get(`http://localhost:5000/api/workshop-categories/${categoryId}`);
                setCategory(response.data);
            } catch (error) {
                console.error("Error fetching category:", error);
                toast.error("Failed to fetch category details.");
            }
        };

        if (id) {
            fetchWorkshop();
        }
    }, [id]);

    if (!workshop) {
        return <div>Loading...</div>;
    }

    const firstPhoto = workshop.photo ? `http://localhost:5000${workshop.photo}` : "/path/to/fallback-image.jpg";

    return (
        <div className="single-workshop-page flex flex-col sm:flex-row gap-8 mb-8 mt-24">
            {/* Left Image Section */}
            <div className="workshop-image w-full sm:w-2/5">
                <div className="relative w-full h-96 overflow-hidden">
                    <img
                        src={firstPhoto}
                        alt={workshop.title}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>

            {/* Right Details Section */}
            <div className="workshop-details w-full sm:w-3/5">
                <h2 className="text-3xl font-bold text-gray-800">{workshop.title}</h2>
                {category && (
                    <Badge className="mt-4 text-white rounded-none" style={{ backgroundColor: "#A38F85" }}>
                        {category.name}
                    </Badge>
                )}
                <p className="mt-4 text-gray-600 text-lg">{workshop.description}</p>
                <p className="mt-4 text-gray-500 text-sm">Difficulty Level: {workshop.difficulty_level}</p>

                {/* Classroom Info */}
                <p className="mt-4 text-gray-500 text-sm flex items-center">
                    <FaRegClock className="mr-2" />
                    Classroom Info: {workshop.classroom_info}
                </p>

                {/* Address */}
                <p className="mt-4 text-gray-500 text-sm flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    Address: {workshop.address}
                </p>

                {/* Modules List */}
                <div className="mt-6">
                    <h3 className="font-semibold text-lg text-gray-800">Modules:</h3>
                    <ul className="list-disc pl-6">
                        {workshop.modules.map((module, index) => (
                            <li key={module._id} className="mt-2 text-gray-600">
                                <span className="font-semibold">{module.name}</span> - {module.duration} mins
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Price Section */}
                <div className="price mt-6 flex items-center">
                    {workshop.discountPrice ? (
                        <>
                            <span className="original-price line-through text-gray-500 mr-2">Rs {workshop.price}</span>
                            <span className="discount-price font-bold" style={{ color: "#9B6763" }}>
                                Rs {workshop.discountPrice}
                            </span>
                        </>
                    ) : (
                        <span className="text-gray-800 font-bold text-lg"><strong>Price: </strong>AED ($) {workshop.price}</span>
                    )}
                </div>

                {/* Enroll Button */}
                <Button className="enroll-btn mt-6 bg-black text-white px-6 py-3">Enroll Now</Button>
            </div>
        </div>
    );
};

export default SingleWorkshop;
