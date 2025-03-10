import React from "react";
import Terminal from "../Home/components/Terminal";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const ComingSoon = () => {
    return (
        <>
            {/* Coming Soon Page */}
            <div className="relative h-[100dvh] w-full flex justify-center items-center bg-pattern">
                <Terminal windowName="Coming Soon" className="relative">
                    <div
                        className="text-xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-8xl font-bold flex flex-col text-text-gray text-center"
                    >
                        <h1>به زودی!</h1>
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-4 text-gray-400">
                            به زودی در دسترس خواهد بود!
                        </h2>
                    </div>
                </Terminal>
                <div className="absolute bottom-0 h-10 w-full bg-gradient-to-b from-transparent to-primary"></div>
            </div>

            {/* Footer & Header */}
            <Footer />
            <Header />
        </>
    );
};

export default ComingSoon;
