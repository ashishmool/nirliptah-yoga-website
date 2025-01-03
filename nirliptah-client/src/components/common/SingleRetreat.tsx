import React from "react";
import { format, parseISO } from "date-fns";
import { FaLeaf } from "react-icons/fa";
import { LuVegan } from "react-icons/lu";
import { BiFoodTag } from "react-icons/bi";
import { PiBowlFoodFill } from "react-icons/pi";

interface SingleRetreatProps {
    retreat: any; // Replace `any` with a proper type or interface for the retreat
}

const SingleRetreat: React.FC<SingleRetreatProps> = ({ retreat }) => {
    const formattedStartDate = retreat.start_date
        ? format(parseISO(retreat.start_date), "dd.MM.yyyy")
        : "Unknown";
    const formattedEndDate = retreat.end_date
        ? format(parseISO(retreat.end_date), "dd.MM.yyyy")
        : "Unknown";

    return (
        <div className="single-retreat-page max-w-screen-xl mx-auto p-6">
            <h1 className="text-4xl font-bold text-center">{retreat.title}</h1>
            <div className="flex flex-wrap mt-6 gap-6">
                {/* Main Image */}
                <div className="w-full lg:w-2/5">
                    <img
                        src={`http://localhost:5000${retreat.photo || "fallback-image.png"}`}
                        alt={retreat.title}
                        className="w-full rounded-lg"
                    />
                </div>

                {/* Details */}
                <div className="w-full lg:w-3/5">
                    <p>{retreat.description}</p>
                    <p>
                        <strong>Organizer:</strong> {retreat.organizer}
                    </p>
                    <p>
                        <strong>Dates:</strong> {formattedStartDate} to {formattedEndDate}
                    </p>
                    <div>
                        <strong>Meal Options:</strong>
                        <ul className="mt-2">
                            {retreat.meals_info?.map((option: string, index: number) => (
                                <li key={index} className="flex items-center space-x-2">
                                    {option === "Vegetarian" ? (
                                        <FaLeaf className="text-green-500" />
                                    ) : option === "Vegan" ? (
                                        <LuVegan className="text-green-700" />
                                    ) : option === "Non-Vegetarian" ? (
                                        <BiFoodTag className="text-[#681E1A]" />
                                    ) : (
                                        <PiBowlFoodFill className="text-[#9B6763]" />
                                    )}
                                    <span>{option}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleRetreat;
