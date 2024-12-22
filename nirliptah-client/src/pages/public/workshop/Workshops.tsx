import React, { useState, useEffect } from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Workshop {
    photos: string[];
    _id: string;
    title: string;
    categoryId: string;
    price: number;
    discount_price?: number;
    duration: string;
}

interface Category {
    _id: string;
    name: string;
    label: string;
}

interface Workshop {
    photos: string[];
    _id: string;
    title: string;
    categoryId: string;
    price: number;
    discount_price?: number;
    duration: string;
}

interface Category {
    _id: string;
    name: string;
    label: string;
}

const Workshops: React.FC = () => {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const coursesPerPage = 3;

    const navigate = useNavigate();
    const handleEnrollClick = (workshopId: string) => {
        navigate(`/workshops/${workshopId}`);
    };

    // Fetch workshops and categories from the backend
    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/workshops");
                setWorkshops(response.data);
            } catch (error) {
                console.error("Error fetching workshops:", error);
                toast.error("Failed to fetch workshops.");
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/workshop-categories");
                setCategories(response.data);
                console.log("Categories Fectched", response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to fetch categories.");
            }
        };

        fetchWorkshops();
        fetchCategories();
    }, []);

    console.log("Fetched Workshops::::", workshops);
    // console.log("Fetched Categories::::", categories);

    // Filter workshops based on selected category
    const filteredWorkshops = selectedCategoryId
        ? workshops.filter((workshop) => {
            // Log workshop categoryId and selectedCategoryId to debug
            console.log("Filtering workshops for categoryId:", selectedCategoryId, "Workshop's categoryId:", workshop.category._id);
            return workshop.category._id === selectedCategoryId;
        })
        : workshops;  // If no category is selected, show all workshops

    // Total number of pages based on filtered workshops
    const totalPages = Math.ceil(filteredWorkshops.length / coursesPerPage);

    // Get the current set of workshops to display
    const currentWorkshops = filteredWorkshops.slice(
        (currentPage - 1) * coursesPerPage,
        currentPage * coursesPerPage
    );

    const handleCategorySelection = (categoryId: string | null) => {
        setSelectedCategoryId(categoryId);  // This sets the selected category
        setCurrentPage(1);  // Reset to first page
    };




    // Pagination handlers
    const goToPage = (page: number) => setCurrentPage(page);
    const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    const getTotalDuration = (modules: { duration: number }[]) => {
        const totalMinutes = modules.reduce((acc, module) => acc + module.duration, 0);  // Sum up all the durations

        const hours = Math.floor(totalMinutes / 60);  // Get the whole hours
        const minutes = totalMinutes % 60;           // Get the remaining minutes

        return { hours, minutes };
    };



    return (
        <div className="online-courses-page flex flex-col sm:flex-row gap-8 mb-8 mt-10">
            {/* Sidebar */}
            <div className="sidebar p-6 rounded-lg w-full sm:w-1/4 relative mt-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Regular Workshops</h2>
                <p className="text-gray-600 mb-6">by Category</p>
                <ScrollArea className="w-full h-120">
                    <ul className="space-y-6">
                        {categories.map((category) => (
                            <li key={category._id} className="category">
                                <Link
                                    to="#"
                                    className={`flex items-center space-x-2 text-gray-700 hover:text-[#9B6763] transition-all ${
                                        selectedCategoryId === category._id ? "text-[#9B6763]" : ""
                                    }`}
                                    onClick={() => handleCategorySelection(category._id)}
                                >
                                    <span className="font-semibold">{category.name}</span>
                                </Link>
                            </li>
                        ))}


                        {/* Reset Filters */}
                        <li className="category">
                            <Link
                                to="#"
                                className="flex items-center space-x-2 text-[#9B6763] hover:text-gray-500 transition-all text-sm"
                                onClick={() => handleCategorySelection(null)}
                            >
                                <span className="font-semibold">Reset Filters</span>
                            </Link>
                        </li>
                    </ul>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </div>

            {/* Workshop List */}
            <div className="course-list w-full sm:w-3/4">
                {filteredWorkshops.length === 0 ? (
                    <p className="text-center text-lg text-gray-500">No workshops found</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentWorkshops.map((workshop) => (
                                <div key={workshop._id} className="course-card bg-white p-6 rounded-lg shadow-lg relative flex flex-col">
                                    <Badge className="absolute z-10 text-white rounded-none mt-0" style={{ backgroundColor: "#A38F85",                   // Keep it at the top of the container
                                        left: "50%",               // Position it horizontally at 50% of the container
                                        transform: "translateX(-50%)", }}>
                                        {(() => {
                                            const category = categories.find((cat) => cat._id === workshop.category._id);
                                            return category ? category.name : "Unknown";
                                        })()}
                                    </Badge>

                                    <div className="relative w-full h-52 overflow-hidden"> {/* Adjusted height and ensured overflow handling */}
                                        <Carousel className="w-full h-full">
                                            <CarouselContent>
                                                {workshop.photos && workshop.photos.length > 0 ? (
                                                    workshop.photos.slice(0, 3).map((photo, index) => (
                                                        <CarouselItem key={index} className="w-full h-full">
                                                            <img
                                                                src={`http://localhost:5000${photo}`}
                                                                alt={workshop.title}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </CarouselItem>
                                                    ))
                                                ) : (
                                                    <CarouselItem className="w-full h-full">
                                                        <img
                                                            src={`http://localhost:5000${workshop.photo}`}
                                                            alt={workshop.title}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </CarouselItem>
                                                )}
                                            </CarouselContent>
                                        </Carousel>
                                    </div>

                                    <h3 className="course-name font-semibold text-lg text-gray-800 mt-4">{workshop.title}</h3>
                                    {
                                        workshop.modules && workshop.modules.length > 0 ? (
                                            // Calculate total duration from modules
                                            (() => {
                                                const { hours, minutes } = getTotalDuration(workshop.modules);
                                                return (
                                                    <p className="course-duration text-gray-500 text-sm mt-2">
                                                        {hours} hours {minutes} minutes
                                                    </p>
                                                );
                                            })()
                                        ) : (
                                            <p className="course-duration text-gray-500 text-sm mt-2">
                                                Duration: {workshop.duration} minutes
                                            </p>
                                        )
                                    }
                                    <p className="price mt-4 flex items-center">
                                        {workshop.discount_price ? (
                                            <>
                                                <span className="original-price line-through text-gray-500 mr-2">Rs {workshop.price}</span>
                                                <span className="discount-price font-bold " style={{ color: "#9B6763" }}>Rs {workshop.discount_price}</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-800 font-bold">Rs {workshop.price}</span>
                                        )}
                                    </p>

                                    <Button
                                        className="enroll-btn mt-4 bg-black text-white px-4 py-2"
                                        onClick={() => handleEnrollClick(workshop._id)} // Trigger navigation programmatically
                                    >
                                        View Details
                                    </Button>

                                </div>

                            ))}
                        </div>

                        {/* Pagination Section */}
                        <div className="pagination-container mt-6">
                            <div className="pagination-controls flex justify-center space-x-2">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className={`text-sm ${
                                        currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-black hover:text-blue-600"
                                    }`}
                                >
                                    &lt;
                                </button>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToPage(index + 1)}
                                        className={`px-3 py-1 rounded-2xl text-sm ${
                                            currentPage === index + 1 ? "bg-black text-white font-bold" : "text-gray-500 hover:text-black"
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`text-sm ${
                                        currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-black hover:text-blue-600"
                                    }`}
                                >
                                    &gt;
                                </button>
                            </div>
                            <div className="text-sm text-gray-600 mt-2 text-center">
                                Page <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
                                <span className="font-semibold text-gray-900">{totalPages}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Workshops;
