import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createAccommodation } from "../../../../backend/services/accommodationService"; // Accommodation service
import {
    createRoomAndUpdateAccommodation
} from "../../../../backend/services/roomService.ts"; // Room service

const AddAccommodation: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        amenities: "",
        photo: null as File | null,
    });

    const [rooms, setRooms] = useState([
        { room_type: "", max_occupancy: 1, price: 0, quantity: 1, photo: null as File | null },
    ]);

    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [roomPreviews, setRoomPreviews] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, photo: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRoomFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const updatedRooms = [...rooms];
            updatedRooms[index].photo = e.target.files[0];
            setRooms(updatedRooms);

            const updatedPreviews = [...roomPreviews];
            updatedPreviews[index] = URL.createObjectURL(e.target.files[0]);
            setRoomPreviews(updatedPreviews);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRoomChange = (
        index: number,
        field: string,
        value: string | number
    ) => {
        const updatedRooms = [...rooms];
        updatedRooms[index] = { ...updatedRooms[index], [field]: value };
        setRooms(updatedRooms);
    };

    const addRoom = () => {
        setRooms([...rooms, { room_type: "", max_occupancy: 1, price: 0, quantity: 1, photo: null }]);
        setRoomPreviews([...roomPreviews, ""]);
    };

    const removeRoom = (index: number) => {
        const updatedRooms = rooms.filter((_, i) => i !== index);
        setRooms(updatedRooms);

        const updatedPreviews = roomPreviews.filter((_, i) => i !== index);
        setRoomPreviews(updatedPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rooms.length === 0 || rooms.some((room) => !room.room_type)) {
            toast.error("At least one valid room type is required.");
            return;
        }

        setLoading(true);

        try {
            const amenitiesArray = formData.amenities
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .join(", ");  // Join them into a single string separated by commas

            const accommodationData = new FormData();
            accommodationData.append("name", formData.name);
            accommodationData.append("description", formData.description);
            accommodationData.append("location", formData.location);
            accommodationData.append("amenities", JSON.stringify(amenitiesArray));
            if (formData.photo) accommodationData.append("accommodation_photo", formData.photo);

            const accommodationResponse = await createAccommodation(accommodationData);
            const accommodationId = accommodationResponse._id;

            const roomsData = rooms.map((room) => {
                const roomData = new FormData();
                roomData.append("room_type", room.room_type);
                roomData.append("max_occupancy", String(room.max_occupancy));
                roomData.append("price", String(room.price));
                roomData.append("quantity", String(room.quantity));
                roomData.append("accommodation_id", accommodationId);
                if (room.photo) roomData.append("room_photo", room.photo);
                return roomData;
            });

            await createRoomAndUpdateAccommodation(roomsData, accommodationId);

            toast.success("Accommodation and rooms added successfully!");
            navigate("/admin/accommodations");
        } catch (error) {
            console.error("Error adding accommodation and rooms:", error);
            toast.error("Failed to add accommodation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-md shadow-md">
            <h1 className="text-3xl font-semibold text-gray-700 mb-6">Add Accommodation</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-600">
                            Location
                        </label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-600">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="amenities" className="block text-sm font-medium text-gray-600">
                            Amenities (comma-separated)
                        </label>
                        <input
                            id="amenities"
                            name="amenities"
                            type="text"
                            value={formData.amenities}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-600">
                            Photo
                        </label>
                        <input
                            id="photo"
                            name="photo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="mt-4 w-full h-48 object-cover rounded-md"
                            />
                        )}
                    </div>
                </div>
                {/* Rooms Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Rooms</h2>
                    {rooms.map((room, index) => (
                        <div key={index} className="space-y-2 border p-4 rounded-md">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Room Type</label>
                                    <input
                                        type="text"
                                        value={room.room_type}
                                        onChange={(e) => handleRoomChange(index, "room_type", e.target.value)}
                                        className="block w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Max Occupancy</label>
                                    <input
                                        type="number"
                                        value={room.max_occupancy}
                                        onChange={(e) =>
                                            handleRoomChange(index, "max_occupancy", +e.target.value)
                                        }
                                        className="block w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Price</label>
                                    <input
                                        type="number"
                                        value={room.price}
                                        onChange={(e) => handleRoomChange(index, "price", +e.target.value)}
                                        className="block w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Quantity</label>
                                    <input
                                        type="number"
                                        value={room.quantity}
                                        onChange={(e) =>
                                            handleRoomChange(index, "quantity", +e.target.value)
                                        }
                                        className="block w-full"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium">Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleRoomFileChange(index, e)}
                                    className="block w-full"
                                />
                                {roomPreviews[index] && (
                                    <img
                                        src={roomPreviews[index]}
                                        alt="Room Preview"
                                        className="mt-2 w-full h-32 object-cover"
                                    />
                                )}
                            </div>
                            {rooms.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeRoom(index)}
                                    className="text-red-500 mt-2"
                                >
                                    Remove Room
                                </button>
                            )}
                        </div>
                    ))}

                    <button type="button" onClick={addRoom} className="text-blue-500">
                        + Add Room
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-blue-500 text-white rounded"
                >
                    {loading ? "Saving..." : "Save Accommodation"}
                </button>
            </form>
        </div>

    );
};

export default AddAccommodation;

