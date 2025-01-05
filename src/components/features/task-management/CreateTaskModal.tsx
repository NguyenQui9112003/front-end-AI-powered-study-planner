import { Modal } from '@/components/common/modal';
import { CreateTaskForm, OnCreateTask } from './CreateTaskForm';

interface CreateTaskModal {
	isOpen: boolean;
	onClose: () => void;
	onCreate: OnCreateTask;
}

export const CreateTaskModal = ({
	isOpen,
	onClose,
	onCreate,
}: CreateTaskModal) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<Modal.Header>
				<div className="text-blue-500 font-bold text-2xl mb-3 text-center">
					Create Your Task
				</div>
			</Modal.Header>
			<Modal.Body>
				<CreateTaskForm onCreate={onCreate}></CreateTaskForm>
			</Modal.Body>
			<Modal.Footer>
				<div className="flex justify-end">
					<Modal.DismissButton className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-1">
						Close
					</Modal.DismissButton>
					<button
						className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-1"
						type="submit"
						form="create-task-form"
					>
						Confirm
					</button>
				</div>
			</Modal.Footer>
		</Modal>
	);
};
