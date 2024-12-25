import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const UpdateRetreat: React.FC = () => {
    const { id } = useParams<{ id: string }>();
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
        retreat_photo: [] as File[],
    });

    const [loading, setLoading] = useState(true);
    const [accommodations, setAccommodations] = useState([]);
    const [instructors, setInstructors] = useState([]);

    // Fetch accommodations and instructors
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [accommodationRes, instructorRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/accommodations"),
                    axios.get("http://localhost:5000/api/instructors"),
                ]);
                setAccommodations(accommodationRes.data || []);
                setInstructors(instructorRes.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to fetch initial data.");
            }
        };
        fetchData();
    }, []);

    // Fetch retreat details for editing
    useEffect(() => {
        const fetchRetreat = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/retreats/${id}`);
                const data = response.data;

                // Format dates to "yyyy-MM-dd"
                const formattedStartDate = data.start_date
                    ? new Date(data.start_date).toISOString().split("T")[0]
                    : "";
                const formattedEndDate = data.end_date
                    ? new Date(data.end_date).toISOString().split("T")[0]
                    : "";

                setFormData({
                    ...data,
                    start_date: formattedStartDate,
                    end_date: formattedEndDate,
                    meals_info: data.meals_info.join(", "),
                    featuring_events: data.featuring_events.join(", "),
                    guests: data.guests.map((guest: any) => ({
                        name: guest.name,
                        photo: null, // Keep null since the existing photo can't be uploaded again
                    })),
                    retreat_photo: [], // Reset to empty for new uploads
                });

                setLoading(false);
            } catch (error) {
                console.error("Error fetching retreat:", error);
                setLoading(false);
                toast.error("Failed to fetch retreat details.");
            }
        };

        if (id) {
            fetchRetreat();
        }
    }, [id]);

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRetreatPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setFormData({ ...formData, retreat_photo: files });
    };

    const handleGuestChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newGuests = [...formData.guests];
        newGuests[index] = { ...newGuests[index], [name]: value };
        setFormData({ ...formData, guests: newGuests });
    };

    const handleGuestImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const newGuests = [...formData.guests];
        newGuests[index] = { ...newGuests[index], photo: file };
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log("Update Retreat Payload:::",formData);

        try {
            const formPayload = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (Array.isArray(value) && key === "retreat_photo") {
                    value.forEach((photo) => formPayload.append("retreat_photos", photo));
                } else if (Array.isArray(value) && key === "guests") {
                    value.forEach((guest, index) => {
                        formPayload.append(`guests[${index}][name]`, guest.name);
                        if (guest.photo) {
                            formPayload.append(`guests[${index}][photo]`, guest.photo);
                        }
                    });
                } else if (key === "meals_info" || key === "featuring_events") {
                    formPayload.append(key, JSON.stringify(value.split(",").map((item) => item.trim())));
                } else if (value !== null) {
                    formPayload.append(key, value.toString());
                }
            });

            await axios.put(`http://localhost:5000/api/retreats/update/${id}`, formPayload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Retreat updated successfully!");
            navigate("/admin/retreats");
        } catch (error) {
            console.error("Error updating retreat:", error);
            toast.error("Failed to update retreat. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center mb-6">Update Retreat</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Reuse the form inputs from AddRetreat */}
                {/* Example: Title */}
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
                    <div>
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            id="start_date"
                            name="start_date"
                            type="date"
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            id="end_date"
                            name="end_date"
                            type="date"
                            value={formData.end_date}
                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
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
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
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

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/retreats")}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-500 text-white rounded-md shadow-sm"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Retreat"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateRetreat;
