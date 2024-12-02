import { useRouteError } from "react-router-dom";

export const Error = () => {
    const error = useRouteError() as RouteError;
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 text-red-600">{error.status}</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">{error.statusText}</p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">We are already working to solve the problem. </p>
                </div>
            </div>
        </section>
    );

    interface RouteError {
        status?: number;
        statusText?: string;
    }
}
