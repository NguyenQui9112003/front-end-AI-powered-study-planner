import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useForm, SubmitHandler } from "react-hook-form"

export const RegisterForm = () => {
    const navigate = useNavigate();
    const backToLogin = () => {
        navigate(`/signIn`);
    }

    type UserData = {
        email: string,
        username: string,
        password: string,
    }

    type Inputs = {
        email: string
        username: string
        password: string
        confirm_password: string
    }

<<<<<<< HEAD
    const {register, handleSubmit, watch, reset, formState: { errors, isSubmitSuccessful }} = useForm<Inputs>()
=======
    const { register, handleSubmit, watch, reset, formState: { errors, isSubmitSuccessful } } = useForm<Inputs>()
>>>>>>> main
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const userData: UserData = {
                email: data.email,
                username: data.username,
                password: data.password
            }
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(userData),
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Server error');
            } else {
                toast.success('Account created successfully.', {
                    position: 'top-right'
                })
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, { position: 'top-right' });
            } else {
                toast.error('An unexpected error occurred.', { position: 'top-right' });
            }
        }
    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({ email: "", username: "", password: "", confirm_password: "" });
        }
    }, [isSubmitSuccessful, reset]);

    return (
        <>
            <ToastContainer />
            <div className="w-full max-w-xs mx-auto">
                <div className="text-blue-500 font-bold text-3xl mb-3 text-center">Sign-up</div>
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Username</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            {...register("username", { required: "This field is required" })} />
                        {errors.username &&
                            <div className='text-xs text-left mt-1 text-red-700'>
                                {errors.username.message}
                            </div>}
<<<<<<< HEAD
=======
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Email</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="text"
                            {...register("email", {
                                required: "This field is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address"
                                }
                            })} />
                        {errors.email &&
                            <div className='text-xs text-left mt-1 text-red-700'>
                                {errors.email.message}
                            </div>}
>>>>>>> main
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Password</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
<<<<<<< HEAD
                            {...register("password", { required: "This field is required",
                            maxLength: {
                                value: 20,
                                message: "Password must be at most 20 characters long"
                            },
                            validate: (val: string) => {
                                if (watch('confirm_password') !== val) {
                                    return "Your password does no match";
                                }
                            }
                        })} />
=======
                            {...register("password", {
                                required: "This field is required",
                                maxLength: {
                                    value: 20,
                                    message: "Password must be at most 20 characters long"
                                },
                                validate: (val: string) => {
                                    if (watch('confirm_password') !== val) {
                                        return "Your password does no match";
                                    }
                                }
                            })} />
>>>>>>> main
                        {errors.password &&
                            <div className='text-xs text-left mt-1 text-red-700'>
                                {errors.password.message}
                            </div>}
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Confirm-password</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="confirm-password"
                            type="password"
<<<<<<< HEAD
                            {...register("confirm_password", { required: "This field is required",
                            maxLength: {
                                value: 20,
                                message: "Password must be at most 20 characters long"
                            },
                            validate: (val: string) => {
                                if (watch('password') !== val) {
                                    return "Your password does no match";
                                }
                            }
                        })} />
=======
                            {...register("confirm_password", {
                                required: "This field is required",
                                maxLength: {
                                    value: 20,
                                    message: "Password must be at most 20 characters long"
                                },
                                validate: (val: string) => {
                                    if (watch('password') !== val) {
                                        return "Your password does no match";
                                    }
                                }
                            })} />
>>>>>>> main
                        {errors.confirm_password &&
                            <div className='text-xs text-left mt-1 text-red-700'>
                                {errors.confirm_password.message}
                            </div>}
                    </div>

                    <div className="flex flex-col justify-center mt-3 mx-auto">
                        <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit">
                            Sign Up
                        </button>
                        <a className="text-center mt-2 inline-block align-baseline font-italic text-sm text-blue-300 hover:text-blue-700 hover:underline"
                            style={{ cursor: 'pointer' }}
                            type='submit'
                            onClick={backToLogin}>
                            Back
                        </a>
                    </div>
                </form>
            </div>
        </>
    );
}