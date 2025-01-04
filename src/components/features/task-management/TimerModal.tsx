import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import { toast } from 'react-toastify';

import { Modal } from '@/components/common/modal';
import { TimerForm } from './TimerForm';

import { Task } from '@/types/taskType';
import { FocusSession } from '@/types/focusSessionType';
import { AuthError, authFetch } from '@/helpers/utility/authFetch';

interface TimerModalProps {
	isOpen: boolean;
	onClose: () => void;
	defaultValues: Task;
}

export const TimerModal = ({
	isOpen,
	onClose,
	defaultValues,
}: TimerModalProps) => {
	const navigate = useNavigate();

	const [isRunning, setIsRunning] = useState(false); // Trạng thái của bộ đếm
	const [timeElapsed, setTimeElapsed] = useState(0); // Thời gian đã trôi qua (tính bằng giây)
	const intervalRef = useRef<NodeJS.Timeout | null>(null); // Dùng để lưu trữ ID của interval

	// Cập nhật thời gian sau mỗi giây
	useEffect(() => {
		if (isRunning) {
			intervalRef.current = setInterval(() => {
				setTimeElapsed((prevTime) => prevTime + 1);
			}, 1000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current); // Dừng bộ đếm khi không chạy
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current); // Dọn dẹp khi component bị hủy
			}
		};
	}, [isRunning]);

	const onSubmit = async () => {
		try {
			if (!defaultValues._id) {
				toast.error("Task invalid, please refresh.");
				onClose();
				return;
			}
			
			const payload: FocusSession = {
				taskId: defaultValues._id,
				breakTime: 0,
				studyTime: 0,
			};

			const response = await authFetch(
				'http://localhost:3000/focus-session/create',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Server error');
			}

			onClose();
		} catch (error) {
			if (error instanceof AuthError) {
				navigate('/signIn');
			}
			console.error('Server: Failed request.');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<Modal.Header>
				<div className="text-blue-500 font-bold text-2xl mb-3 text-center">
					Timer&nbsp;&nbsp;&nbsp;
				</div>
			</Modal.Header>
			<Modal.Body>
				<TimerForm
					defaultValues={defaultValues}
					timeElapsed={timeElapsed}
					isRunning={isRunning}
					setIsRunning={setIsRunning}
				/>
			</Modal.Body>
			<Modal.Footer>
				<div className="flex justify-end mt-3">
					<Modal.DismissButton className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-1">
						Close
					</Modal.DismissButton>
					<button
						className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-1"
						onClick={onSubmit}
					>
						End
					</button>
				</div>
			</Modal.Footer>
		</Modal>
	);
};
