import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { createAccommodation } from "../../../../backend/services/accommodationService"; // Import the service

// Define the interface for the form data
interface AccommodationFormData {
    name: string;
    description: string;
    price_per_night: number;
    location: string;
    max_occupancy: number;
    available_rooms: number;
    amenities: string; // Comma-separated string for easier handling on change
    photo: File | null;
}

const AddAccommodation: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<AccommodationFormData>({
        name: "",
        description: "",
        price_per_night: 0,
        location: "",
        max_occupancy: 1,
        available_rooms: 0,
        amenities: "",
        photo: null,
    });

    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, photo: file });
            setImagePreview(URL.createObjectURL(file)); // Set the preview URL
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Split amenities into an array if it's not empty
        const amenitiesArray = formData.amenities.trim()
            ? formData.amenities.split(',').map((item) => item.trim())
            : [];

        const formDataObj = new FormData();
        formDataObj.append("name", formData.name);
        formDataObj.append("description", formData.description);
        formDataObj.append("price_per_night", formData.price_per_night.toString());
        formDataObj.append("max_occupancy", formData.max_occupancy.toString());
        formDataObj.append("available_rooms", formData.available_rooms.toString());
        formDataObj.append("location", formData.location); // Ensure location is added
        formDataObj.append("amenities", JSON.stringify(amenitiesArray));  // Send amenities as a JSON array

        // Change this line to match the backend field name for accommodation photo
        if (formData.photo) {
            formDataObj.append("accommodation_photo", formData.photo);
        }

        try {
            // Call the createAccommodation function from the service
            await createAccommodation(formDataObj);
            toast.success("Accommodation added successfully!");
            navigate("/admin/accommodations");
        } catch (error) {
            console.error("Error adding accommodation:", error);
            toast.error("Failed to add accommodation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-[#9B6763] hover:text-[#B8998C]"
                >
                    &#8592; Back
                </button>
                <h1 className="text-3xl font-semibold">Add Accommodation</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Location (3:1 ratio) */}
                <div className="grid grid-cols-7 gap-4">
                    <div className="col-span-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div className="col-span-3">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Price, Max Occupancy, Available Rooms (Same row) */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="price_per_night" className="block text-sm font-medium text-gray-700">Price Per Night</label>
                        <input
                            id="price_per_night"
                            name="price_per_night"
                            type="number"
                            value={formData.price_per_night}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="max_occupancy" className="block text-sm font-medium text-gray-700">Max Occupancy</label>
                        <input
                            id="max_occupancy"
                            name="max_occupancy"
                            type="number"
                            value={formData.max_occupancy}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="available_rooms" className="block text-sm font-medium text-gray-700">Available Rooms</label>
                        <input
                            id="available_rooms"
                            name="available_rooms"
                            type="number"
                            value={formData.available_rooms}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                </div>

                {/* Amenities and Photo (1:2 ratio) */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">Amenities</label>
                        <input
                            id="amenities"
                            name="amenities"
                            type="text"
                            value={formData.amenities}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter amenities (comma separated)"
                        />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
                        <input
                            id="photo"
                            name="photo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500">Image Preview:</p>
                                <img
                                    src={imagePreview}
                                    alt="Selected Preview"
                                    className="w-full h-60 object-cover border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 mt-4 text-white bg-[#9B6763] rounded-md hover:bg-[#B8998C] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {loading ? "Saving..." : "Save Accommodation"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAccommodation;
