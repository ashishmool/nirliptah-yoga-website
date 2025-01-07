import React from "react";
import { Badge } from "@/pages/components/ui/badge.tsx";
import { Button } from "@/pages/components/ui/button.tsx";
import { format, parseISO, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";

interface RetreatCardProps {
    retreat: any; // Replace `any` with a proper type or interface for the retreat
}

const RetreatCard: React.FC<RetreatCardProps> = ({ retreat }) => {
    const navigate = useNavigate(); // Hook to navigate
    const startDate = retreat.start_date;
    const endDate = retreat.end_date;

    const formattedStartDate = startDate
        ? format(parseISO(startDate), "dd.MM.yyyy")
        : "Unknown";
    const formattedEndDate = endDate
        ? format(parseISO(endDate), "dd.MM.yyyy")
        : "Unknown";

    const numberOfNights = startDate && endDate
        ? differenceInDays(parseISO(endDate), parseISO(startDate))
        : 0;

    const handleDetailsClick = () => {
        navigate(`/retreats/${retreat._id}`);
    };

    return (
        <div className="retreat-card bg-white shadow-lg rounded-lg overflow-hidden w-full sm:w-80 md:w-96 h-[400px]">
            {/* Main Image */}
            <div className="relative">
                <img
                    src={`http://localhost:5000${retreat.photo || "fallback-image.png"}`}
                    alt={retreat.title}
                    className="w-full h-60 object-cover"
                />
                {/* Category Badge */}
                <Badge
                    className="absolute z-10 text-white rounded-none top-0"
                    style={{
                        backgroundColor: "#A38F85", // Custom background color
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    {numberOfNights} Nights / {numberOfNights + 1} Days
                </Badge>
                <div className="absolute inset-x-0 bottom-0 bg-opacity-75 bg-black text-white text-sm px-3 py-1 rounded mx-auto text-center">
                    {formattedStartDate} - {formattedEndDate}
                </div>
            </div>

            {/* Details */}
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">{retreat.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{retreat.description.slice(0, 100)}...</p>
                <div className="mt-4 flex justify-between items-center">
                    <Button
                        className="bg-[#9B6763] text-white py-2 px-6 rounded hover:bg-[#7B4F4C] transition"
                        onClick={handleDetailsClick}
                    >
                        View Details
                    </Button>
                    <span className="text-sm font-semibold text-gray-800">
                        {retreat.price_per_person === 0
                            ? "Free"
                            : `AU$ ${retreat.price_per_person || "TBD"}`}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RetreatCard;
