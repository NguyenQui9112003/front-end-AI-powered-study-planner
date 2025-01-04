import dayjs from 'dayjs';

import { Task } from '@/types/taskType';
type FocusTimeProps = {
	timeElapsed: number;
	defaultValues: Task;
	isRunning: boolean;
	setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TimerForm = ({
	defaultValues,
	timeElapsed,
	isRunning,
	setIsRunning,
}: FocusTimeProps) => {
	// Hàm format thời gian theo định dạng hh:mm:ss
	const formatTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
			2,
			'0'
		)}:${String(secs).padStart(2, '0')}`;
	};

	return (
		<>
			<div className="">{defaultValues.taskName}</div>
			<div className="">
				From{' '}
				{dayjs(defaultValues.startDate).format('HH:mm:ss DD/MM/YYYY')}
			</div>
			<div className="">
				To {dayjs(defaultValues.endDate).format('HH:mm:ss DD/MM/YYYY')}
			</div>
			<div className="flex flex-row justify-center">
				<div className="div">{defaultValues.status}</div>
				<div>&nbsp;-&nbsp;</div>
				<div className="div">{defaultValues.priorityLevel}</div>
			</div>
			<hr className="my-4 w-1/2 mx-auto border-t-2 border-gray-300" />

			{/* Hiển thị thời gian đã trôi qua */}
			<div className="text-center mt-4">
				<p className="text-xl font-semibold">
					Focus time: {formatTime(timeElapsed)}
				</p>
			</div>

			{/* Nút bắt đầu/tạm dừng */}
			<div className="flex justify-center mt-4">
				<button
					className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-1`}
					onClick={() => setIsRunning((prevState) => !prevState)}
				>
					{isRunning ? 'Pause' : 'Start'}
				</button>
			</div>
		</>
	);
};
