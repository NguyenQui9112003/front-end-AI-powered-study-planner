import { AuthError, authFetch } from '@/helpers/utility/authFetch';
import { Button } from '../../../components/common/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/types/taskType';
import dayjs from 'dayjs';
import { adjustToUTC7 } from '@/helpers/utility/timezone';

interface AISuggestionProps {
	tasks: Task[];
}

interface AIScheduleFeedback {
	feedback: {
		overall: string;
		suggestions: [{ suggestion: string }];
	};
}

export const AISuggestion = (props: AISuggestionProps) => {
	const [AIResponse, setAIResponse] = useState<string>('No suggstion yet');
	const navigate = useNavigate();

	const onClick = async () => {
		const tasks = props.tasks.map((task) => {
			const startDate = task.startDate
				? dayjs(adjustToUTC7(task.startDate)).format('HH:mm DD/MM/YYYY')
				: null;
			const endDate = task.endDate
				? dayjs(adjustToUTC7(task.endDate)).format('HH:mm DD/MM/YYYY')
				: null;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { _id, createdAt, updatedAt, ...rest } = task;
			return { ...rest, startDate, endDate };
		});

		console.log(tasks);

		try {
			const response = await authFetch(
				'http://localhost:3000/ai/schedule',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(tasks),
				}
			);

			if (!response) {
				navigate('/signIn');
				return;
			}
	
			const feedback: AIScheduleFeedback = await response.json();
			let feedbackString = feedback.feedback.overall + '\n\n';
			let index = 1;
	
			for (const suggestion of feedback.feedback.suggestions) {
				feedbackString += index + '. ' + suggestion.suggestion + '\n\n';
				index++;
			}
	
			setAIResponse(feedbackString);
		} catch (error) {
			if (error instanceof AuthError) {
				navigate('/signIn');
			}
		}

		// response.json().then((res) => {
		// 	setAIResponse(res);
		// }).catch(error => console.log(error));
	};

	return (
		<div className="h-auto p-4 border-2 shadow-sm rounded-md hidden sm:flex flex-col">
			<div className="flex w-full justify-center">
				<h1 className="text-xl font-medium">AI Suggestion</h1>
			</div>

			<div className="flex w-full px-4 py-2 my-4 justify-center min-h-full border-2 border-blue-300">
				<p className="text-sm font-medium text-left text-blue-700 whitespace-pre-line">
					{AIResponse}
				</p>
			</div>

			<Button onClick={onClick}>Analyze</Button>
		</div>
	);
};
