import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner";

const AddRetreat: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        price_per_person: 0,
        max_participants: 0,
        address: "",
        map_location: "",
        meals_info: "",
        organizer: "",
        featuring_events: "",
        accommodation_id: null,
        instructor_id: null,
        guests: [] as { name: string; photo: File | null }[],
        retreatPhotos: [] as File[],
    });

    const [loading, setLoading] = useState(false);
    const [accommodations, setAccommodations] = useState([]);
    const [instructors, setInstructors] = useState([]);

    // Fetch accommodations and instructors on component mount
    useEffect(() => {
        const fetchAccommodations = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/accommodations");
                setAccommodations(response.data || []);
            } catch (error) {
                console.error("Error fetching accommodations:", error);
            }
        };

        const fetchInstructors = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/instructors");
                setInstructors(response.data || []);
            } catch (error) {
                console.error("Error fetching instructors:", error);
            }
        };

        fetchAccommodations();
        fetchInstructors();
    }, []);

    const handleRetreatPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setFormData({ ...formData, retreatPhotos: files });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleGuestImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const newGuests = [...formData.guests];
        newGuests[index] = { ...newGuests[index], photo: file };
        setFormData({ ...formData, guests: newGuests });
    };

    const handleGuestChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newGuests = [...formData.guests];
        newGuests[index] = { ...newGuests[index], [name]: value };
        setFormData({ ...formData, guests: newGuests });
    };


    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value || null });
    };


    const addGuest = () => {
        setFormData({ ...formData, guests: [...formData.guests, { name: "", photo: null }] });
    };

    const removeGuest = (index: number) => {
        const newGuests = formData.guests.filter((_, i) => i !== index);
        setFormData({ ...formData, guests: newGuests });
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            start_date: "",
            end_date: "",
            price_per_person: 0,
            max_participants: 0,
            address: "",
            map_location: "",
            meals_info: "",
            organizer: "",
            featuring_events: "",
            accommodation_id: null,
            instructor_id: null,
            guests: [],
            retreatPhotos: [],
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create FormData for sending data to the server
            const formPayload = new FormData();
            formPayload.append("title", formData.title);
            formPayload.append("description", formData.description);
            formPayload.append("start_date", formData.start_date);
            formPayload.append("end_date", formData.end_date);
            formPayload.append("price_per_person", formData.price_per_person.toString());
            formPayload.append("max_participants", formData.max_participants.toString());

            // Adding the address and map_location
            formPayload.append("address", formData.address);
            formPayload.append("map_location", formData.map_location);

            // Convert meals and events into JSON strings
            formPayload.append("meals_info", JSON.stringify(formData.meals_info.split(",").map((meal) => meal.trim())));
            formPayload.append("featuring_events", JSON.stringify(formData.featuring_events.split(",").map((event) => event.trim())));

            formPayload.append("organizer", formData.organizer);

            // Optional fields
            if (formData.accommodation_id) {
                formPayload.append("accommodation_id", formData.accommodation_id);
            }
            if (formData.instructor_id) {
                formPayload.append("instructor_id", formData.instructor_id);
            }

            // Add retreat photos
            formData.retreatPhotos.forEach((photo) => {
                formPayload.append("retreat_photos", photo);  // Ensure the key matches the backend configuration
            });

            // Add guest details (names and optional photos)
            formData.guests.forEach((guest, index) => {
                formPayload.append(`guests[${index}][name]`, guest.name);
                if (guest.photo) {
                    formPayload.append(`guests[${index}][photo]`, guest.photo);
                }
            });

            console.log("Payload:::", formData);

            formPayload.forEach((value, key) => {
                console.log(key, value);
            });

            console.log("Guest Data:", formData.guests);


            // Send the request to the API
            const response = await axios.post(
                "http://localhost:5000/api/retreats/save",
                formPayload,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Retreat added successfully:", response.data);
            toast.success("Retreat added successfully!");
            resetForm();
            navigate("/admin/retreats");
        } catch (error) {
            console.error("Error adding retreat:", error);
            alert("Failed to add retreat: " + error.message);
        } finally {
            setLoading(false);
        }
    };


    // Go Back to the retreats list page
    const handleGoBack = () => {
        navigate("/admin/retreats");
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center mb-6">Add New Retreat</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                        required
                    />
                </div>

                {/* Start and End Dates */}
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            id="start_date"
                            name="start_date"
                            type="date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            id="end_date"
                            name="end_date"
                            type="date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    </div>
                </div>

                {/* Price and Max Participants in Same Row */}
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="price_per_person" className="block text-sm font-medium text-gray-700">Price Per Person</label>
                        <input
                            id="price_per_person"
                            name="price_per_person"
                            type="number"
                            value={formData.price_per_person}
                            onChange={handleChange}
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
                            value={formData.max_participants}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                </div>

                {/* Meals Info */}
                <div>
                    <label htmlFor="meals_info" className="block text-sm font-medium text-gray-700">Meals Info</label>
                    <textarea
                        id="meals_info"
                        name="meals_info"
                        value={formData.meals_info}
                        onChange={handleChange}
                        placeholder="Comma separated list of meal options (e.g., Vegetarian, Vegan)"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Organizer */}
                <div>
                    <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">Organizer</label>
                    <input
                        id="organizer"
                        name="organizer"
                        type="text"
                        value={formData.organizer}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Featuring Events */}
                <div>
                    <label htmlFor="featuring_events" className="block text-sm font-medium text-gray-700">Featuring Events</label>
                    <textarea
                        id="featuring_events"
                        name="featuring_events"
                        value={formData.featuring_events}
                        onChange={handleChange}
                        placeholder="Comma separated list of events (e.g., Kirtan Night, Yoga Classes)"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Accommodation */}
                <div>
                    <label htmlFor="accommodation_id" className="block text-sm font-medium text-gray-700">Accommodation</label>
                    <select
                        id="accommodation_id"
                        name="accommodation_id"
                        value={formData.accommodation_id || ""}
                        onChange={handleSelectChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select Accommodation</option>
                        {accommodations.map((acc: any) => (
                            <option key={acc._id} value={acc._id}>{acc.name}</option>
                        ))}
                    </select>
                </div>

                {/* Instructor */}
                <div>
                    <label htmlFor="instructor_id" className="block text-sm font-medium text-gray-700">Instructor</label>
                    <select
                        id="instructor_id"
                        name="instructor_id"
                        value={formData.instructor_id || ""}
                        onChange={handleSelectChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select Instructor</option>
                        {instructors.map((inst: any) => (
                            <option key={inst._id} value={inst._id}>{inst.name}</option>
                        ))}
                    </select>
                </div>

                {/* Retreat Photos */}
                <div>
                    <label htmlFor="retreat_photos" className="block text-sm font-medium text-gray-700">Retreat Photos</label>
                    <input
                        id="retreat_photos"
                        name="retreat_photos"
                        type="file"
                        onChange={handleRetreatPhotoChange}
                        multiple
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>


                {/* Guest Details */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Guest List</label>
                    {formData.guests.map((guest, index) => (
                        <div key={index} className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={guest.name}
                                    onChange={(e) => handleGuestChange(index, e)}
                                    placeholder="Guest Name"
                                    className="mt-1 block w-3/4 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <input
                                    type="file"
                                    onChange={(e) => handleGuestImageChange(index, e)}
                                    className="p-3 border border-gray-300 rounded-md shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeGuest(index)}
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addGuest}
                        className="mt-2 text-blue-500"
                    >
                        Add Guest
                    </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={handleGoBack}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-500 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Retreat"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRetreat;
