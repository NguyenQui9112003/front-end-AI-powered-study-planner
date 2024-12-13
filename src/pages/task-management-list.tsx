import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../layouts/header';

export const TaskManagementPage = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");

    const [data, setData] = useState([
        { id: 1, taskName: "Neeraj", description: 'neeraj@gmail.com', priorityLevel: "high", estimatedTime: "1", status: "true" },
        { id: 2, taskName: "Raj", description: 'raj@gmail.com', priorityLevel: "medium", estimatedTime: "7", status: "false" },
        { id: 3, taskName: "David", description: 'david342@gmail.com', priorityLevel: "low", estimatedTime: "3", status: "false" },
        { id: 4, taskName: "Vikas", description: 'vikas75@gmail.com', priorityLevel: "high", estimatedTime: "10", status: "true" },
    ]);

    const [newRow, setNewRow] = useState({ taskName: "", description: "", priorityLevel: "", estimatedTime: "", status: "" });

    const addRow = () => {
        if (newRow.taskName && newRow.description && newRow.priorityLevel && newRow.estimatedTime && newRow.status) {
            setData([...data, { id: Math.random(), ...newRow }]);
            setNewRow({ taskName: "", description: "", priorityLevel: "", estimatedTime: "", status: "true" });
        }
    };

    const deleteRow = (id: any) => {
        setData(data.filter((row) => row.id !== id));
    };

    const updateRow = (id: any, updatedRow: any) => {
        setData(data.map((row) => (row.id === id ? updatedRow : row)));
    };

    const handleSearchInput = (event: any) => {
        setSearchInput(event.target.value);
    };

    return (
        <div className="">
            <Header></Header>
            <div className="flex flex-1 items-center justify-content-start p-3 pl-0">
                <div className="w-full max-w-lg">
                    <form className="sm:flex sm:items-center">
                        <button
                            onClick={addRow}
                            className="bg-green-500 text-white py-2 font-medium rounded-md sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm min-w-[120px]"
                        >
                            + Add New Task
                        </button>
                        
                        <input id="search-input"
                            name="Search Bar" autoFocus
                            className="inline w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 leading-5 placeholder-gray-400 focus:border-blue-500 focus:placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                            placeholder="Keyword"
                            type="search"
                            value={searchInput}
                            onChange={handleSearchInput}/>
                        <button type="submit" className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Search</button>
                    </form>
                </div>
            </div>

            {/* Table */}
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-200 px-4 py-2">Task Name</th>
                        <th className="border border-gray-200 px-4 py-2">Description</th>
                        <th className="border border-gray-200 px-4 py-2">Priority Level</th>
                        <th className="border border-gray-200 px-4 py-2">Estimated Time</th>
                        <th className="border border-gray-200 px-4 py-2">Status</th>
                        <th className="border border-gray-200 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2">{row.taskName}</td>
                            <td className="border border-gray-200 px-4 py-2">{row.description}</td>
                            <td className="border border-gray-200 px-4 py-2">{row.priorityLevel}</td>
                            <td className="border border-gray-200 px-4 py-2">{row.estimatedTime}</td>
                            <td className="border border-gray-200 px-4 py-2">{row.status}</td>
                            <td className="border border-gray-200 px-4 py-2">
                                <button
                                    onClick={() => deleteRow(row.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded-md mr-2"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() =>
                                        updateRow(row.id, {
                                            ...row,
                                            taskName: prompt("Enter new name", row.taskName) || "",
                                            description: prompt("Enter new position", row.description) || "",
                                            priorityLevel: prompt("Enter new position", row.priorityLevel) || "",
                                            estimatedTime: prompt("Enter new position", row.estimatedTime) || "",
                                            status: prompt("Enter new position", row.status) || "",
                                        })
                                    }
                                    className="bg-blue-500 text-white px-2 py-1 rounded-md"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add new row */}
            <div className="mt-4 flex space-x-2">
                <input
                    type="text"
                    placeholder="Task Name"
                    value={newRow.taskName}
                    onChange={(e) => setNewRow({ ...newRow, taskName: e.target.value })}
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newRow.description}
                    onChange={(e) => setNewRow({ ...newRow, description: e.target.value })}
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
                <input
                    type="text"
                    placeholder="Priority Level"
                    value={newRow.priorityLevel}
                    onChange={(e) => setNewRow({ ...newRow, priorityLevel: e.target.value })}
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
                <input
                    type="text"
                    placeholder="Estimated Time"
                    value={newRow.estimatedTime}
                    onChange={(e) => setNewRow({ ...newRow, estimatedTime: e.target.value })}
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
                <input
                    type="text"
                    placeholder="Status"
                    value={newRow.status}
                    onChange={(e) => setNewRow({ ...newRow, status: e.target.value })}
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
                <button
                    onClick={addRow}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                    Add
                </button>
            </div>
        </div>
    );
}