import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WorkshopCard from "@/pages/public/workshop/WorkshopCard.tsx";
import { Badge } from "@/pages/components/ui/badge";
import { Button } from "@/pages/components/ui/button";
import { RxCross2 } from 'react-icons/rx';  // Import the cross icon


const Workshops: React.FC = () => {
    const [workshops, setWorkshops] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const workshopsPerPage = 3;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/workshops");
                setWorkshops(response.data);
            } catch (error) {
                console.error("Error fetching workshops:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/workshop-categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchWorkshops();
        fetchCategories();
    }, []);

    const filteredWorkshops = selectedCategoryIds.length
        ? workshops.filter((workshop) => selectedCategoryIds.includes(workshop.category._id))
        : workshops;

    const totalPages = Math.ceil(filteredWorkshops.length / workshopsPerPage);
    const currentWorkshops = filteredWorkshops.slice(
        (currentPage - 1) * workshopsPerPage,
        currentPage * workshopsPerPage
    );

    const handleCategorySelection = (categoryId: string) => {
        setSelectedCategoryIds((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
        );
        setCurrentPage(1);
    };


    // Pagination handlers
    const goToPage = (page: number) => setCurrentPage(page);
    const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    // Determine dynamic margin-top based on location
    const dynamicMarginTop = location.pathname === "/workshops" ? "mt-32" : "mt-0";

    return (
        <div className={`workshops-page max-w-screen-xl mx-auto p-6 mb-16 ${dynamicMarginTop}`}>
            {/* Section Title */}
            <div className="space-y-4 text-center mb-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Workshops</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-[700px] mx-auto">
                    Join our regular workshops to grow and learn!
                </p>
            </div>

            {/* Top Bar for Category Filtering */}
            {/* Top Bar for Category Filtering */}
            <div className="top-bar p-6 w-full mt-4 flex flex-col sm:flex-row justify-between items-center bg-transparent rounded-lg mb-4">
                <div className="categories-container flex flex-wrap gap-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Workshops Categories</h2>
                    {categories.map((category) => (
                        <button
                            key={category._id}
                            className={`btn btn-sm ${
                                selectedCategoryIds.includes(category._id)
                                    ? 'bg-black text-white hover:bg-black'
                                    : 'bg-white text-black border hover:bg-black hover:text-white'
                            } mr-2 rounded relative`}  // Added relative positioning for the button
                            onClick={() => handleCategorySelection(category._id)}
                        >
                            {category.name}
                            {selectedCategoryIds.includes(category._id) && (
                                <span
                                    className="absolute top-0 right-0 flex justify-center items-center w-6 h-6 bg-transparent text-black rounded-full border border-black -mr-2 -mt-2 cursor-pointer"  // Positioning the cross icon outside the button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent button's onClick when clicking on the cross icon
                                        handleCategorySelection(category._id);
                                    }}
                                >
                        <RxCross2 size={16} />
                    </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>


            {/* Workshop Cards */}
            <div className="flex flex-wrap justify-center gap-6">

                {currentWorkshops.length === 0 ? (
                    <p className="text-center text-lg text-gray-500">No workshops available</p>
                ) : (
                    currentWorkshops.map((workshop) => (
                        <WorkshopCard
                            key={workshop._id}
                            workshop={workshop}
                            categories={categories} // Pass categories here
                        />
                    ))
                )}
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

export default Workshops;
