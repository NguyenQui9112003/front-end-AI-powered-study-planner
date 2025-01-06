import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import { useForm, SubmitHandler } from "react-hook-form"
import { useEffect, useImperativeHandle, forwardRef } from "react";
import { useRefreshToken } from "../../../helpers/utility/refreshToken";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CreateTaskForm = forwardRef(({ user }: any, ref) => {
    const navigate = useNavigate();
    const getRefreshToken = useRefreshToken();
    
    type Inputs = {
        username: string;
        taskName: string;
        description: string;
        priorityLevel: string;
        timeFocus: string;
        startDate: Date | null;
        endDate: Date | null;
        status: string;
    }

    const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful }, } = useForm<Inputs>({})

    useImperativeHandle(ref, () => ({
        submitForm: () => handleSubmit(onSubmit)(),
    }));

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({ taskName: "", description: "", priorityLevel: "", startDate: null, endDate: null, status: "" });
        }
    }, [isSubmitSuccessful, reset]);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        data.timeFocus = "0";
        data.username = user;
        const token = window.localStorage.getItem("token");
        if (!token) {
            navigate("/signIn");
            return;
        }
        const parsedToken = JSON.parse(token);
        let accessToken = parsedToken.access_token;
        const refreshToken = parsedToken.refresh_token;


        try {
            let response = await fetch('http://localhost:3000/tasks/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                toast.success("Task created successfully", {
                    position: 'top-right',
                });
            } else if (response.status === 419) {
                accessToken = await getRefreshToken(refreshToken);
                response = await fetch('http://localhost:3000/tasks/create', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(data),
                })

                if (response.ok) {
                    toast.success("Task created successfully", {
                        position: 'top-right',
                    });
                } else {
                    navigate("/signIn");
                    alert("Session auth expired");
                }
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Server error');
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
                            { required: "This field is required" })} />
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
                            {...register("description",{ required: "This field is required" })} />
                        {errors.description &&
                            <div className='text-xs text-left mt-1 text-red-700'>
                                {errors.description.message}
                            </div>}
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Priority</label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="priorityLevel"
                            {...register("priorityLevel",
                                { required: "This field is required" })}
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
                            { required: "This field is required" })}/>
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
                            { required: "This field is required" })}/>
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
                                { required: "This field is required" })}
                            style={{
                                backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22gray%22><path fill-rule=%22evenodd%22 d=%22M10 14a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 11.586l2.293-2.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 14z%22 clip-rule=%22evenodd%22 /></svg>')",
                                backgroundPosition: "right 0.3rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "2rem 2rem"
                            }}>
                            <option value="">Select</option>
                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
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
})