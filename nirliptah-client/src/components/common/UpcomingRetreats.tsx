// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import YogaIcon from "@mui/icons-material/SelfImprovement"; // Replace with relevant icon
// import { dummyRetreats } from "../../backend/data/dummyRetreats";
//
// export const UpcomingRetreats = () => {
//     const [upcomingRetreats, setUpcomingRetreats] = useState<any[]>([]);
//
//     useEffect(() => {
//         // Simulating fetching data from dummyRetreats
//         const fetchRetreats = async () => {
//             try {
//                 const retreats = dummyRetreats;
//                 const futureRetreats = retreats
//                     .filter((retreat) => isFutureRetreat(retreat.date))
//                     .sort((a, b) => calculateDaysToGo(a.date) - calculateDaysToGo(b.date)); // Sort by "Days to Go"
//                 setUpcomingRetreats(futureRetreats);
//             } catch (error) {
//                 console.error("Error fetching retreats:", error);
//             }
//         };
//
//         fetchRetreats();
//     }, []);
//
//     // Helper function to check if the retreat is in the future
//     const isFutureRetreat = (startDate: string) => {
//         const today = new Date();
//         const retreatStartDate = new Date(startDate);
//         return retreatStartDate >= today;
//     };
//
//     // Helper function to calculate days remaining until the retreat starts
//     const calculateDaysToGo = (startDate: string) => {
//         const today = new Date();
//         const start = new Date(startDate);
//         const diffTime = start.getTime() - today.getTime();
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         return diffDays > 0 ? diffDays : 0; // Avoid negative days
//     };
//
//     return (
//         <div className="px-8 md:px-16 py-20 text-white bg-gradient-to-b from-gray-900 to-black">
//             <motion.h1
//                 initial={{ opacity: 0, translateY: "100%" }}
//                 whileInView={{ opacity: 1, translateY: "0%" }}
//                 transition={{ duration: 0.5 }}
//                 viewport={{ once: true }}
//                 className="text-3xl md:text-4xl text-center text-yellow-500 font-bold"
//             >
//                 UPCOMING YOGA RETREATS
//             </motion.h1>
//             <motion.h3
//                 initial={{ opacity: 0, translateY: "100%" }}
//                 whileInView={{ opacity: 1, translateY: "0%" }}
//                 transition={{ duration: 0.5 }}
//                 viewport={{ once: true }}
//                 className="text-xl md:text-2xl text-center text-gray-300 mt-4"
//             >
//                 Relax, Recharge, and Rejuvenate
//             </motion.h3>
//
//             <div className="w-full flex flex-col gap-6 pt-10 max-w-[900px] mx-auto">
//                 {upcomingRetreats.length === 0 ? (
//                     <p className="text-center text-gray-400">No upcoming retreats available.</p>
//                 ) : (
//                     <>
//                         {/* Table Header */}
//                         <div className="grid grid-cols-7 gap-2 py-2 border-b border-gray-600 font-semibold text-sm md:text-base">
//                             <span className="text-center">Retreat Name</span>
//                             <span className="text-center">Date</span>
//                             <span className="text-center">Time</span>
//                             <span className="text-center">Venue</span>
//                             <span className="text-center">Seats</span>
//                             <span className="text-center text-yellow-400">Days to Go</span>
//                             <span className="text-center text-yellow-400">Book Now</span>
//                         </div>
//
//                         {/* Table Rows */}
//                         {upcomingRetreats.map((retreat, index) => (
//                             <motion.div
//                                 key={index}
//                                 initial={{ opacity: 0, translateY: "100%" }}
//                                 whileInView={{ opacity: 1, translateY: "0%" }}
//                                 transition={{ duration: 0.5 }}
//                                 viewport={{ once: true }}
//                                 className="grid grid-cols-7 gap-2 py-4 border-b border-gray-600 text-sm md:text-base"
//                             >
//                                 <span className="text-center font-semibold">{retreat.title}</span>
//                                 <span className="text-center">{new Date(retreat.date).toLocaleDateString()}</span>
//                                 <span className="text-center">{retreat.time}</span>
//                                 <span className="text-center">{retreat.venueAddress}</span>
//
//                                 {/* Seats Left */}
//                                 <span className="text-center">
//                                     {retreat.MaxParticipants > 0 ? retreat.MaxParticipants : "Fully Booked"}
//                                 </span>
//
//                                 <span className="text-center text-yellow-400">
//                                     {calculateDaysToGo(retreat.date)}{" "}
//                                     {calculateDaysToGo(retreat.date) <= 1 ? "day" : "days"}
//                                 </span>
//
//                                 {/* Book Now */}
//                                 <span className="text-center">
//                                     {calculateDaysToGo(retreat.date) <= 0 || retreat.MaxParticipants === 0 ? (
//                                         <div className="flex items-center justify-center p-2 rounded-full bg-gray-500 text-gray-300">
//                                             <YogaIcon />
//                                         </div>
//                                     ) : (
//                                         <Link
//                                             to={`/retreats/${retreat.id}`} // Link to retreat booking page
//                                             className="flex items-center justify-center p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black transition duration-200"
//                                         >
//                                             <YogaIcon />
//                                         </Link>
//                                     )}
//                                 </span>
//                             </motion.div>
//                         ))}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };
