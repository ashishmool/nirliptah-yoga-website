import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Schedule {
    _id: string;
    title: string;
    instructor: { name: string };
    start_time: string;
    end_time: string;
    status: "active" | "paused" | "canceled";
    days_of_week: string[];
    workshop_id: { title: string };
}

const WeeklyRoutine: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null); // For modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/schedules");
                setSchedules(response.data);
                calculateTimeRange(response.data);
            } catch (error) {
                toast.error("Error fetching schedules.");
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, []);

    const calculateTimeRange = (schedules: Schedule[]) => {
        let earliestStartTime = Number.MAX_VALUE;
        let latestEndTime = 0;

        schedules.forEach((schedule) => {
            const scheduleStartTime = convertToMinutes(schedule.start_time);
            const scheduleEndTime = convertToMinutes(schedule.end_time);

            if (scheduleStartTime < earliestStartTime) earliestStartTime = scheduleStartTime;
            if (scheduleEndTime > latestEndTime) latestEndTime = scheduleEndTime;
        });

        // Now set the start and end based on the earliest schedule start_time and latest end_time + 1 hour.
        const defaultStart = earliestStartTime;
        const defaultEnd = latestEndTime + 60; // Add 60 minutes (1 hour) to the latest end time

        const timeSlots: string[] = [];
        for (let time = defaultStart; time <= defaultEnd; time += 60) { // 60-minute intervals (1 hour)
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            const period = hours >= 12 ? "PM" : "AM";
            const formattedHours = hours > 12 ? hours - 12 : hours;
            timeSlots.push(`${formattedHours}:${minutes < 10 ? "00" : minutes} ${period}`);
        }

        setTimeSlots(timeSlots);
    };

    const convertToMinutes = (time: string) => {
        const isAM = time.toUpperCase().includes("AM");
        const isPM = time.toUpperCase().includes("PM");

        // Remove AM/PM from the time string
        let [hours, minutes] = time.replace(/(AM|PM)/i, "").split(":").map(Number);

        if (isNaN(hours) || isNaN(minutes)) {
            console.error(`Invalid time format: ${time}`);
            return 0; // Return 0 for invalid times
        }

        // Adjust hours for AM/PM
        if (isPM && hours < 12) hours += 12; // Convert PM times to 24-hour format
        if (isAM && hours === 12) hours = 0; // Convert 12 AM to 0 hours

        return hours * 60 + minutes; // Return total minutes from midnight
    };

    const calculateCardPosition = (startTime: string, endTime: string) => {
        const earliestStartTime = convertToMinutes(timeSlots[0]); // Grid start in minutes
        const totalMinutesDisplayed =
            convertToMinutes(timeSlots[timeSlots.length - 1]) - earliestStartTime; // Total grid duration

        if (totalMinutesDisplayed <= 0) {
            console.error("Total minutes displayed is zero or negative");
            return { top: "0%", height: "0%" }; // Avoid division by zero
        }

        const cardStart = convertToMinutes(startTime) - earliestStartTime; // Event start offset
        const cardEnd = convertToMinutes(endTime) - earliestStartTime; // Event end offset

        const topPercentage = (cardStart / totalMinutesDisplayed) * 100;
        const heightPercentage = ((cardEnd - cardStart) / totalMinutesDisplayed) * 100;

        return {
            top: `${topPercentage}%`, // Calculate position based on start time
            height: `${heightPercentage}%`, // Calculate height based on event duration
        };
    };

    const getStatusColor = (status: "active" | "paused" | "canceled") => {
        switch (status) {
            case "active":
                return "bg-green-500";
            case "paused":
                return "bg-yellow-500";
            case "canceled":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const getSchedulesForDay = (day: string) => {
        return schedules.filter((schedule) => schedule.days_of_week.includes(day));
    };

    const openModal = (schedule: Schedule) => {
        setSelectedSchedule(schedule);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedSchedule(null);
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center mb-6">Weekly Routine</h1>
            {loading ? (
                <p className="text-center text-gray-500">Loading schedules...</p>
            ) : (
                <div className="grid grid-cols-8 gap-4">
                    {/* Days Header */}
                    <div></div> {/* Empty space for the time column */}
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                        <div key={day} className="text-center font-semibold">{day}</div>
                    ))}

                    {/* Time Slots */}
                    <div className="col-span-1 relative">
                        {timeSlots.map((timeSlot, index) => (
                            <div key={index} className="h-20 flex items-center justify-center text-xs font-medium border-b">
                                {timeSlot}
                            </div>
                        ))}
                    </div>

                    {/* Schedule Columns */}
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                        <div key={day} className="relative col-span-1 border-l">
                            {getSchedulesForDay(day).map((schedule) => {
                                const position = calculateCardPosition(schedule.start_time, schedule.end_time);
                                return (
                                    <div
                                        key={schedule._id}
                                        className={`absolute rounded-md p-2 text-white ${getStatusColor(
                                            schedule.status
                                        )} shadow-md cursor-pointer`}
                                        style={{
                                            ...position,
                                            left: "0",
                                            right: "0", // Center-align cards
                                        }}
                                        onClick={() => openModal(schedule)} // Open modal on click
                                    >
                                        <div className="text-xs font-semibold">{schedule.workshop_id?.title}</div>
                                        <div className="text-xs">{schedule.start_time} - {schedule.end_time}</div>
                                        <div className="text-xs italic">{schedule.instructor.name}</div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && selectedSchedule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">{selectedSchedule.title}</h2>
                        <p><strong>Instructor:</strong> {selectedSchedule.instructor.name}</p>
                        <p><strong>Workshop:</strong> {selectedSchedule.workshop_id?.title}</p>
                        <p><strong>Time:</strong> {selectedSchedule.start_time} - {selectedSchedule.end_time}</p>
                        <p><strong>Status:</strong> {selectedSchedule.status}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeeklyRoutine;
