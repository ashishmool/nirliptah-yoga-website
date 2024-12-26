import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type Guest = {
    name: string;
    guest_photo: File | null | string; // Handles both uploaded files and existing URLs
};

type RetreatFormData = {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    price_per_person: number;
    max_participants: number;
    address: string;
    map_location: string;
    meals_info: string;
    organizer: string;
    featuring_events: string;
    accommodation_id: string | null;
    instructor_id: string | null;
    guests: Guest[];
    photo: (File | string)[];
};

const UpdateRetreat: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();


    const [formData, setFormData] = useState<RetreatFormData>({
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
        photo: [],
    });

    const [accommodations, setAccommodations] = useState<{ _id: string; name: string }[]>([]);
    const [instructors, setInstructors] = useState<{ _id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);


    // Fetch retreat details, accommodations, and instructors
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Retreat ID params:::::", id);
                const [retreatRes, accommodationRes, instructorRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/retreats/${id}`),
                    axios.get("http://localhost:5000/api/accommodations"),
                    axios.get("http://localhost:5000/api/instructors"),
                ]);

                const retreatData = retreatRes.data;
                console.log("RetreatData:::", retreatData);
                const formattedStartDate = retreatData.start_date
                    ? new Date(retreatData.start_date).toISOString().split("T")[0]
                    : "";

                const formattedEndDate = retreatData.end_date
                    ? new Date(retreatData.end_date).toISOString().split("T")[0]
                    : "";


                setFormData({
                    ...retreatData,
                    accommodation_id: retreatData.accommodation_id._id,
                    instructor_id: retreatData.instructor_id._id,
                    start_date: formattedStartDate,
                    end_date: formattedEndDate,
                    meals_info: retreatData.meals_info.join(", "),
                    featuring_events: retreatData.featuring_events.join(", "),
                    photo: retreatData.photo || [],
                    guests: retreatData.guests || [],
                });

                // Check if accommodation photo exists and set the image preview URL
                if (retreatData.photo) {
                    setImagePreview(`http://localhost:5000${retreatData.photo}`);
                }

                setAccommodations(accommodationRes.data || []);
                setInstructors(instructorRes.data || []);
            } catch (error) {
                console.error("Error fetching retreat data:", error);
                toast.error("Failed to fetch retreat details.");
            }
        };

        fetchData();
    }, [id]);

    // Form Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value || null });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, photo: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        const maxFileSize = 5 * 1024 * 1024; // 5MB

        const validFiles = files.filter((file) => {
            if (file.size > maxFileSize) {
                toast.error(`File ${file.name} exceeds 5MB limit.`);
                return false;
            }
            return true;
        });

        setFormData({ ...formData, photo: [...formData.photo, ...validFiles] });
    };

    const handleGuestChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedGuests = [...formData.guests];
        updatedGuests[index] = { ...updatedGuests[index], [name]: value };
        setFormData({ ...formData, guests: updatedGuests });
    };

    const handleGuestPhotoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const updatedGuests = [...formData.guests];
        updatedGuests[index] = { ...updatedGuests[index], guest_photo: file };
        setFormData({ ...formData, guests: updatedGuests });
    };

    const addGuest = () => {
        setFormData({ ...formData, guests: [...formData.guests, { name: "", guest_photo: null }] });
    };

    const removeGuest = (index: number) => {
        const updatedGuests = formData.guests.filter((_, i) => i !== index);
        setFormData({ ...formData, guests: updatedGuests });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (new Date(formData.end_date) <= new Date(formData.start_date)) {
            toast.error("End date must be after the start date.");
            return;
        }

        const formPayload = new FormData();

        // Append the photo if it's provided
        if (formData.photo) {
            formPayload.append("retreat_photo", formData.photo);
        }

        // Append other fields
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                if (key === "guests") {
                    value.forEach((guest, index) => {
                        formPayload.append(`guests[${index}][name]`, guest.name);
                        if (guest.guest_photo instanceof File) {
                            formPayload.append(`guests[${index}][guest_photo]`, guest.guest_photo);
                        }
                    });
                } else if (key === "meals_info" || key === "featuring_events") {
                    formPayload.append(key, JSON.stringify(value.map((item) => item.trim())));
                }
            } else {
                formPayload.append(key, value?.toString() || "");
            }
        });

        try {
            setLoading(true);
            console.log("Sending Form Data::::: ",formData);
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

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => navigate(-1)} className="text-[#9B6763] hover:text-[#B8998C]">
                    &#8592; Back
                </button>
                <h1 className="text-3xl font-semibold">Update Retreat</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
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
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
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
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
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
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
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
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
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
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
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
                        placeholder="Comma separated list of events (e.g., Kirtan Night, Nature Walk Meditation)"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                {/* Accommodation */}
                <div>
                    <label htmlFor="accommodation_id" className="block text-sm font-medium text-gray-700">Accommodation</label>
                    <select
                        id="accommodation_id"
                        name="accommodation_id"
                        value={formData.accommodation_id || ""}  // Ensure this is referring to the selected accommodation ID
                        onChange={handleSelectChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select Accommodation</option>
                        {accommodations.map((acc) => (
                            <option key={acc._id} value={acc._id}>{acc.name}</option>  // Using acc._id for value and acc.name for display text
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
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select Instructor</option>
                        {instructors.map((inst: any) => (
                            <option key={inst._id} value={inst._id}>{inst.name}</option>
                        ))}
                    </select>
                </div>

                {/* Retreat Photos */}
                <div>
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Retreat Photos</label>
                    <input
                        id="retreat_photo"
                        name="retreat_photo"
                        type="file"
                        onChange={handleFileChange}
                        multiple
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Accommodation Preview"
                        className="mt-2 w-32 h-32 object-cover rounded-md"
                    />
                )}

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
                                    className="mt-1 block w-3/4 p-3 border border-gray-300 rounded-md shadow-sm"
                                />
                                <input
                                    type="file"
                                    onChange={(e) => handleGuestPhotoChange(index, e)}
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
                        onClick={() => navigate("/admin/retreats")}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
                    >
                        {loading ? "Updating..." : "Update Retreat"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateRetreat;