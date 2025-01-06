import "../css/calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useState } from "react";
import { useNavigate, NavLink } from 'react-router-dom';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Footer } from '../layouts/footer';

export const GuestPage = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const signInClick = () => {
        navigate(`/signIn`);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>
            <nav className="bg-blue-600">
                <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="flex flex-1 items-center justify-start">
                            <span className="flex shrink-0 items-center">
                                <img
                                    className="h-8 w-auto"
                                    src="..\assets\ailogo.png"
                                    alt="Logo" />
                            </span>

                            <div className="ml-6 block">
                                <div className="flex space-x-4">
                                    <NavLink
                                        to="/guest"
                                        className={({ isActive }) =>
                                            isActive
                                                ? "rounded-md bg-white px-3 py-2 text-sm font-medium text-black"
                                                : "rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white hover:text-black"}
                                        aria-current="page">
                                        Home
                                    </NavLink>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex items-center pr-2">
                            <div className="relative ml-7">
                                <div>
                                    <button
                                        type="button"
                                        className="flex"
                                        id="user-menu-button"
                                        aria-expanded={isDropdownOpen}
                                        aria-haspopup="true"
                                        onClick={toggleDropdown}
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            className="h-8 w-8"
                                            src="../../assets/user.png"
                                            alt="avatar"
                                        />
                                    </button>
                                </div>

                                {isDropdownOpen && (
                                    <div
                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu-button">
                                        <button
                                            onClick={signInClick}
                                            className="w-full px-4 py-2 text-sm text-gray-700 flex items-center justify-center"
                                            role="menuitem">
                                            Sign In
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="calendar-container">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    editable={true}
                    droppable={true}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    footerToolbar={{
                        left: "",
                        center: "",
                        right: "prevYear,nextYear",
                    }}
                />
            </div>
            <Footer></Footer>
        </>
    );
};