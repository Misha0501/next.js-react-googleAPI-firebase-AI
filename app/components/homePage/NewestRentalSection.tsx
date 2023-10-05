"use client";
import React from "react";
import SlickSlider from "../Slider/Slider";

function NewestRentalSection() {
    return (
        <>
            <section className="pt-18 md:pt-20 py-11">
                <div className="container text-center flex flex-col gap-12">
                    <div className="flex flex-col">
                        <h3 className="text-[#222222] mb-2 font-bold text-2xl md:text-[40px]">
                            Newest rental properties
                        </h3>
                        <p className="text-base font-normal text-[#616161]">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit
                        </p>
                    </div>
                    <SlickSlider/>
                </div>
            </section>
        </>
    );
}

export default NewestRentalSection;
