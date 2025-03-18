import React, {useEffect, useState} from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import {StaffModel, StaffTeam, StaffTeamTranslation} from "../../models/StaffModel.ts";
import {makeCall} from "../../utils/makeCall.ts";

const ComingSoon = () => {
    const [staff, setStaff] = useState<StaffModel[]>([]);

    useEffect(() => {
        makeCall("/api/staff/", "GET").call(null, null)
            .then(response => setStaff(response.data as StaffModel[]))
            .catch(error => console.error("Error fetching staff:", error));
    }, []);

    const groupedStaff = staff.reduce<Record<string, StaffModel[]>>((acc, member) => {
        if (!acc[member.team]) {
            acc[member.team] = [];
        }
        acc[member.team].push(member);
        return acc;
    }, {});

    return (
        <>
            <div className="relative pt-24 w-full flex justify-center items-center bg-pattern">
                <Header/>
                <div className="container mx-auto p-4">
                    {/* Directors Section */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">دبیران</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {staff.filter(member => member.role === "DIRECTOR").map(director => (
                                <div key={director.id} className="p-4 bg-light-gray rounded-lg text-center">
                                    <img src={director.image} alt={director.name}
                                         className="w-32 h-32 mx-auto rounded-full"/>
                                    <h3 className="text-xl font-semibold mt-2">{director.name}</h3>
                                    <p className="italic">"{director.quote}"</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Teams Section */}
                    {Object.entries(groupedStaff).map(([team, members]) => {
                        const typedTeam = team as StaffTeam; // Ensure correct typing for the team

                        // Find the head of the team (assuming role === "HEAD" is the identifier)
                        const head = members.find(member => member.role === "HEAD");
                        const staffWithoutHead = members.filter(member => member.role !== "HEAD");

                        return (
                            <>
                                {typedTeam !== StaffTeam.DIRECTOR && (
                                    <section key={typedTeam} className="mb-8">
                                        {/* Section Title */}
                                        <h2 className="text-2xl font-bold mb-4">
                                            {StaffTeamTranslation[typedTeam] ?? ""}
                                        </h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                                            {/* Head of the Team (Full Row) */}
                                            {head && (
                                                <div
                                                    className="col-span-1 sm:col-span-2  text-center p-4 bg-light-gray rounded-lg">
                                                    <h4 className="font-semibold my-2 mb-4">Head</h4>
                                                    <img src={head.image} alt={head.name}
                                                         className="w-32 h-32 mx-auto rounded-full"/>
                                                    <h3 className="text-xl font-bold mt-2">{head.name}</h3>
                                                    <p className="italic">"{head.quote}"</p>
                                                </div>
                                            )}

                                            {/* Other Team Members (Half Width) */}
                                            {staffWithoutHead.map(member => (
                                                <div key={member.id}
                                                     className="p-4 bg-light-gray rounded-lg text-center">
                                                    <img src={member.image} alt={member.name}
                                                         className="w-24 h-24 mx-auto rounded-full"/>
                                                    <h3 className="text-lg font-semibold mt-2">{member.name}</h3>
                                                    <p className="italic">"{member.quote}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        );
                    })}
                </div>
            </div>
                <Footer/>
            </>
            );
            };

            export default ComingSoon;
