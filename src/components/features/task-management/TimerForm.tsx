import dayjs from 'dayjs';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useImperativeHandle, forwardRef, useState, useRef } from 'react';

import { Task } from '@/types/taskType';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '@/helpers/utility/authFetch';

type FocusTimeProps = {
    defaultValues: Task;
    user: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TimerForm = forwardRef<any, FocusTimeProps>(
    ({ defaultValues, user }, ref) => {
        type Inputs = {
            username: string;
            taskName: string;
            description: string;
            priorityLevel: string;
            time: string;
            startDate: Date | string | null;
            endDate: Date | string | null;
            status: string;
        };

        const navigate = useNavigate();

        const { handleSubmit } = useForm<Inputs>({ defaultValues });

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

            // Khi đóng modal, in ra thời gian đã chạy
            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current); // Dọn dẹp khi component bị hủy
                }
            };
        }, [isRunning, timeElapsed]);

        useImperativeHandle(ref, () => ({
            submitForm: () => handleSubmit(onSubmit)(),
        }));

        const onSubmit: SubmitHandler<Inputs> = async () => {
            const timeData = {
                username: user,
                taskName: defaultValues.taskName,
                status: defaultValues.status,
                focusTime: timeElapsed,
            };
            
            try {
                const response = await authFetch('http://localhost:3000/tasks/update-focus-time', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(timeData),
                }, navigate)

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Server error');
                } else {
                    console.log("update focus time success")
                }

            } catch (error) {
                console.error("Server: Failed request. \n" + error);
            }
        };

        // Hàm format thời gian theo định dạng hh:mm:ss
        const formatTime = (seconds: number): string => {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        };

        return (
            <>
                <div className="">{defaultValues.taskName}</div>
                <div className="">From {dayjs(defaultValues.startDate).format('HH:mm:ss DD/MM/YYYY')}</div>
                <div className="">To {dayjs(defaultValues.endDate).format('HH:mm:ss DD/MM/YYYY')}</div>
                <div className="flex flex-row justify-center">
                    <div className="div">{defaultValues.status}</div>
                    <div>&nbsp;-&nbsp;</div>
                    <div className="div">{defaultValues.priorityLevel}</div>
                </div>
                <hr className="my-4 w-1/2 mx-auto border-t-2 border-gray-300" />

                {/* Hiển thị thời gian đã trôi qua */}
                <div className="text-center mt-4">
                    <p className="text-xl font-semibold">Focus time: {formatTime(timeElapsed)}</p>
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
    }
);

