import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation hook
import axios from "axios";
import RetreatCard from "./RetreatCard.tsx";
import SingleRetreat from "./SingleRetreat.tsx";

const Retreats: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [retreats, setRetreats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRetreat, setSelectedRetreat] = useState<any>(null);

    const retreatsPerPage = 3;

    const location = useLocation(); // Get the current location

    useEffect(() => {
        const fetchRetreats = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/retreats");
                setRetreats(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching retreats:", error);
                setLoading(false);
            }
        };

        fetchRetreats();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (selectedRetreat) {
        return <SingleRetreat retreat={selectedRetreat} />;
    }

    // Calculate paginated retreats
    const indexOfLastRetreat = currentPage * retreatsPerPage;
    const indexOfFirstRetreat = indexOfLastRetreat - retreatsPerPage;
    const currentRetreats = retreats.slice(indexOfFirstRetreat, indexOfLastRetreat);
    const totalPages = Math.ceil(retreats.length / retreatsPerPage);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Determine dynamic margin-top based on location
    const dynamicMarginTop = location.pathname === "/retreats" ? "mt-32" : "mt-0";

    return (
        <div className={`retreats-page max-w-screen-xl mx-auto p-6 mb-16 ${dynamicMarginTop}`}>
            {/* Section Title */}
            <div className="space-y-4 text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Upcoming Retreats</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-[700px] mx-auto">
                    Find the perfect retreats for serenity and tranquility.
                </p>
            </div>


            {/* Retreat Cards */}
            <div className="flex flex-wrap justify-center gap-6">
                {currentRetreats.map((retreat, index) => (
                    <RetreatCard
                        key={index}
                        retreat={retreat}
                        onDetailsClick={() => setSelectedRetreat(retreat)}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
                <div className="btn-group space-x-2">
                    {/* Previous Button */}
                    <button
                        className={`px-4 py-2 border rounded ${
                            currentPage === 1
                                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                : "text-[#9B6763] border-[#9B6763] hover:bg-[#9B6763] hover:text-white"
                        } transition`}
                        disabled={currentPage === 1}
                        onClick={() => goToPage(currentPage - 1)}
                    >
                        Prev
                    </button>

                    {/* Page Buttons */}
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 border rounded ${
                                currentPage === index + 1
                                    ? "bg-[#A38F85] text-white border-[#A38F85]" // Active button style
                                    : "text-[#9B6763] border-[#9B6763] hover:bg-[#9B6763] hover:text-white"
                            } transition`}
                            onClick={() => goToPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    {/* Next Button */}
                    <button
                        className={`px-4 py-2 border rounded ${
                            currentPage === totalPages
                                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                : "text-[#9B6763] border-[#9B6763] hover:bg-[#9B6763] hover:text-white"
                        } transition`}
                        disabled={currentPage === totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Retreats;
