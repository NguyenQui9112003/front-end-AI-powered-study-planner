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

type InputedData = {
    taskName: string;
    description: string;
    priorityLevel: string;
    estimatedTime: string;
    status: string;
}

let newInputData: InputedData = {
    taskName: '',
    description: '',
    priorityLevel: '',
    estimatedTime: '',
    status: ''
};

export const UpdateTaskForm = forwardRef<any, UpdateTaskFormProps>(({ defaultValues }, ref) => {
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


    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await fetch('https://be-ai-study-planner.onrender.com/tasks/update', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            newInputData = data;

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Server error');
            } else {
                toast.success("Task updated successfully", {
                    position: 'top-right',
                });
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
    };

    useEffect(() => {
        if (isSubmitSuccessful) {
            defaultValues = newInputData;
            reset(defaultValues); // Reset giá trị mặc định khi thành công
        }
    }, [isSubmitSuccessful, reset, defaultValues]);

    useEffect(() => {
        reset(defaultValues); // Reset giá trị mặc định khi nhận props mới
    }, [defaultValues, reset]);

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
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" readOnly id="taskName" type="text" {...register("taskName",)} />
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
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="priorityLevel"
                            {...register("priorityLevel", {
                                required: "This field is required",
                            })}
                        >
                            <option value="">Select</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        {errors.status && (
                            <div className="text-xs text-left mt-1 text-red-700">
                                {errors.status.message}
                            </div>
                        )}
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
                            <option value="Completed">Completed</option>
                            <option value="In Process">In Process</option>
                            <option value="Todo">Todo</option>
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