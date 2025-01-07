import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { FaLeaf } from "react-icons/fa";
import { LuVegan } from "react-icons/lu";
import { BiFoodTag } from "react-icons/bi";
import { PiBowlFoodFill } from "react-icons/pi";
import { useParams } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai"; // Icon for number of persons

interface SingleRetreatProps {
    retreat: any;
}

const SingleRetreat: React.FC<SingleRetreatProps> = ({ retreat }) => {
    const [numPersons, setNumPersons] = useState(1); // Default to 1 person

    const formattedStartDate = retreat.start_date
        ? format(parseISO(retreat.start_date), "dd.MM.yyyy")
        : "Unknown";
    const formattedEndDate = retreat.end_date
        ? format(parseISO(retreat.end_date), "dd.MM.yyyy")
        : "Unknown";

    // Accommodation options display
    const accommodationOptions = retreat.accommodation_id ? (
        <div>
            <strong className="font-semibold">Accommodation Options:</strong>
            <div className="mt-2">
                <select
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setNumPersons(parseInt(e.target.value))}
                    value={numPersons}
                >
                    {[...Array(retreat.max_participants || 10)].map((_, index) => (
                        <option key={index} value={index + 1}>
                            {index + 1} Person{index + 1 > 1 ? 's' : ''}
                        </option>
                    ))}
                </select>
            </div>
            <p className="mt-2">
                <strong>Accommodation details:</strong> {retreat.accommodation_id?.details || "Not available"}
            </p>
        </div>
    ) : (
        <p>No accommodation options available.</p>
    );

    return (
        <div className="single-retreat-page max-w-screen-xl mx-auto p-6">

            <div className="flex flex-wrap mt-24 gap-6"> {/* Changed mt-6 to mt-48 */}

                {/* Main Image */}
                <div className="w-full lg:w-2/5">
                    <img
                        src={`http://localhost:5000${retreat.photo || "/fallback-image.png"}`}
                        alt={retreat.title}
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>
                <h1 className="text-4xl font-bold text-center mb-6">{retreat.title}</h1>
                {/* Details */}
                <div className="w-full lg:w-3/5">
                    <p className="text-lg mb-4">{retreat.description}</p>
                    <p className="mb-2">
                        <strong className="font-semibold">Organizer:</strong> {retreat.organizer}
                    </p>
                    <p className="mb-4">
                        <strong className="font-semibold">Dates:</strong> {formattedStartDate} to {formattedEndDate}
                    </p>

                    {/* Meal Options */}
                    <div>
                        <strong className="font-semibold">Meal Options:</strong>
                        <ul className="mt-2 list-inside">
                            {retreat.meals_info?.map((option: string, index: number) => (
                                <li key={index} className="flex items-center space-x-2 mb-2">
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

                    {/* Accommodation */}
                    {accommodationOptions}
                </div>
            </div>
        </div>
    );
};


const SingleRetreatContainer: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get the retreat id from the URL
    const [retreat, setRetreat] = useState<any>(null); // Replace 'any' with a specific type for your retreat data

    useEffect(() => {
        // Fetch the retreat data using the id from the URL
        const fetchRetreat = async () => {
            const response = await fetch(`http://localhost:5000/api/retreats/${id}`);
            const data = await response.json();
            setRetreat(data);
        };

        if (id) {
            fetchRetreat();
        }
    }, [id]);

    if (!retreat) {
        return <div>Loading...</div>;
    }

    return <SingleRetreat retreat={retreat} />;
};

export default SingleRetreatContainer;
