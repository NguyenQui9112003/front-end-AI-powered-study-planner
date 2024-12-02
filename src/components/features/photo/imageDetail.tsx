import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Image } from '../../../types/imageType';

export const ImageDetail = () => {
    const { id } = useParams();
    const [image, setImage] = useState<Image | null>(null);

    const navigate = useNavigate();
    const backToHomeClick = () => {
        navigate(`/home`);
    };

    useEffect(() => {
        const fetchImageDetail = async () => {
            try {
                const response = await axios.get(`https://api.unsplash.com/photos/${id}?client_id=jpnydkS7jjJl3my12UCjLWpkFL5LUgdcXyJqkz-mUPs`);
                const fetchedImage: Image = {
                    id: response.data.id,
                    thumbnail: response.data.urls.small,
                    fullImage: response.data.urls.full,
                    author: response.data.user.name,
                    title: response.data.alt_description,
                    description: response.data.description,
                };
                setImage(fetchedImage);
            } catch (error) {
                console.error('Error fetching photo details:', error);
            }
        };

        fetchImageDetail();
    }, [id]);

    return (
        <>
            {image ? (
                <>
                    <div className="max-w-screen-lg mx-auto">
                        <div className="flex flex-col items-center my-3">
                            <div className="text-center mb-4">
                                <p>Author: {image.author}</p>
                                <p>Title: {image.title || 'No title available'}</p>
                                <p>Description: {image.description ? image.description : 'No description available'}</p>
                            </div>
                            <div className="">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                                    onClick={backToHomeClick}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                        <img src={image.fullImage} alt="Photo Detail" className="mx-auto" /> {/* Center image */}
                    </div>
                </>

            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <LoadingSpinner />
                </div>
            )}
        </>
    );
}

const LoadingSpinner = () => (
    <>
        <div className="mt-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
        <div className='mt-1 text-center'>
            Loading...
        </div>
    </>
);
