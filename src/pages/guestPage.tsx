import "../css/calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";

// import { useState } from "react";
import {NavLink } from 'react-router-dom';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Footer } from '../layouts/footer';

export const GuestPage = () => {
    return (
        <>
            <nav className="bg-blue-600">
                <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="flex flex-1 items-center justify-start">
                            <span className="ml-3 flex shrink-0 items-center">
                                <img
                                    className="h-10 w-auto"
                                    src="..\assets\ailogo.png"
                                    alt="Logo" />
                            </span>

                            <div className="ml-6 block">
                                <div className="flex space-x-4">
                                    <NavLink
                                        to="/guest"
                                        className={({ isActive }) =>
                                            isActive
                                                ? "rounded-md bg-white px-3 py-2 text-sm font-medium text-black  text-decoration-none "
                                                : "rounded-md px-3 py-2 text-sm font-medium text-decoration-none  text-white hover:bg-blue-400"}
                                        aria-current="page">
                                        Home
                                    </NavLink>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex items-center pr-2">
                            <div className="ml-7 flex space-x-4">
                                <NavLink
                                    to="/signIn"
                                    className="rounded-md px-3 py-2 text-sm font-medium text-decoration-none  text-white hover:bg-blue-400"
                                    aria-current="page">
                                    SignIn
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="rounded-md px-3 py-2 text-sm font-medium text-decoration-none  text-white hover:bg-blue-400"
                                    aria-current="page">
                                    Register
                                </NavLink>                            </div>
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
