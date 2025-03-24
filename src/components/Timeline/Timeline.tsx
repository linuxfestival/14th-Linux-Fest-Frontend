import React, { useState } from "react";
import { motion } from "framer-motion";

const eventData = [
    {
        day: "Day 1",
        events: [
            { start: "10:00", end: "12:00", title: "Opening Ceremony", details: "Welcome speech and introduction." },
            { start: "11:00", end: "11:30", title: "Keynote Speech", details: "Speaker: Dr. John Doe" },
        ],
    },
    {
        day: "Day 2",
        events: [
            { start: "09:00", end: "10:30", title: "Workshop: AI in 2025", details: "Interactive session on AI trends." },
            { start: "14:00", end: "15:30", title: "Panel Discussion", details: "Experts discuss future technologies." },
        ],
    },
    {
        day: "Day 3",
        events: [
            { start: "10:00", end: "11:00", title: "Networking Event", details: "Meet industry leaders and peers." },
            { start: "13:00", end: "14:00", title: "Closing Remarks", details: "Event summary and closing speech." },
        ],
    },
];

const convertTimeToPercentage = (time: any) => {
    if (!time || typeof time !== "string" || !time.includes(":")) {
        console.warn("Invalid time format: ", time);
        return 0; // Default to 0% if invalid
    }
    const [hours, minutes] = time.split(":").map(Number);
    return ((hours * 60 + minutes) / (24 * 60)) * 100;
};

const Timeline = () => {
    const [selectedDay, setSelectedDay] = useState(eventData[0]);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex space-x-4 mb-6 justify-center">
                {eventData.map((day, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 border rounded-full ${selectedDay.day === day.day ? "bg-blue-500 text-white" : "bg-white border-gray-300"}`}
                        onClick={() => setSelectedDay(day)}
                    >
                        {day.day}
                    </button>
                ))}
            </div>

            <div className="relative w-full h-28 bg-gray-100 rounded-lg p-2 flex flex-col space-y-1 overflow-x-auto">
                <div className="relative w-full h-full bg-gray-300 rounded flex flex-col space-y-1 p-2">
                    {selectedDay.events.map((event, index) => {
                        const startPercent = convertTimeToPercentage(event.start);
                        const endPercent = convertTimeToPercentage(event.end);
                        const widthPercent = Math.max(endPercent - startPercent, 5); // Prevents zero-width issue

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="absolute h-8 bg-blue-500 text-white text-xs flex items-center justify-center px-2 rounded shadow-md"
                                style={{ left: `${startPercent}%`, width: `${widthPercent}%`, top: `${index * 36}px` }}
                            >
                                {event.title}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Timeline;