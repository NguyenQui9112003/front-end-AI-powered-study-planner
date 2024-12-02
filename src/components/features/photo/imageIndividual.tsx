import { useNavigate } from 'react-router-dom';
import { Image } from '../../../types/imageType';

type IndividualImageProps = {
    image: Image;
};

export const IndividualImage = ({ image }: IndividualImageProps) => {
    const navigate = useNavigate();

    const handleImageClick = () => {
        navigate(`/img-detail/${image.id}`);
    };

    return (
        <div>
            <img
                className="mb-3"
                src={image.thumbnail}
                alt="unsplash images"
                title={image.title || "No title available"}
                onClick={handleImageClick}
                style={{ cursor: 'pointer' }}
            />
        </div>
    );
};
