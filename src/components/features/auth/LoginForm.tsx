import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form"

import { useGoogleLogin } from "./LoginGoogleForm";
import { useAuth } from "../../../helpers/context/authProvider";

export const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const logInGoogle = useGoogleLogin();

    const navigateToRegister = () => {
        navigate(`/register`)
    }

    const handleLogInGooglge = () => {
        logInGoogle();
    }

    type Inputs = {
        username: string
        password: string
    }

    const {register, handleSubmit, reset, formState: { errors, isSubmitSuccessful },} = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Server error');
            }

            const token = await response.json();
            login(token);
            navigate(`/home`);

        } catch (error) {
            console.error("Server: Failed request.");
            if (error instanceof Error) {
                toast.error(error.message, {
                    position: 'top-right',
                });
            } else {
                toast.error('An unexpected error occurred.', {
                    position: 'top-right',
                });
            }
        }
    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({ username: "", password: "" });
        }
    }, [isSubmitSuccessful, reset]);

    return (
        <>
            <ToastContainer />
            <div className="w-full max-w-xs mx-auto">
                <div className="text-blue-500 font-bold text-3xl mb-3 text-center">Log In</div>
                <form action="/user/auth" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
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
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2 text-left">Password</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            {...register("password", { required: "This field is required",
                            maxLength: {
                                value: 20,
                                message: "Password must be at most 20 characters long"
                            }
                        })} />
                        {errors.password &&
                            <div className='text-xs text-left mt-1 text-red-700'>
                                {errors.password.message}
                            </div>}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit">
                            Sign In
                        </button>
                        <a className="inline-block align-baseline font-italic text-sm text-blue-300 hover:text-blue-700 hover:underline mx-7"
                            style={{ cursor: 'pointer' }}
                            type='submit'
                            onClick={navigateToRegister}>
                            Register account?
                        </a>
                    </div>
                </form>

                <button className="w-full mb-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleLogInGooglge}>
                    Google Login
                </button>
            </div>
        </>
    )
}