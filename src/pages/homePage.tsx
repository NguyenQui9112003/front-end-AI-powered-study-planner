import { Header } from '../layouts/header'
import { Footer } from '../layouts/footer';
import TaskCalendar from '@/components/features/task-calendar/TaskCalendar';

export const HomePage = () => {
    return (
        <>
            <Header />
            <TaskCalendar/>
            <Footer />
        </>
    );
};