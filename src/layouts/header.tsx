import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../helpers/context/authProvider';
import { useState } from 'react';

export const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const logOutClick = () => {
        logout();
        navigate(`/signIn`);
    };

    const viewProfileClick = () => {
        navigate(`/profile`);
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
                            <span className="ml-3 flex shrink-0 items-center">
                                <img
                                    className="h-10 w-auto"
                                    src="..\assets\ailogo.png"
                                    alt="Logo"/>
                            </span>

                            <div className="ml-6 block">
                                <div className="flex space-x-4">
                                    <NavLink
                                        to="/home"
                                        className={({ isActive }) =>
                                            isActive
                                                ? "rounded-md bg-white px-3 py-2 text-sm font-medium text-black"
                                                : "rounded-md px-3 py-2 text-sm font-medium hover:text-black  text-white hover:bg-white "}
                                        aria-current="page">
                                        Home
                                    </NavLink>
                                    <NavLink
                                        to="/task-management"
                                        className={({ isActive }) =>
                                            isActive
                                                ? "rounded-md bg-white px-3 py-2 text-sm font-medium text-black"
                                                : "rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white hover:text-black "}>
                                        Task Management
                                    </NavLink>
                                    <NavLink
                                        to="/analyze"
                                        className={({ isActive }) =>
                                            isActive
                                                ? "rounded-md bg-white px-3 py-2 text-sm font-medium text-black"
                                                : "rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white hover:text-black  "}>
                                        Analyze
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
                                            className="h-8 w-8 border-2 border-white rounded-full"
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
