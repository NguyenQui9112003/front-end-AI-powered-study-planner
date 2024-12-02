import axios from 'axios';
import { useState, useEffect } from 'react';
import Images from '../components/features/photo/image';
import { Image } from '../types/imageType';

export const Body = () => {
    const [images, setImages] = useState<Image[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [endPoint, setEndPoint] = useState<boolean>(false);

    useEffect(() => {
        fetchUnflashAPI();
    }, [page]);

    const fetchUnflashAPI = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://api.unsplash.com/photos/?client_id=jpnydkS7jjJl3my12UCjLWpkFL5LUgdcXyJqkz-mUPs&page=${page}`
            );

            if (response.data.length > 0) {
                const newImages = response.data.map((image: any) => ({
                    id: image.id,
                    thumbnail: image.urls.small,
                    fullImage: image.urls.full,
                    author: image.user.name,
                    title: image.alt_description,
                    description: image.description,
                }));

                setImages((prevImages) => {
                    const uniqueImages = newImages.filter(
                        (newImage: Image) => !prevImages.some((image) => image.id === newImage.id)
                    );
                    return [...prevImages, ...uniqueImages];
                });
            } else {
                setEndPoint(true);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data: ', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 1 >=
                document.documentElement.scrollHeight
            ) {
                setPage((prevPage) => prevPage + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="app-container max-w-screen-lg mx-auto">
            <div className="gap-8 columns-1 md:columns-2 lg:columns-3">
                <Images images={images} />
            </div>
            <div className="flex items-center justify-center">
                {loading && <LoadingSpinner />}
                {endPoint && <NoMorePhotos />}
            </div>
        </div>
    )
}

const LoadingSpinner = () => (
    <div
        className="mt-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
    >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
        </span>
    </div>
);

const NoMorePhotos = () => (
    <div className='text-2xl'>No More Photos To Load !!!</div>
);