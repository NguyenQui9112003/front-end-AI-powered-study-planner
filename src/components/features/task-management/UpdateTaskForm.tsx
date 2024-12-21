import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type UpdateTaskFormProps = {
    defaultValues: {
        taskName: string;
        description: string;
        priorityLevel: string;
        startDate: Date | null;
        endDate: Date | null;
        status: string;
    };
    onSave: (data: { 
        taskName: string; 
        description: string; 
        priorityLevel: string; 
        startDate: Date | null;
        endDate: Date | null; 
        status: string 
    }) => void;
    user: string; // user:props
};

export const UpdateTaskForm = forwardRef<any, UpdateTaskFormProps>(({ defaultValues, user }, ref) => {
    type Inputs = {
        email: string; // set user:props from parent
        taskName: string;
        description: string;
        priorityLevel: string;
        startDate: Date | String | null;
        endDate: Date | String | null;
        status: string;
    }

    const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful }, } = useForm<Inputs>({ defaultValues, });

    useEffect(() => {
        if (isSubmitSuccessful) {
            // console.log("update completed");
        }
    }, [isSubmitSuccessful, reset]);

    const adjustToUTC7 = (date: string | Date | null) => {
        if (!date) return null;
        const parsedDate = typeof date === "string" ? new Date(date) : date; // Chuyển chuỗi thành Date nếu cần
        parsedDate.setMinutes(parsedDate.getMinutes() + 420); // Thêm 420 phút = 7 giờ
        return parsedDate.toISOString().slice(0, 16);
    };

    useEffect(() => {
        const formattedValues = {
            ...defaultValues,
            startDate: adjustToUTC7(defaultValues.startDate),
            endDate: adjustToUTC7(defaultValues.endDate),
        };
        reset(formattedValues); // Reset giá trị mặc định khi nhận props từ parent
    }, [defaultValues, reset]);

    useImperativeHandle(ref, () => ({
        submitForm: () => handleSubmit(onSubmit)(),
    }));

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        // set user
        data.email = user;

        try {
            const response = await fetch('http://localhost:3000/tasks/update', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Server error');
            } else {
                toast.success("Task updated successfully", {
                    position: 'top-right',
                });
            }

        } catch (error) {
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

    return (
        <>
            <ToastContainer />
            <div className="w-full max-w-2xl mx-auto">
                <form action="task/create" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Task name</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="taskName"
                            type="text"
                            {...register("taskName",
                            { required: "This field is required",
                        })} />
                        {errors.taskName &&
                            <div className='text-xs text-left mt-1 text-red-700'>
                                {errors.taskName.message}
                            </div>}
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Description</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="description"
                            type="text"
                            {...register("description",
                            { required: "This field is required",
                        })} />
                        {errors.description &&
                            <div className='text-xs text-left mt-1 text-red-700'>
                                {errors.description.message}
                            </div>}
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Priority level</label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="priorityLevel"
                            {...register("priorityLevel",
                            { required: "This field is required", })}
                            style={{
                                backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22gray%22><path fill-rule=%22evenodd%22 d=%22M10 14a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 11.586l2.293-2.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 14z%22 clip-rule=%22evenodd%22 /></svg>')",
                                backgroundPosition: "right 0.3rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "2rem 2rem"
                            }}>
                            <option value="">Select</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        {errors.priorityLevel &&
                            <div className="text-xs text-left mt-1 text-red-700">
                                {errors.priorityLevel.message}
                            </div>}
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Start date</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="startDate"
                            type="datetime-local"
                            {...register("startDate",
                            { required: "This field is required",  
                        })}/>
                        {errors.startDate &&
                            <div className='text-xs text-left mt-1 text-red-700'>
                                {errors.startDate.message}
                            </div>}
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">End date</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="endDate"
                            type="datetime-local"
                            {...register("endDate",
                            { required: "This field is required", 
                        })}/>
                        {errors.endDate &&
                            <div className='text-xs text-left mt-1 text-red-700'>
                                {errors.endDate.message}
                            </div>}
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Status</label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="status"
                            {...register("status",
                            { required: "This field is required", })}
                            style={{
                                backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22gray%22><path fill-rule=%22evenodd%22 d=%22M10 14a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 11.586l2.293-2.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 14z%22 clip-rule=%22evenodd%22 /></svg>')",
                                backgroundPosition: "right 0.3rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "2rem 2rem"
                            }}>
                            <option value="">Select</option>
                            <option value="Todo">Todo</option>
                            <option value="Completed">Completed</option>
                            <option value="Expired">Expired</option>
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
});