import { Header } from '../layouts/header'
import { Left } from '../layouts/left';
import { Center } from '../layouts/center';
import { Right } from '../layouts/right';
import { Footer } from '../layouts/footer';

export const HomePage = () => {
    return (
        <>
            <Header />
            <div className='flex flex-row'>
                <div className="basis-1/4 mr-3"><Left></Left></div>
                <div className="basis-2/4"><Center></Center></div>
                <div className="basis-1/4 ml-3"><Right></Right></div>
            </div>
            <Footer />
        </>
    );
};