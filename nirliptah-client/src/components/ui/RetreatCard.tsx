import React from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "../ui/button";
import { format, parseISO, differenceInDays } from "date-fns";

interface RetreatCardProps {
    retreat: any; // Replace `any` with a proper type or interface for the retreat
    onDetailsClick: () => void;
}

const RetreatCard: React.FC<RetreatCardProps> = ({ retreat, onDetailsClick }) => {
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

    return (
        <div className="retreat-card bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Main Image */}
            <div className="relative">
                <img
                    src={`http://localhost:5000${retreat.photo || "fallback-image.png"}`}
                    alt={retreat.title}
                    className="w-full h-60 object-cover"
                />
                <Badge
                    className="absolute top-4 left-4 bg-opacity-75 bg-gray-800 text-white px-3 py-1 text-sm"
                >
                    {numberOfNights} Nights / {numberOfNights + 1} Days
                </Badge>
                <div className="absolute bottom-4 left-4 bg-opacity-75 bg-black text-white px-3 py-1 rounded">
                    From: {formattedStartDate} to {formattedEndDate}
                </div>
            </div>

            {/* Details */}
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">{retreat.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{retreat.description.slice(0, 100)}...</p>
                <div className="mt-4 flex justify-between items-center">
                    <Button
                        className="bg-[#9B6763] text-white py-2 px-6 rounded hover:bg-[#7B4F4C] transition"
                        onClick={onDetailsClick}
                    >
                        View Details
                    </Button>
                    <span className="text-sm font-semibold text-gray-800">
            {retreat.price_per_person === 0 ? "Free" : `AU$ ${retreat.price_per_person || "TBD"}`}
          </span>
                </div>
            </div>
        </div>
    );
};

export default RetreatCard;
