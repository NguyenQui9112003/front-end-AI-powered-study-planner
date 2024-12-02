import { IndividualImage } from './imageIndividual'
import { Image } from '../../../types/imageType';

type ImagesProps = {
    images: Image[];
}

export const Images = ({ images }: ImagesProps) => {
    return images.map((image) => (
        <IndividualImage key={image.id} image={image}></IndividualImage>
    ))
}

export default Images;