"use client";

import React, { useEffect } from "react";
import { FaUsers, FaBuilding, FaHandsHelping, FaCheck } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
    });
  }, []);

  const milestones = [
    {
      year: "2020",
      title: "Founded",
      description: "Started with a vision to transform real estate",
    },
    {
      year: "2021",
      title: "Expansion",
      description: "Reached 50+ cities across the country",
    },
    {
      year: "2022",
      title: "Innovation",
      description: "Launched AI-powered market analysis tools",
    },
    {
      year: "2023",
      title: "Growth",
      description: "Helped 25,000+ families find their dream homes",
    },
  ];

  return (
    <div className="py-16">
      <div className="max-w-full mx-auto">
        <h2
          className="text-6xl font-bold text-gray-800 mb-4 text-center"
          data-aos="fade-up"
        >
          Who We Are
        </h2>
        <p
          className="text-2xl text-gray-600 max-w-4xl text-center mx-auto mb-16 leading-relaxed"
          data-aos="fade-up"
        >
          At <span className="text-orange-500 font-bold">HomePricePro</span>,
          we connect buyers, sellers, and real estate professionals with a
          seamless and innovative platform. Our focus is to make property
          transactions transparent, efficient, and accessible for everyone.
        </p>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
          data-aos="fade-up"
        >
          <div className="flex flex-col items-center text-center">
            <FaUsers
              className="text-orange-500 text-8xl mb-6"
              data-aos="zoom-in"
            />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Community Driven
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              A vibrant community of real estate professionals and users powers
              HomePricePro. We foster collaboration and innovation in every
              step of the journey, ensuring everyone benefits from shared
              knowledge and experiences.
            </p>
            <ul className="mt-6 text-left" data-aos="fade-left">
              <li className="flex items-center mb-3">
                <FaCheck className="text-orange-500 mr-2" />
                <span>Active community forums</span>
              </li>
              <li className="flex items-center mb-3">
                <FaCheck className="text-orange-500 mr-2" />
                <span>Expert networking events</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="text-orange-500 mr-2" />
                <span>Collaborative tools</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center text-center">
            <FaBuilding
              className="text-blue-500 text-8xl mb-6"
              data-aos="zoom-in"
            />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Trusted Expertise
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Backed by years of experience in the real estate industry, our
              experts provide you with reliable insights and market expertise
              that you can count on for making informed decisions.
            </p>
            <ul className="mt-6 text-left" data-aos="fade-left">
              <li className="flex items-center mb-3">
                <FaCheck className="text-blue-500 mr-2" />
                <span>Industry veterans</span>
              </li>
              <li className="flex items-center mb-3">
                <FaCheck className="text-blue-500 mr-2" />
                <span>Data-driven insights</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="text-blue-500 mr-2" />
                <span>Market analysis</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center text-center">
            <FaHandsHelping
              className="text-green-500 text-8xl mb-6"
              data-aos="zoom-in"
            />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Committed Support
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our support team ensures you have all the tools and assistance you
              need to achieve your property goals. We're here for you every step
              of the way, providing guidance and solutions.
            </p>
            <ul className="mt-6 text-left" data-aos="fade-left">
              <li className="flex items-center mb-3">
                <FaCheck className="text-green-500 mr-2" />
                <span>24/7 customer service</span>
              </li>
              <li className="flex items-center mb-3">
                <FaCheck className="text-green-500 mr-2" />
                <span>Dedicated advisors</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                <span>Resource library</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-12" data-aos="fade-up">
          <h3 className="text-3xl font-bold text-center mb-8">Our Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="text-center bg-white p-5 rounded-lg"
                data-aos="flip-right"
                data-aos-delay={`${index * 100}`}
              >
                <div className="text-2xl font-bold text-orange-500 mb-2">
                  {milestone.year}
                </div>
                <div className="text-xl font-semibold mb-2">
                  {milestone.title}
                </div>
                <div className="text-gray-600">{milestone.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
