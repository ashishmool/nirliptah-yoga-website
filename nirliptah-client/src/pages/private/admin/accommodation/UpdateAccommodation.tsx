import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { updateAccommodation, fetchAccommodationById } from "../../../../backend/services/accommodationService"; // Import the update function from your service file

interface AccommodationFormData {
    name: string;
    description: string;
    price_per_night: number;
    location: string;
    max_occupancy: number;
    available_rooms: number;
    amenities: string; // Keep amenities as a string for easy handling in the form
    photo: File | null;
}

const UpdateAccommodation: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<AccommodationFormData>({
        name: "",
        description: "",
        price_per_night: 0,
        location: "",
        max_occupancy: 1,
        available_rooms: 0,
        amenities: "", // This should be a string for easy form handling
        photo: null,
    });
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchAccommodationById(id, setFormData, setImagePreview);
        }
    }, [id]);

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

        // Ensure amenities are stored as a string
        const amenitiesString = formData.amenities.trim().replace(/,\s+/g, ',');

        try {
            await updateAccommodation(id, {
                ...formData,
                amenities: amenitiesString,
            }, navigate);
            toast.success("Accommodation updated successfully!");
        } catch (error) {
            console.error("Error updating accommodation:", error);
            alert("Failed to update accommodation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => navigate(-1)} className="text-[#9B6763] hover:text-[#B8998C]">
                    &#8592; Back
                </button>
                <h1 className="text-3xl font-semibold">Update Accommodation</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Location Fields */}
                <div className="grid grid-cols-7 gap-4">
                    <div className="col-span-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name || ""}
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
                            value={formData.location || ""}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="price_per_night" className="block text-sm font-medium text-gray-700">Price Per Night</label>
                        <input
                            id="price_per_night"
                            name="price_per_night"
                            type="number"
                            value={formData.price_per_night || 0}
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
                            value={formData.max_occupancy || 1}
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
                            value={formData.available_rooms || 0}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">Amenities</label>
                        <input
                            id="amenities"
                            name="amenities"
                            type="text"
                            value={formData.amenities || ""}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
                        <input
                            id="photo"
                            name="photo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Accommodation Preview"
                                className="mt-2 w-32 h-32 object-cover rounded-md"
                            />
                        )}
                    </div>
                </div>
                {/* Submit button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 text-white bg-[#9B6763] rounded-md hover:bg-[#B8998C] disabled:bg-indigo-300"
                    >
                        {loading ? "Updating..." : "Update Accommodation"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateAccommodation;
