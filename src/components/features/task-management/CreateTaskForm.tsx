import { useEffect, useImperativeHandle, forwardRef } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { useForm, SubmitHandler } from "react-hook-form"
import 'react-toastify/dist/ReactToastify.css';

export const CreateTaskForm = forwardRef((_, ref) => {
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
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        // try {
        //     const response = await fetch('http://localhost:3000/auth/create-task', {
        //         method: 'POST',
        //         headers: {
        //             'Content-type': 'application/json'
        //         },
        //         body: JSON.stringify(data),
        //     })

        //     if (!response.ok) {
        //         const errorData = await response.json();
        //         throw new Error(errorData.message || 'Server error');
        //     }

        // } catch (error) {
        //     console.error("Server: Failed request.");
        //     if (error instanceof Error) {
        //         toast.error(error.message, {
        //             position: 'top-right',
        //         });
        //     } else {
        //         toast.error('An unexpected error occurred.', {
        //             position: 'top-right',
        //         });
        //     }
        // }

        console.log(data);
    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({ taskName: "", description: "", priorityLevel: "", estimatedTime: "", status: "" });
        }
    }, [isSubmitSuccessful, reset]);

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