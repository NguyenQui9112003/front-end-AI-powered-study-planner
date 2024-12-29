/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Modal } from '../components/common/modal.tsx';
import { Dropdown } from '../components/common/dropdown.tsx';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

import { Task } from '@/types/taskType.tsx';

import Header from '../layouts/header.tsx';
import { CreateTaskForm } from '../components/features/task-management/CreateTaskForm.tsx';
import { UpdateTaskForm } from '../components/features/task-management/UpdateTaskForm.tsx';
import { AISuggestion } from '@/components/features/ai/AISuggestion.tsx';

interface CustomJwtPayload {
	email: string;
	// other props
}

export const TaskManagementPage = () => {
	const token = window.localStorage.getItem('token');
	const parsedToken = token ? JSON.parse(token) : null;
	const accessToken = parsedToken.access_token;
	const decodedToken = jwtDecode<CustomJwtPayload>(accessToken);

	const [openCreateTaskModal, setCreateTaskOpenModal] = useState(false);
	const [openUpdateTaskModal, setUpdateTaskOpenModal] = useState(false);
	const formRef = useRef<{ submitForm: () => void } | null>(null);

	const [data, setData] = useState<Task[]>([]);
	const [currentTask, setCurrentTask] = useState<Task | null>(null);

	const [sortOption, setSortOption] = useState<string | null>(null);
	const [filterOption, setFilterOption] = useState<string | null>(null);
	const [processedData, setProcessedData] = useState<Task[]>([]);

	const [searchInput, setSearchInput] = useState('');
	const [searchResult, setSearchResult] = useState<Task[]>([]);

	const defaultValues = currentTask || {
		taskName: '',
		description: '',
		priorityLevel: '',
		startDate: null,
		endDate: null,
		status: '',
	};

	const handleConfirm = () => {
		if (formRef.current) {
			formRef.current.submitForm();
			fetchTasks();
		}
	};

	const handleUpdateTaskModal = (task: any) => {
		setCurrentTask(task);
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

	const handleSave = (updatedTask: any) => {
		if (currentTask) updateTask(currentTask._id, updatedTask); // Cập nhật bảng
		setUpdateTaskOpenModal(false); // Đóng modal
	};

	const updateTask = (id: any, updatedTask: any) => {
		setData(data.map((task) => (task._id === id ? updatedTask : task)));
	};

	const handleFilterAndSort = () => {
		console.log(filterOption);
		const priorityMap: { [key: string]: number } = {
			High: 3,
			Medium: 2,
			Low: 1,
		};

		let newProcessedData = [...data];

		if (filterOption === 'Completed') {
			newProcessedData = newProcessedData.filter(
				(item) => item.status === 'Completed'
			);
		} else if (filterOption === 'Todo') {
			newProcessedData = newProcessedData.filter(
				(item) => item.status === 'Todo'
			);
		} else if (filterOption === 'In Process') {
			newProcessedData = newProcessedData.filter(
				(item) => item.status === 'In Process'
			);
		} else if (sortOption === 'Filter: Default') {
			// default
		}

		if (sortOption === 'Ascending') {
			newProcessedData.sort(
				(a, b) =>
					priorityMap[a.priorityLevel] - priorityMap[b.priorityLevel]
			);
		} else if (sortOption === 'Descending') {
			newProcessedData.sort(
				(a, b) =>
					priorityMap[b.priorityLevel] - priorityMap[a.priorityLevel]
			);
		} else if (sortOption === 'Sort: Default') {
			// default
		}
		setProcessedData(newProcessedData);
	};

	const fetchTasks = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/tasks?userName=${encodeURIComponent(
					decodedToken.email
				)}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
					},
				}
			);

			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}

			const data = await response.json();
			setData(data);
			setProcessedData(data);
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
			const response = await fetch('http://localhost:3000/tasks/delete', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({ email: decodedToken.email, taskName }),
			});

			if (!response.ok) {
				toast.error(
					`Error: ${response.statusText}: Can't delete this task`,
					{
						position: 'top-right',
					}
				);
			} else {
				toast.success('Task deleted successfully', {
					position: 'top-right',
				});
				fetchTasks();
			}
		} catch (error) {
			toast.error('Server: An unexpected error occurred.', {
				position: 'top-right',
			});
		}
	};

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
			const data = { searchString: searchInput };
			console.log(data);
			const response = await fetch('http://localhost:3000/tasks/find', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				toast.error(
					`Error: ${response.statusText}: Find result failed`,
					{
						position: 'top-right',
					}
				);
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

	// const [newTask, setNewTask] = useState({ taskName: "", description: "", priorityLevel: "", estimatedTime: "", status: "" });

	// const addTask = () => {
	//     if (newTask.taskName && newTask.description && newTask.priorityLevel && newTask.estimatedTime && newTask.status) {
	//         setData([...data, { id: Math.random() }]);
	//         setNewTask({ taskName: "", description: "", priorityLevel: "", estimatedTime: "", status: "true" });
	//     }
	// };

	// const deleteTask = (id: any) => {
	//     setData(data.filter((Task) => Task.id !== id));
	// };

	return (
		<div className="">
			<Header />
			<ToastContainer />
			<div className="flex flex-1 items-center justify-content-start p-3 pl-0">
				<div className="flex flex-Task">
					<button
						onClick={() =>
							setCreateTaskOpenModal(!openCreateTaskModal)
						}
						className="bg-green-500 text-white py-2 font-medium rounded-md sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm min-w-[120px]"
					>
						+ Add New Task
					</button>

					<form
						onSubmit={handleSearchSubmit}
						className="flex items-center"
					>
						<input
							id="search-input"
							name="Search Bar"
							autoFocus
							className="inline w-64 rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 leading-5 placeholder-gray-400 focus:border-blue-500 focus:placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
							placeholder="Keyword"
							type="search"
							value={searchInput}
							onChange={handleSearchInputChange}
						/>
						<button
							type="submit"
							className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
						>
							Search
						</button>
					</form>

					<Dropdown
						options={['Sort: Default', 'Ascending', 'Descending']}
						onSelect={(option) => setSortOption(option)}
						placeholder="Sort"
						value={sortOption}
					/>

					<Dropdown
						options={[
							'Filter: Default',
							'Completed',
							'In Process',
							'Todo',
						]}
						onSelect={(option) => setFilterOption(option)}
						placeholder="Filter"
						value={filterOption}
					/>

					<button
						onClick={() => handleFilterAndSort()}
						className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					>
						Sort & Filter
					</button>
				</div>
			</div>

			{/* Table */}
			<table className="table-auto w-full border-collapse border border-gray-300">
				<thead>
					<tr className="bg-gray-200">
						<th className="border border-gray-200 px-4 py-2">
							Task Name
						</th>
						<th className="border border-gray-200 px-4 py-2">
							Description
						</th>
						<th className="border border-gray-200 px-4 py-2">
							Priority Level
						</th>
						<th className="border border-gray-200 px-4 py-2">
							Estimated Time
						</th>
						<th className="border border-gray-200 px-4 py-2">
							Status
						</th>
						<th className="border border-gray-200 px-4 py-2">
							Action
						</th>
					</tr>
				</thead>
				<tbody>
					{(searchResult.length > 0
						? searchResult
						: processedData.length > 0
						    ? processedData 
							: []
					).map((task) => (
						<tr key={task._id} className="hover:bg-gray-50">
							<td className="border border-gray-200 px-4 py-2">
								{task.taskName}
							</td>
							<td className="border border-gray-200 px-4 py-2">
								{task.description}
							</td>
							<td className="border border-gray-200 px-4 py-2">
								{task.priorityLevel}
							</td>
							<td className="border border-gray-200 px-4 py-2">
								{dayjs(task.startDate).format(
									'HH:mm:ss DD/MM/YYYY'
								)}{' '}
								-{' '}
								{dayjs(task.endDate).format(
									'HH:mm:ss DD/MM/YYYY'
								)}
							</td>
							<td className="border border-gray-200 px-4 py-2">
								{task.status}
							</td>
							<td className="border border-gray-200 px-4 py-2">
								<button
									onClick={() => handleUpdateTaskModal(task)}
									className="bg-blue-500 text-white px-2 py-1 rounded-md w-[70px]"
								>
									Update
								</button>

								<button
									onClick={() => deleteTask(task.taskName)}
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
					<div className="text-blue-500 font-bold text-2xl mb-3 text-center">
						Create Your Task
					</div>
				</Modal.Header>
				<Modal.Body>
					<CreateTaskForm
						ref={formRef}
						user={decodedToken.email}
					></CreateTaskForm>
				</Modal.Body>
				<Modal.Footer>
					<div className="flex justify-end">
						<Modal.DismissButton className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-1">
							Close
						</Modal.DismissButton>
						<button
							className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-1"
							onClick={handleConfirm}
						>
							Confirm
						</button>
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

            <AISuggestion tasks={processedData} />

			{/* Add new Task */}

			{/* <div className="mt-4 flex space-x-2">
                <input
                    type="text"
                    placeholder="Task Name"
                    value={newTask.taskName}
                    onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
                <input
                    type="text"
                    placeholder="Priority Level"
                    value={newTask.priorityLevel}
                    onChange={(e) => setNewTask({ ...newTask, priorityLevel: e.target.value })}
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
                <input
                    type="text"
                    placeholder="Estimated Time"
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({ ...newTask, estimatedTime: e.target.value })}
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
                <input
                    type="text"
                    placeholder="Status"
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
                <button
                    onClick={addTask}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                    Add
                </button>
            </div> */}
        </div >
    );
}