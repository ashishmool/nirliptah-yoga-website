import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateRetreat: React.FC = () => {
    const [retreat, setRetreat] = useState<any>({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        price_per_person: 0,
        max_participants: 0,
        address: "",
        map_location: "",
        meals_info: "",
        featuring_events: "",
        organizer: "",
        accommodation_id: null,
        instructor_id: null,
        guests: [] as { name: string; photo: File | null }[],
    });

    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const { id } = useParams(); // Get the retreat ID from URL params

    // Fetch the retreat data on component mount
    useEffect(() => {
        const fetchRetreat = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/retreats/${id}`);
                setRetreat(response.data); // Assuming the API returns the retreat data in the correct format
                setLoading(false);
            } catch (error) {
                console.error("Error fetching retreat:", error);
                setLoading(false);
            }
        };

        if (id) {
            fetchRetreat();
        }
    }, [id]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRetreat({ ...retreat, [name]: value });
    };

    // Handle form submit for updating retreat
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:5000/api/retreats/update/${id}`, retreat);
            alert("Retreat updated successfully!");
            navigate("/admin/retreats"); // Redirect after update
        } catch (error) {
            console.error("Error updating retreat:", error);
            alert("Error updating retreat.");
        }
    };

    // Go Back to the retreats list page
    const handleGoBack = () => {
        navigate("/admin/retreats");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center mb-6">Update Retreat</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={retreat.title}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={retreat.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            id="start_date"
                            name="start_date"
                            type="date"
                            value={retreat.start_date.split("T")[0]} // Format to yyyy-mm-dd
                            onChange={handleInputChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="w-1/2">
                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            id="end_date"
                            name="end_date"
                            type="date"
                            value={retreat.end_date.split("T")[0]} // Format to yyyy-mm-dd
                            onChange={handleInputChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="price_per_person" className="block text-sm font-medium text-gray-700">Price Per Person</label>
                        <input
                            id="price_per_person"
                            name="price_per_person"
                            type="number"
                            value={retreat.price_per_person}
                            onChange={handleInputChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="w-1/2">
                        <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700">Max Participants</label>
                        <input
                            id="max_participants"
                            name="max_participants"
                            type="number"
                            value={retreat.max_participants}
                            onChange={handleInputChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                </div>

                {/* Add additional fields for the missing information */}
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        value={retreat.address}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="map_location" className="block text-sm font-medium text-gray-700">Map Location</label>
                    <input
                        id="map_location"
                        name="map_location"
                        type="text"
                        value={retreat.map_location}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="meals_info" className="block text-sm font-medium text-gray-700">Meals Info</label>
                    <textarea
                        id="meals_info"
                        name="meals_info"
                        value={retreat.meals_info}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="featuring_events" className="block text-sm font-medium text-gray-700">Featuring Events</label>
                    <textarea
                        id="featuring_events"
                        name="featuring_events"
                        value={retreat.featuring_events}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">Organizer</label>
                    <input
                        id="organizer"
                        name="organizer"
                        type="text"
                        value={retreat.organizer}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="accommodation_id" className="block text-sm font-medium text-gray-700">Accommodation ID</label>
                        <input
                            id="accommodation_id"
                            name="accommodation_id"
                            type="text"
                            value={retreat.accommodation_id || ""}
                            onChange={handleInputChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="w-1/2">
                        <label htmlFor="instructor_id" className="block text-sm font-medium text-gray-700">Instructor ID</label>
                        <input
                            id="instructor_id"
                            name="instructor_id"
                            type="text"
                            value={retreat.instructor_id || ""}
                            onChange={handleInputChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Guests</label>
                    {/* Add logic to handle guests if necessary */}
                    <input
                        id="guests"
                        name="guests"
                        type="text"
                        value={retreat.guests.map((guest) => guest.name).join(", ")}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={handleGoBack}
                        className="bg-gray-500 text-white p-4 rounded-md"
                    >
                        Go Back
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-4 rounded-md"
                    >
                        {loading ? "Updating..." : "Update Retreat"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateRetreat;
