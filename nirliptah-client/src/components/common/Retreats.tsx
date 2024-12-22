import React, { useState } from "react";
import { dummyRetreats } from "../../backend/data/dummyRetreats";
import { Button } from "../ui/button";
import { FaLeaf } from "react-icons/fa";
import { LuVegan } from "react-icons/lu";
import { BiFoodTag } from "react-icons/bi";
import { PiBowlFoodFill } from "react-icons/pi";
import {Badge} from "@/components/ui/badge.tsx";

import { format,differenceInDays, parseISO } from "date-fns";






const Retreats: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = dummyRetreats.length;

    const currentRetreat = dummyRetreats[currentPage - 1]; // Page number maps to index

    const startDate = currentRetreat.dates[0]?.startDate;
    const endDate = currentRetreat.dates[0]?.endDate;

    // Format the dates
    const formattedStartDate = startDate ? format(parseISO(startDate), "dd.MM.yyyy") : "Unknown";
    const formattedEndDate = endDate ? format(parseISO(endDate), "dd.MM.yyyy") : "Unknown";

    // Calculate the difference in days
    const numberOfNights = startDate && endDate
        ? differenceInDays(parseISO(endDate), parseISO(startDate))
        : 0;


    // Pagination Logic
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="retreats-page max-w-screen-xl mx-auto flex flex-col items-center p-6 mb-16">
                {/* Header */}
                <div className="relative sm:mx-auto mx-3 pt-[10px] pb-[20px] text-center">
                    <div className="container">
                        <h1 className="sm:text-5xl text-4xl font-bold capitalize mb-6">Upcoming Retreats</h1>
                        <p className="text-gray-700 text-lg sm:w-[100%] mx-auto">
                            Dive into the transformative world of yoga with our retreats.
                        </p>
                    </div>
                </div>
            <div className="flex flex-wrap lg:flex-nowrap w-full gap-6">
                {/* Left Section */}
                <div className="left-section lg:w-3/5 flex flex-col sticky top-0 space-y-6 relative">



                    {/* Badge */}
                    <Badge
                        className="absolute z-10 text-white rounded-none mt-20 left-0 px-4 py-2"
                        style={{ backgroundColor: "#A38F85" }}
                    >
                        {startDate && endDate ? (
                            <>
                                <strong className="text-xl font-bold">{numberOfNights}</strong>{" "}
                                <span className="text-xs">Nights</span>{"/"}
                                <strong className="text-xl font-bold">{numberOfNights + 1}</strong>{" "}
                                <span className="text-xs">Days</span>
                            </>
                        ) : (
                            "Duration Not Available"
                        )}
                    </Badge>



                    {/* Dates Display */}
                    <div className="absolute z-10 text-white text-sm top-4 right-4 bg-opacity-50 bg-black px-4 py-2 rounded">
                        From: <strong>{formattedStartDate}</strong> to <strong>{formattedEndDate}</strong>
                    </div>

                    {/* Main Image */}
                    <div className="main-image w-full h-[600px] relative">
                        <img
                            src={currentRetreat.photos[1]}
                            alt={`${currentRetreat.title}`}
                            className="object-cover w-full h-full"
                        />
                        {/* Book Now Button */}
                        <div className="book-now-container absolute left-1/2 bottom-[5%] transform -translate-x-1/2 z-20">
                            <Button className="book-now-btn bg-[#9B6763] text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-[#7B4F4C] transition duration-300">
                                Book Now
                            </Button>
                        </div>



                        {/* Price and Actions Overlapping */}
                        <div className="price-and-actions absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 bg-gray-50 rounded-lg shadow-lg p-6 w-4/5 grid grid-cols-3 gap-4 text-center">
                            {/* Price (1st column) */}
                            <div className="price flex flex-col items-center">
                                <span className="font-semibold text-sm">Price</span>
                                <span className="text-gray-800 font-bold text-md">
                                    {currentRetreat.price === 0 ? "Free" : `AU$ ${currentRetreat.price}`}
                                </span>
                            </div>

                            {/* Single Rooms (2nd column) */}
                            <div className="single-rooms flex flex-col items-center mt-4">
                                <span className="font-semibold text-sm">Single Room</span>
                                <span className="text-gray-800 text-sm">
                                    {currentRetreat.SingleRoomsQuantity > 0 ? "Available" : "Fully Booked"}
                                </span>
                            </div>

                            {/* Seats Left (3rd column) */}
                            <div className="seats-left flex flex-col items-center">
                                <span className="font-semibold text-sm">Seats Left</span>
                                <span className="text-gray-800 text-sm">{currentRetreat.MaxParticipants}</span>
                            </div>
                        </div>


                        {/* Pagination Section */}
                        <div className="book-now-container absolute left-1/2 bottom-[-18%] transform -translate-x-1/2 z-20">                            {/* Page Text */}


                            {/* Pagination Controls */}
                            <div className="pagination-controls  px-4 py-2 flex items-center space-x-2">
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
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                            Page <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
                            <span className="font-semibold text-gray-900">{totalPages}</span>
                        </div>

                    </div>



                </div>


                {/* Right Section */}

                <div className="right-section lg:w-2/5 p-8 flex flex-col sticky top-0 justify-between">
                    {/* Retreat Details */}
                    <div className="retreat-details space-y-6">
                        <h3 className="retreat-title font-bold text-2xl text-gray-800">{currentRetreat.title}</h3>
                        <p className="retreat-description text-gray-600 text-base">{currentRetreat.description}</p>

                        {/* Organizer */}
                        <p className="text-gray-600 text-base">
                            <span className="font-semibold">Organizer:</span> {currentRetreat.organizer}
                        </p>

                        {/* Guests */}
                        <div className="guests mt-4">
                            <span className="font-semibold text-gray-800 text-lg">Guests:</span>
                            <ul className="flex flex-wrap gap-4 mt-2">
                                {currentRetreat.guests.map((guest, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <img
                                            src={guest.photo}
                                            alt={guest.name}
                                            className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
                                        />
                                        <span className="text-gray-600 text-sm">{guest.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>


                        {/* Featuring Events */}
                        <div className="featuring-events">
                            <span className="font-semibold text-gray-800">Featuring Events:</span>
                            <ul className="list-disc list-inside text-gray-600 text-sm mt-2">
                                {currentRetreat.featuringEvents.map((event, index) => (
                                    <li key={index}>{event}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Meal Options */}
                        <div className="meal-options">
                            <span className="font-semibold text-gray-800">Meal Options:</span>
                            <ul className="list-disc list-inside text-gray-600 text-sm mt-2">
                                {currentRetreat.MealOptions.map((option, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                        {option === "Vegetarian" ? (
                                            <FaLeaf className="text-green-500" />
                                        ) : option === "Vegan" ? (
                                            <LuVegan className="text-green-700" />
                                        ) : option === "Non-Vegetarian" ? (
                                            <BiFoodTag className="text-[#681E1A]" />
                                        )   : (
                                            <PiBowlFoodFill className="text-[#9B6763]" />
                                            )}
                                        <span>{option}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>


                        {/* Contact */}
                        <p className="contact text-gray-600 text-base flex">
                            <span className="font-semibold">Contact:</span> {currentRetreat.eventContactNumber}
                        </p>

                        {/* Social Link */}
                        <a
                            href={currentRetreat.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link text-sm text-[#9B6763] hover:underline flex mt-4"
                        >
                            Click for More Info!
                        </a>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Retreats;
