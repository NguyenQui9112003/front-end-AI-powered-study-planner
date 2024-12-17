import { useRef, useState, useEffect } from 'react';
import Header from '../layouts/header.tsx';
import { toast, ToastContainer } from 'react-toastify';
import { Modal } from "../components/common/modal.tsx"
import { CreateTaskForm } from '../components/features/task-management/CreateTaskForm.tsx';
import { UpdateTaskForm } from '../components/features/task-management/UpdateTaskForm.tsx';
import 'react-toastify/dist/ReactToastify.css';
import { Dropdown } from '../components/common/dropdown.tsx';

type Row = {
    _id: number;
    taskName: string;
    description: string;
    priorityLevel: string;
    estimatedTime: string;
    status: string;
};

export const TaskManagementPage = () => {
    const [openCreateTaskModal, setCreateTaskOpenModal] = useState(false);
    const [openUpdateTaskModal, setUpdateTaskOpenModal] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const formRef = useRef<{ submitForm: () => void } | null>(null);
    const [currentRow, setCurrentRow] = useState<Row | null>(null);
    const [data, setData] = useState<Row[]>([]);
    const [sortOption, setSortOption] = useState<string | null>(null);
    const [filterOption, setFilterOption] = useState<string | null>(null);
    let [processedData, setProcessedData] = useState<Row[]>([]);
    let [searchResult, setSearchResult] = useState<Row[]>([]);

    const defaultValues = currentRow || {
        taskName: "",
        description: "",
        priorityLevel: "",
        estimatedTime: "",
        status: ""
    };

    const handleConfirm = () => {
        if (formRef.current) {
            formRef.current.submitForm();
            fetchTasks();
        }
    };

    const handleUpdateTaskModal = (row: any) => {
        setCurrentRow(row);
        setUpdateTaskOpenModal(true);
    };

    const handleCloseModal = () => {
        if (openCreateTaskModal == true) {
            setCreateTaskOpenModal(false);
        } else if (openUpdateTaskModal == true) {
            setUpdateTaskOpenModal(false);
        }
        fetchTasks();
    };

    const handleSave = (updatedRow: any) => {
        currentRow && updateRow(currentRow._id, updatedRow); // Cập nhật bảng
        setUpdateTaskOpenModal(false); // Đóng modal
    };

    const updateRow = (id: any, updatedRow: any) => {
        setData(data.map((row) => (row._id === id ? updatedRow : row)));
    };

    const handleFilterAndSort = () => {
        console.log(filterOption);
        const priorityMap: { [key: string]: number } = {
            High: 3,
            Medium: 2,
            Low: 1,
        };

        processedData = [...data];

        if (filterOption === "Completed") {
            processedData = processedData.filter((item) => item.status === "Completed");
        } else if (filterOption === "Todo") {
            processedData = processedData.filter((item) => item.status === "Todo");
        } else if (filterOption === "In Process") {
            processedData = processedData.filter((item) => item.status === "In Process");
        } else if (sortOption === "Filter: Default") {
            // default
        }

        if (sortOption === "Ascending") {
            processedData.sort((a, b) => priorityMap[a.priorityLevel] - priorityMap[b.priorityLevel]);
        } else if (sortOption === "Descending") {
            processedData.sort((a, b) => priorityMap[b.priorityLevel] - priorityMap[a.priorityLevel]);
        } else if (sortOption === "Sort: Default") {
            // default
        }
        setProcessedData(processedData);
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:3000/tasks', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setData(data);

        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    // reload data
    useEffect(() => {
        fetchTasks();
    }, []);

    const deleteTask = async (taskName: string) => {
        try {
            let response = await fetch('http://localhost:3000/tasks/delete', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ taskName })
            });

            if (!response.ok) {
                toast.error(`Error: ${response.statusText}: Can't delete this task`, {
                    position: 'top-right',
                });
            } else {
                toast.success("Task deleted successfully", {
                    position: 'top-right',
                });
                fetchTasks();
            }

        } catch (error) {
            toast.error('Server: An unexpected error occurred.', {
                position: 'top-right',
            });
        }
    }

    const handleSearchInputChange = (event: any) => {
        setSearchInput(event.target.value); // Cập nhật giá trị của input vào state
    };

    const handleSearchSubmit = async (event: any) => {
        event.preventDefault();

        if (searchInput.trim() === '') {
            fetchTasks();
            return;
        }

        try {
            let data = { searchString: searchInput };
            console.log(data);
            let response = await fetch('http://localhost:3000/tasks/find', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                toast.error(`Error: ${response.statusText}: Find result failed`, {
                    position: 'top-right',
                });
            } else {
                const result = await response.json();

                if (result && result.length > 0) {
                    console.log(result);
                    setSearchResult(result);
                } else {
                    console.log(1);
                    toast.warning("Can't find result.", {
                        position: 'top-right',
                    });
                }
            }

        } catch (error) {
            toast.error('Server: An unexpected error occurred.', {
                position: 'top-right',
            });
        }
    };

    // const [newRow, setNewRow] = useState({ taskName: "", description: "", priorityLevel: "", estimatedTime: "", status: "" });

    // const addRow = () => {
    //     if (newRow.taskName && newRow.description && newRow.priorityLevel && newRow.estimatedTime && newRow.status) {
    //         setData([...data, { id: Math.random() }]);
    //         setNewRow({ taskName: "", description: "", priorityLevel: "", estimatedTime: "", status: "true" });
    //     }
    // };

    // const deleteRow = (id: any) => {
    //     setData(data.filter((row) => row.id !== id));
    // };

    return (
        <div className="">
            <Header></Header>
            <ToastContainer />
            <div className="flex flex-1 items-center justify-content-start p-3 pl-0">
                <div className="flex flex-row">
                    <button
                        onClick={() => setCreateTaskOpenModal(!openCreateTaskModal)}
                        className="bg-green-500 text-white py-2 font-medium rounded-md sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm min-w-[120px]"
                    >
                        + Add New Task
                    </button>

                    <form onSubmit={handleSearchSubmit} className="flex items-center">
                        <input id="search-input"
                            name="Search Bar" autoFocus
                            className="inline w-64 rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 leading-5 placeholder-gray-400 focus:border-blue-500 focus:placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                            placeholder="Keyword"
                            type="search"
                            value={searchInput}
                            onChange={handleSearchInputChange} />
                        <button type="submit" className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Search</button>
                    </form>

                    <Dropdown
                        options={["Sort: Default", "Ascending", "Descending"]}
                        onSelect={(option) => setSortOption(option)}
                        placeholder="Sort"
                        value={sortOption}
                    />

                    <Dropdown
                        options={["Filter: Default", "Completed", "In Process", "Todo"]}
                        onSelect={(option) => setFilterOption(option)}
                        placeholder="Filter"
                        value={filterOption}
                    />

                    <button onClick={() => handleFilterAndSort()} className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Sort & Filter</button>
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
                    {(searchResult.length > 0 ? searchResult :
                        (processedData.length > 0 ? processedData : 
                        (data.length > 0 ? data : []))).map((row) => (
                        <tr key={row._id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2">{row.taskName}</td>
                            <td className="border border-gray-200 px-4 py-2">{row.description}</td>
                            <td className="border border-gray-200 px-4 py-2">{row.priorityLevel}</td>
                            <td className="border border-gray-200 px-4 py-2">{row.estimatedTime}</td>
                            <td className="border border-gray-200 px-4 py-2">{row.status}</td>
                            <td className="border border-gray-200 px-4 py-2">
                                <button
                                    onClick={() => handleUpdateTaskModal(row)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded-md w-[70px]"
                                >
                                    Update
                                </button>

                                <button
                                    onClick={() => deleteTask(row.taskName)}
                                    className="bg-red-500 text-white px-2 py-1 rounded-md ml-2 w-[70px]"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal isOpen={openCreateTaskModal} onClose={handleCloseModal}>
                <Modal.Header>
                    <div className="text-blue-500 font-bold text-2xl mb-3 text-center">Create Your Task</div>
                </Modal.Header>
                <Modal.Body>
                    <CreateTaskForm ref={formRef}></CreateTaskForm>
                </Modal.Body>
                <Modal.Footer>
                    <div className='flex justify-end'>
                        <Modal.DismissButton className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-1">Close</Modal.DismissButton>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-1" onClick={handleConfirm}>Confirm</button>
                    </div>
                </Modal.Footer>
            </Modal>

            <Modal isOpen={openUpdateTaskModal} onClose={handleCloseModal}>
                <Modal.Header>
                    <div className="text-blue-500 font-bold text-2xl mb-3 text-center">Update Your Task</div>
                </Modal.Header>
                <Modal.Body>
                    <UpdateTaskForm ref={formRef} defaultValues={defaultValues} onSave={handleSave}></UpdateTaskForm>
                </Modal.Body>
                <Modal.Footer>
                    <div className='flex justify-end'>
                        <Modal.DismissButton className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-1">Close</Modal.DismissButton>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-1" onClick={handleConfirm}>Save Changes</button>
                    </div>
                </Modal.Footer>
            </Modal>

            {/* Add new row */}

            {/* <div className="mt-4 flex space-x-2">
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
            </div> */}
        </div >
    );
}