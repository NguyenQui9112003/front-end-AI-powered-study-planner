/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import dayjs from 'dayjs';
import 'react-toastify/dist/ReactToastify.css';

import { Task } from '@/types/taskType.tsx';
import { getTokenData } from '@/helpers/utility/tokenData.ts';
import { Dropdown } from '../components/common/dropdown.tsx';

import Header from '../layouts/header.tsx';

import { AISuggestion } from '@/components/features/ai/AISuggestion.tsx';

export const TaskManagementPage = () => {
	const user = getTokenData().username;

	const navigate = useNavigate();

	const [dataFetch, setDataFetch] = useState<Task[]>([]);
	const [currentTask, setCurrentTask] = useState<Task | null>(null);

	const [openCreateTaskModal, setCreateTaskOpenModal] = useState(false);
	const [openUpdateTaskModal, setUpdateTaskOpenModal] = useState(false);
	const [openTimerModal, setTimerOpenModal] = useState(false);

	const [sortOption, setSortOption] = useState<string | null>('Sort');
	const [filterOption, setFilterOption] = useState<string | null>('Filter');
	const [processedData, setProcessedData] = useState<Task[]>([]);

	const [searchInput, setSearchInput] = useState('');

	const defaultValues = currentTask || {
		taskName: '',
		description: '',
		timeFocus: '0',
		priorityLevel: '',
		startDate: null,
		endDate: null,
		status: '',
	};

	// close modal
	const handleCloseModal = () => {
		if (openCreateTaskModal == true) {
			setCreateTaskOpenModal(false);
		} else if (openUpdateTaskModal == true) {
			setUpdateTaskOpenModal(false);
		} else if (openTimerModal == true) {
			setTimerOpenModal(false);
		}
		fetchTasks();
	};

	// create task modal
	const handleCreateTask = (task: Task) => {
		setDataFetch([...dataFetch, task]);
		return () => {
			setDataFetch(dataFetch);
		};
	};

	// update task modal
	const handleUpdateTaskModal = (task: any) => {
		setCurrentTask(task);
		setUpdateTaskOpenModal(true);
	};

	// focus timer modal
	const handleTimerModal = (task: any) => {
		setCurrentTask(task);
		setTimerOpenModal(true);
	};

	// render task table
	const handleSave = (updatedTask: any) => {
		if (currentTask) updateTask(updatedTask, currentTask._id); // Cập nhật bảng
		setUpdateTaskOpenModal(false); // Đóng modal
	};

	const updateTask = (id: any, updatedTask: any) => {
		setDataFetch(
			dataFetch.map((task) => (task._id === id ? updatedTask : task))
		);
	};

	const fetchTasks = async () => {
		try {
			const response = await authFetch(
				`http://localhost:3000/tasks?userName=${encodeURIComponent(
					user
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
			setDataFetch(data);
			applyFilterSortSearch(data);
		} catch (error) {
			if (error instanceof AuthError) {
				console.error(error);
				navigate('/signIn');
			}
			console.error('Error fetching profile:', error);
		}
	};

	const deleteTask = async (taskName: string) => {
		try {
			const response = await fetch('http://localhost:3000/tasks/delete', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					username: user,
					taskName,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Server error');
			} else {
				fetchTasks();
			}
		} catch (error) {
			console.error('Server: Failed request.');
			if (error instanceof Error) {
				toast.error(error.message, {
					position: 'top-right',
				});
			} else {
				toast.error('Server: An unexpected error occurred.', {
					position: 'top-right',
				});
			}
		}
	};

	const applyFilterSortSearch = (data: Task[]) => {
		let baseData = [...data];
		// filter
		if (filterOption !== 'Filter: Default') {
			baseData = baseData.filter((item) => {
				const filterList = ['Completed', 'Todo', 'In Progress', 'Expired']
				
				for (const filter of filterList) {
					if (filterOption === filter)
						return item.status === filter;
				}

				return true;
			});
		}

		// sort
		const priorityMap: { [key: string]: number } = {
			High: 3,
			Medium: 2,
			Low: 1,
		};
		if (sortOption === 'Ascending') {
			baseData.sort(
				(a, b) =>
					priorityMap[a.priorityLevel] - priorityMap[b.priorityLevel]
			);
		} else if (sortOption === 'Descending') {
			baseData.sort(
				(a, b) =>
					priorityMap[b.priorityLevel] - priorityMap[a.priorityLevel]
			);
		}

		// search
		if (searchInput.trim() !== '') {
			baseData = baseData.filter((item) =>
				Object.values(item).some((value) =>
					value
						.toString()
						.toLowerCase()
						.includes(searchInput.toLowerCase())
				)
			);
		}
		setProcessedData(baseData);
	};

	const handleSearchInputChange = (event: any) => {};

	const handleSearchSubmit = async (event: any) => {
		applyFilterSortSearch(dataFetch);
	};

	useEffect(() => {
		fetchTasks();
	}, []);

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
							placeholder="Search task"
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
						options={['Default', 'Ascending', 'Descending']}
						onSelect={(option) => setSortOption(option)}
						value={sortOption}
					/>

					<Dropdown
						options={[
							'Filter: Default',
							'Completed',
							'In Progress',
							'Todo',
						]}
						onSelect={(option) => setFilterOption(option)}
						placeholder="Filter"
						value={filterOption}
					/>

					<button
						onClick={() => applyFilterSortSearch(dataFetch)}
						className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
					>
						Sort & Filter
					</button>
				</div>
			</div>

			<table className="border-collapse border border-black w-full">
				<thead>
					<tr className="bg-gray-200">
						<th className="border border-gray-200 px-2 py-2">
							Task
						</th>
						<th className="border border-gray-200 px-2 py-2 truncate">
							Description
						</th>
						<th className="border border-gray-200 px-2 py-2 w-[96px]">
							Priority
						</th>
						<th className="border border-gray-200 px-2 py-2 w-[400px]">
							Time
						</th>
						<th className="border border-gray-200 px-2 py-2 w-[96px]">
							Status
						</th>
						<th className="border border-gray-200 px-2 py-2 w-[192px]">
							Action
						</th>
					</tr>
				</thead>
				<tbody>
					{processedData.map((task) => (
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
								<div className="flex flex-row justify-center">
									{dayjs(task.startDate).format(
										'HH:mm:ss DD/MM/YYYY'
									)}{' '}
									-{' '}
									{dayjs(task.endDate).format(
										'HH:mm:ss DD/MM/YYYY'
									)}
								</div>
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

								<button
									onClick={() => handleTimerModal(task)}
									className="bg-green-500 text-white px-2 py-1 rounded-md ml-2 w-[70px]"
								>
									Timer
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
					<div className="text-blue-500 font-bold text-2xl mb-3 text-center">
						Update Your Task
					</div>
				</Modal.Header>
				<Modal.Body>
					<UpdateTaskForm
						ref={formRef}
						defaultValues={defaultValues}
						onSave={handleSave}
					></UpdateTaskForm>
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
							Save Changes
						</button>
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
		</div>
	);
};
