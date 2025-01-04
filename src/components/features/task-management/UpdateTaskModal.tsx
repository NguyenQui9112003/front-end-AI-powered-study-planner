import { Modal } from '@/components/common/modal';
import { UpdateTaskForm } from './UpdateTaskForm';
import { Task } from '@/types/taskType';

interface UpdateTaskModal {
	isOpen: boolean;
	onClose: () => void;
	defaultValues: Task;
	onSave: (data: Task) => void;
}

export const UpdateTaskModal = ({
	isOpen,
	onClose,
	defaultValues,
	onSave,
}: UpdateTaskModal) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<Modal.Header>
				<div className="text-blue-500 font-bold text-2xl mb-3 text-center">
					Update Your Task
				</div>
			</Modal.Header>
			<Modal.Body>
				<UpdateTaskForm
					defaultValues={defaultValues}
					onSave={onSave}
				></UpdateTaskForm>
			</Modal.Body>
			<Modal.Footer>
				<div className="flex justify-end">
					<Modal.DismissButton className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-1">
						Close
					</Modal.DismissButton>
					<button
						className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-1"
						type="submit"
						form="update-task-form"
					>
						Save Changes
					</button>
				</div>
			</Modal.Footer>
		</Modal>
	);
};
