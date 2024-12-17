import React, { useState, useRef, useEffect } from "react";

type DropdownProps<T> = {
    options: T[]; // Mảng các giá trị để hiển thị
    onSelect: (selected: T) => void; // Hàm callback trả về giá trị đã chọn
    placeholder?: string; // Placeholder hiển thị khi chưa chọn gì
    renderOption?: (option: T) => React.ReactNode; // Tùy chỉnh cách hiển thị từng tùy chọn
    value: T | null; // Giá trị hiện tại đã chọn
};

export const Dropdown = <T extends string | number>({
    options,
    onSelect,
    placeholder = "Select an option",
    renderOption,
    value,
}: DropdownProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (option: T) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="w-32 rounded-md mt-0 ml-3 text-sm font-medium" ref={dropdownRef}>
            <div
                className="border border-gray-300 rounded-md px-4 py-2 bg-white cursor-pointer"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {value ? renderOption?.(value) ?? value : placeholder}
            </div>
            {isOpen && (
                <ul className="absolute mt-1 w-32 border border-gray-300 rounded-md bg-white shadow-md max-h-60 overflow-y-auto z-10">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSelect(option)}
                        >
                            {renderOption?.(option) ?? option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
