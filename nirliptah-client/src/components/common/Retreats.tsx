import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import RetreatCard from "../ui/RetreatCard";
import SingleRetreat from "./SingleRetreat";

const Retreats: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [retreats, setRetreats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRetreat, setSelectedRetreat] = useState<any>(null);

    const retreatsPerPage = 3;

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

    return (
        <div className="retreats-page max-w-screen-xl mx-auto p-6 mb-16">
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
                    <button
                        className="btn px-4 py-2"
                        disabled={currentPage === 1}
                        onClick={() => goToPage(currentPage - 1)}
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`btn px-4 py-2 ${currentPage === index + 1 ? "btn-active" : ""}`}
                            onClick={() => goToPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className="btn px-4 py-2"
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
