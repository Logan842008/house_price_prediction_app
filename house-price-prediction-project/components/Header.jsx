"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Use `usePathname` for getting the current path in Next.js App Router.

const Header = () => {
  const pathname = usePathname(); // Get the current path
  const Links = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Listings", link: "/listings" },
    { name: "Data Visualisation", link: "/data_visualisation" },
    { name: "Prediction", link: "/prediction" },
  ];

  const [open, setOpen] = useState(false);

  return (
    <header className="bg-neutral-300 text-gray-800 shadow-md sticky top-0 z-50">
      <div className="shadow-md w-full fixed top-0 left-0">
        <div className="md:flex items-center justify-between bg-white py-1 md:px-10 px-7">
          <Link href={"/"}>
            <div
              className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] 
      text-gray-800"
            >
              <span className="text-3xl text-orange-600 mr-1 pt-2 align-baseline">
                <ion-icon name="home"></ion-icon>
              </span>
              HomePricePro
            </div>
          </Link>

          <div
            onClick={() => setOpen(!open)}
            className="text-3xl absolute right-2 top-3 cursor-pointer md:hidden"
          >
            <ion-icon name={open ? "close" : "menu"}></ion-icon>
          </div>

          <ul
            className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
              open ? "top-20 " : "top-[-490px]"
            }`}
          >
            {Links.map((link) => (
              <li key={link.name} className="md:ml-8 text-lg md:my-0 my-7">
                <Link
                  href={link.link}
                  className={`font-[Poppins] duration-500 ${
                    pathname === link.link
                      ? "text-orange-600 font-bold"
                      : "text-gray-800 hover:text-gray-400"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
