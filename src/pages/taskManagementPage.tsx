/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import dayjs from 'dayjs';
import 'react-toastify/dist/ReactToastify.css';

import { Task } from '@/types/taskType.tsx';
import { getTokenData } from '@/helpers/utility/tokenData.ts';

import { Modal } from '../components/common/modal.tsx';
import { Dropdown } from '../components/common/dropdown.tsx';

import Header from '../layouts/header.tsx';

// import { TimerForm } from '@/components/features/task-management/TimerForm.tsx';
import { CreateTaskForm } from '../components/features/task-management/CreateTaskForm.tsx';
import { UpdateTaskForm } from '../components/features/task-management/UpdateTaskForm.tsx';

import { AISuggestion } from '@/components/features/ai/AISuggestion.tsx';

export const TaskManagementPage = () => {
	const user = getTokenData().username;

	const [dataFetch, setDataFetch] = useState<Task[]>([]);
	const [currentTask, setCurrentTask] = useState<Task | null>(null);

	const [openCreateTaskModal, setCreateTaskOpenModal] = useState(false);
	const [openUpdateTaskModal, setUpdateTaskOpenModal] = useState(false);
	// const [openTimerModal, setTimerOpenModal] = useState(false);
	const formRef = useRef<{ submitForm: () => void } | null>(null);

	const [sortOption, setSortOption] = useState<string | null>("Sort");
	const [filterOption, setFilterOption] = useState<string | null>("Filter");
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
		}
		// } else if (openTimerModal == true) {
		// 	setTimerOpenModal(false);
		// }
		fetchTasks();
	};

	// create task modal
	const handleCreateTask = () => {
		if (formRef.current) {
			formRef.current.submitForm();
			fetchTasks();
		}
	};

	// update task modal
	const handleUpdateTaskModal = (task: any) => {
		setCurrentTask(task);
		setUpdateTaskOpenModal(true);
	};

	const handleUpdateTask = () => {
		if (formRef.current) {
			formRef.current.submitForm();
			fetchTasks();
		}
	};

	// focus timer modal
	// const handleTimerModal = (task: any) => {
	// 	setCurrentTask(task);
	// 	setTimerOpenModal(true);
	// };

	// const handleSession = () => {
	// 	if (formRef.current) {
	// 		formRef.current.submitForm();
	// 		fetchTasks();
	// 	}
	// 	setTimerOpenModal(false);
	// };

	// render task table
	const handleSave = (updatedTask: any) => {
		if (currentTask) updateTask(currentTask._id, updatedTask); // Cập nhật bảng
		setUpdateTaskOpenModal(false); // Đóng modal
	};

	const updateTask = (id: any, updatedTask: any) => {
		setDataFetch(dataFetch.map((task) => (task._id === id ? updatedTask : task)));
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	const fetchTasks = async () => {
		try {
			const response = await fetch(
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
			setProcessedData(data);
		} catch (error) {
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
				body: JSON.stringify({ username: user, taskName }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Server error');
			} else {
				fetchTasks();
			}

		} catch (error) {
			console.error("Server: Failed request.");
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
	}

	const applyFilterSortSearch = () => {
		let baseData = [...dataFetch]; 
		// filter
		if (filterOption !== 'Filter: Default') {
			baseData = baseData.filter((item) => {
				if (filterOption === 'Completed') return item.status === 'Completed';
				if (filterOption === 'Todo') return item.status === 'Todo';
				if (filterOption === 'In Progress') return item.status === 'In Progress';
				if (filterOption === 'Expired') return item.status === 'Expired';
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
				(a, b) => priorityMap[a.priorityLevel] - priorityMap[b.priorityLevel]
			);
		} else if (sortOption === 'Descending') {
			baseData.sort(
				(a, b) => priorityMap[b.priorityLevel] - priorityMap[a.priorityLevel]
			);
		}

		// search
		if (searchInput.trim() !== '') {
			baseData = baseData.filter((item) =>
				Object.values(item).some((value) =>
					value.toString().toLowerCase().includes(searchInput.toLowerCase())
				)
			);
		}
		setProcessedData(baseData);
	};

	useEffect(() => {
		applyFilterSortSearch();
	}, [filterOption, sortOption, searchInput]);


	const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		applyFilterSortSearch(); 
	};

	return (
		<div className="">
			<Header />
			<ToastContainer />
			<div className="flex flex-1 items-center justify-content-start p-3 pl-0">
				<div className="flex flex-Task">
					<button
						onClick={() =>
							setCreateTaskOpenModal(!openCreateTaskModal)}
						className="bg-green-500 text-white py-2 font-medium rounded-md sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm min-w-[120px]">
						+ Add New Task
					</button>

					<form
						onSubmit={handleSearchSubmit}
						className="flex items-center">
						<input
							id="search-input"
							name="Search Bar"
							autoFocus
							className="inline w-64 rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 leading-5 placeholder-gray-400 focus:border-blue-500 focus:placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
							placeholder="Search task"
							type="search"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)} />
					</form>

					<Dropdown
						options={['Default', 'Ascending', 'Descending']}
						onSelect={(option) => setSortOption(option)}
						value={sortOption} />

					<Dropdown
						options={['Default', 'Todo', 'In Progress', 'Completed', 'Expired']}
						onSelect={(option) => setFilterOption(option)}
						value={filterOption} />
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
						<th className="border border-gray-200 px-2 py-2 w-[200px]">
							Action
						</th>
					</tr>
				</thead>
				<tbody>
					{(processedData.length > 0 ? processedData : dataFetch).map((task) => (
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
								<div className='flex flex-row justify-center'>
									{dayjs(task.startDate).format('HH:mm:ss DD/MM/YYYY')}
									{' '}-{' '}
									{dayjs(task.endDate).format('HH:mm:ss DD/MM/YYYY')}
								</div>
							</td>
							<td className="border border-gray-200 px-4 py-2">
								{task.status}
							</td>

							<td className="border border-gray-200 px-4 py-2">
								<button
									onClick={() => handleUpdateTaskModal(task)}
									className="bg-blue-500 text-white px-2 py-1 rounded-md w-[70px]">
									Update
								</button>

								<button
									onClick={() => deleteTask(task.taskName)}
									className="bg-red-500 text-white px-2 py-1 rounded-md ml-2 w-[70px]">
									Delete
								</button>

								{/* <button
									onClick={() => handleTimerModal(task)}
									className="bg-green-500 text-white px-2 py-1 rounded-md ml-2 w-[70px]">
									Timer
								</button> */}
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
						user={user}
					></CreateTaskForm>
				</Modal.Body>
				<Modal.Footer>
					<div className="flex justify-end">
						<Modal.DismissButton className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-1">
							Close
						</Modal.DismissButton>
						<button
							className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-1"
							onClick={handleCreateTask}
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
					<UpdateTaskForm ref={formRef} defaultValues={defaultValues} onSave={handleSave} user={user}></UpdateTaskForm>
				</Modal.Body>
				<Modal.Footer>
					<div className='flex justify-end'>
						<Modal.DismissButton className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-1">Close</Modal.DismissButton>
						<button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-1" onClick={handleUpdateTask}>Save Changes</button>
					</div>
				</Modal.Footer>
			</Modal>

			<AISuggestion tasks={processedData} />

			{/* <Modal isOpen={openTimerModal} onClose={handleCloseModal}>
				<Modal.Header>
					<div className="text-blue-500 font-bold text-2xl mb-3 text-center">Timer&nbsp;&nbsp;&nbsp;</div>
				</Modal.Header>
				<Modal.Body>
					<TimerForm ref={formRef} defaultValues={defaultValues} user={user}></TimerForm>
				</Modal.Body>
				<Modal.Footer>
					<div className='flex justify-end mt-3'>
						<Modal.DismissButton className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-1">Close</Modal.DismissButton>
						<button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-1" onClick={handleSession}>End</button>
					</div>
				</Modal.Footer>
			</Modal> */}
		</div >
	);
}
