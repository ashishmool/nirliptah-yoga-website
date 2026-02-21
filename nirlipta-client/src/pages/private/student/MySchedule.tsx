import React, { useEffect, useState } from "react";
import axios from "axios";

interface Schedule {
    _id: string;
    title: string;
    start_time: string;
    end_time: string;
    status: "active" | "paused" | "canceled";
    days_of_week: string[];
    workshop_id: { title: string };
    user_id: string; // Ensure schedules are tied to a user
}

interface MyScheduleProps {
    userId: string; // Pass the logged-in user's ID
}

const MySchedule: React.FC<MyScheduleProps> = ({ userId }) => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserSchedules = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/schedules/user/${userId}`);
                if (response.data.length === 0) {
                    setSchedules([]);
                } else {
                    setSchedules(response.data);
                    calculateTimeRange(response.data);
                }
            } catch (error) {
                console.log("Error fetching schedules");
                setSchedules([]); // Ensure schedules are empty if an error occurs
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUserSchedules();
    }, [userId]);


    const calculateTimeRange = (schedules: Schedule[]) => {
        let earliestStartTime = Number.MAX_VALUE;
        let latestEndTime = 0;

        schedules.forEach((schedule) => {
            const scheduleStartTime = convertToMinutes(schedule.start_time);
            const scheduleEndTime = convertToMinutes(schedule.end_time);

            if (scheduleStartTime < earliestStartTime) earliestStartTime = scheduleStartTime;
            if (scheduleEndTime > latestEndTime) latestEndTime = scheduleEndTime;
        });

        const defaultStart = earliestStartTime;
        const defaultEnd = latestEndTime + 60; // Add 1 hour buffer

        const slots: string[] = [];
        for (let time = defaultStart; time <= defaultEnd; time += 60) {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            const period = hours >= 12 ? "PM" : "AM";
            const formattedHours = hours > 12 ? hours - 12 : hours;
            slots.push(`${formattedHours}:${minutes < 10 ? "00" : minutes} ${period}`);
        }

        setTimeSlots(slots);
    };

    const convertToMinutes = (time: string) => {
        const isAM = time.toUpperCase().includes("AM");
        const isPM = time.toUpperCase().includes("PM");
        // eslint-disable-next-line prefer-const
        let [hours, minutes] = time.replace(/(AM|PM)/i, "").split(":").map(Number);

        if (isPM && hours < 12) hours += 12;
        if (isAM && hours === 12) hours = 0;

        return hours * 60 + minutes;
    };

    const calculateCardPosition = (startTime: string, endTime: string) => {
        if (timeSlots.length === 0) return { top: "0%", height: "0%" };

        const earliestStartTime = convertToMinutes(timeSlots[0]);
        const totalMinutesDisplayed =
            convertToMinutes(timeSlots[timeSlots.length - 1]) - earliestStartTime;

        const cardStart = convertToMinutes(startTime) - earliestStartTime;
        const cardEnd = convertToMinutes(endTime) - earliestStartTime;

        const topPercentage = (cardStart / totalMinutesDisplayed) * 100;
        const heightPercentage = ((cardEnd - cardStart) / totalMinutesDisplayed) * 100;

        return {
            top: `${topPercentage}%`,
            height: `${heightPercentage}%`,
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
        <div className="max-w-7xl mx-auto p-6 mt-24">
            <h1 className="text-3xl font-semibold text-center mb-6">Weekly Schedule</h1>
            {loading ? (
                <p className="text-center text-gray-500">Loading your schedules...</p>
            ) : schedules.length === 0 ? (
                <p className="text-center text-red-800">User is Not Enrolled in Any Workshop for Schedules!</p>
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
                                            right: "0",
                                        }}
                                        onClick={() => openModal(schedule)}
                                    >
                                        <div className="text-xs font-semibold">{schedule.workshop_id?.title}</div>
                                        <div className="text-xs">{schedule.start_time} - {schedule.end_time}</div>
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

export default MySchedule;
