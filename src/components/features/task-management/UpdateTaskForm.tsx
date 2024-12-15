import { useEffect, useImperativeHandle, forwardRef } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { useForm, SubmitHandler } from "react-hook-form"
import 'react-toastify/dist/ReactToastify.css';

type UpdateTaskFormProps = {
    defaultValues: {
        taskName: string;
        description: string;
        priorityLevel: string;
        estimatedTime: string;
        status: string;
    };
    onSave: (data: { taskName: string; description: string; priorityLevel: string; estimatedTime: string; status: string }) => void;
};

export const UpdateTaskForm = forwardRef<any, UpdateTaskFormProps>(({ defaultValues, onSave }, ref) => {
    type Inputs = {
        taskName: string
        description: string
        priorityLevel: string
        estimatedTime: string
        status: string
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful },
    } = useForm<Inputs>({
        defaultValues,
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        onSave(data); // Gọi hàm cha để cập nhật bảng
    };

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset(defaultValues); // Reset giá trị mặc định khi thành công
        }
    }, [isSubmitSuccessful, reset, defaultValues]);

    useEffect(() => {
        reset(defaultValues); // Reset giá trị mặc định khi nhận props mới
    }, [defaultValues, reset]);

    // useEffect(() => {
    //     if (isSubmitSuccessful) {
    //         reset({ taskName: "", description: "", priorityLevel: "", estimatedTime: "", status: "" });
    //     }
    // }, [isSubmitSuccessful, reset]);

    useImperativeHandle(ref, () => ({
        submitForm: () => handleSubmit(onSubmit)(),
    }));

    return (
        <>
            <ToastContainer />
            <div className="w-full max-w-2xl mx-auto">
                <form action="task/create" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Task name</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="taskName" type="text" {...register("taskName", {
                            required: "This field is required",
                        })} />
                        {errors.taskName && <div className='text-xs text-left mt-1 text-red-700'>{errors.taskName.message}</div>}
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Description</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" type="text" {...register("description", {
                            required: "This field is required",
                        })} />
                        {errors.description && <div className='text-xs text-left mt-1 text-red-700'>{errors.description.message}</div>}
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Priority level</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="priorityLevel" type="text" {...register("priorityLevel", {
                            required: "This field is required",
                        })} />
                        {errors.priorityLevel && <div className='text-xs text-left mt-1 text-red-700'>{errors.priorityLevel.message}</div>}
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Estimated time (HH:MM)</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="estimatedTime" type="text" {...register("estimatedTime", {
                            required: "This field is required",
                        })} />
                        {errors.estimatedTime && <div className='text-xs text-left mt-1 text-red-700'>{errors.estimatedTime.message}</div>}
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Status</label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="status"
                            {...register("status", {
                                required: "This field is required",
                            })}
                        >
                            <option value="">Select</option>
                            <option value="completed">Completed</option>
                            <option value="scheduled">Schedule</option>
                            <option value="pending">Pending</option>
                        </select>
                        {errors.status && (
                            <div className="text-xs text-left mt-1 text-red-700">
                                {errors.status.message}
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </>
    )
})