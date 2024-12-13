import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../helpers/context/authProvider';
import { useState } from 'react';

export const Header = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const logOutClick = () => {
        logout();
        navigate(`/signIn`);
    };

    const viewProfileClick = () => {
        navigate(`/profile`);
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
                                    src=""
                                    alt="Logo"
                                />
                            </span>
                            <div className="ml-6 block">
                                <div className="flex space-x-4">
                                    <NavLink
                                        to="/home"
                                        className={({ isActive }) =>
                                            isActive
                                                ? "rounded-md bg-white px-3 py-2 text-sm font-medium text-black"
                                                : "rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white hover:text-black"
                                        }
                                        aria-current="page"
                                    >
                                        Home
                                    </NavLink>
                                    <NavLink
                                        to="/task-management"
                                        className={({ isActive }) =>
                                            isActive
                                                ? "rounded-md bg-white px-3 py-2 text-sm font-medium text-black"
                                                : "rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white hover:text-black"
                                        }
                                    >
                                        Task Management
                                    </NavLink>
                                    <NavLink
                                        to="/dashboard"
                                        className={({ isActive }) =>
                                            isActive
                                                ? "rounded-md bg-white px-3 py-2 text-sm font-medium text-black"
                                                : "rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white hover:text-black"
                                        }
                                    >
                                        Dashboard
                                    </NavLink>
                                    <NavLink
                                        to="/timer"
                                        className={({ isActive }) =>
                                            isActive
                                                ? "rounded-md bg-white px-3 py-2 text-sm font-medium text-black"
                                                : "rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white hover:text-black"
                                        }
                                    >
                                        Timer
                                    </NavLink>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex items-center pr-2">
                            <button
                                type="button"
                                className="rounded-full p-1 text-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white"
                            >
                                <span className="sr-only">View notifications</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                                    />
                                </svg>
                            </button>

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
                                            src=""
                                            alt="avatar"
                                        />
                                    </button>
                                </div>

                                {isDropdownOpen && (
                                    <div
                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu-button"
                                    >
                                        <button
                                            onClick={viewProfileClick}
                                            className="w-full px-4 py-2 text-sm text-gray-700 flex items-center justify-center"
                                            role="menuitem">
                                            Your Profile
                                        </button>
                                        <button
                                            onClick={logOutClick}
                                            className="w-full px-4 py-2 text-sm text-gray-700 flex items-center justify-center"
                                            role="menuitem">
                                            Sign out
                                        </button>
                                    </div>

                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;
