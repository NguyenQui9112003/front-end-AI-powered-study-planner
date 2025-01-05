import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
} from '@/components/common/card';

import { Progress } from '@/components/common/progress';
import Header from '@/layouts/header';
import { useEffect, useState } from 'react';
import { Task } from '@/types/taskType';
import { authFetch } from '@/helpers/utility/authFetch';

type AnalyzeData = {
	totalTasks: number;
	completedTasks: number;
	inProgressTasks: number;
	overdueTasks: number;
	focusSessionsCompleted: number;
	avgSessionDuration: number; // minutes
	avgBreakTime: number; // minutes
	totalTimeSpent: number; // minutes
	totalEstimatedTime: number; // minutes
	taskCompletionRate: number; // percentage
	focusEfficiency: number; // percentage
};

const AnalyzePage = () => {
	const [tasks, setTasks] = useState<Task[]>([]);

	// Placeholder data for rendering the UI
	const data: AnalyzeData = {
		totalTasks: 0,
		completedTasks: 0,
		inProgressTasks: 0,
		overdueTasks: 0,
		focusSessionsCompleted: 12,
		avgSessionDuration: 0, // minutes
		avgBreakTime: 5, // minutes
		totalTimeSpent: 200, // minutes
		totalEstimatedTime: 180, // minutes
		taskCompletionRate: 85, // percentage
		focusEfficiency: 90, // percentage
	};

	const fetchTasks = async () => {
		const response = await authFetch('http://localhost:3000/tasks', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const unfilteredTasks = await response.json();

		const filteredTasks = unfilteredTasks.filter((task: Task) => {
			const today = new Date();
			const oneWeekAgo = new Date(today);
			oneWeekAgo.setDate(today.getDate() - 7);

			const date = task.endDate;

			return date && date >= oneWeekAgo && date <= today;
		});

		setTasks(unfilteredTasks);
	};

	if (tasks) {
		for (const task of tasks) {
			data.totalTasks += 1;
			// f (task.status === "Todo") {}
			if (task.status === 'In Progress') {
				data.inProgressTasks += 1;
			}
			if (task.status === 'Completed') {
				data.completedTasks += 1;
			}
			if (task.status === 'Expired') {
				data.overdueTasks += 1;
			}
			data.avgSessionDuration += parseInt(task.timeFocus);
		}

		data.avgSessionDuration = data.avgSessionDuration / data.totalTasks;
		data.taskCompletionRate = (data.completedTasks / data.totalTasks) * 100;
	}

	useEffect(() => {
		fetchTasks();
	}, []);

	return (
		<>
			<Header />
			<div className="container mx-auto p-8">
				<h1 className="text-3xl font-bold text-center mb-6">
					Analyze Your Progress
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					<Card>
						<CardHeader>
							<CardTitle>Task Summary</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								<li>
									Total Tasks:{' '}
									<span className="font-bold">
										{data.totalTasks}
									</span>
								</li>
								<li>
									Completed:{' '}
									<span className="font-bold">
										{data.completedTasks}
									</span>
								</li>
								<li>
									In Progress:{' '}
									<span className="font-bold">
										{data.inProgressTasks}
									</span>
								</li>
								<li>
									Overdue:{' '}
									<span className="font-bold text-red-500">
										{data.overdueTasks}
									</span>
								</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Focus Session Stats</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								<li>
									Focus Sessions Completed:{' '}
									<span className="font-bold">
										{data.focusSessionsCompleted}
									</span>
								</li>
								<li>
									Avg Session Duration:{' '}
									<span className="font-bold">
										{data.avgSessionDuration} mins
									</span>
								</li>
								<li>
									Avg Break Duration:{' '}
									<span className="font-bold">
										{data.avgBreakTime} mins
									</span>
								</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Time Efficiency</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								<li>
									Total Time Spent:{' '}
									<span className="font-bold">
										{data.totalTimeSpent} mins
									</span>
								</li>
								<li>
									Estimated Time:{' '}
									<span className="font-bold">
										{data.totalEstimatedTime} mins
									</span>
								</li>
								<li>
									Task Completion Rate:{' '}
									<span className="font-bold">
										{data.taskCompletionRate}%
									</span>
								</li>
								<li>
									Focus Efficiency:{' '}
									<span className="font-bold">
										{data.focusEfficiency}%
									</span>
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>

				{/* AI-Generated Insights */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>AI-Generated Insights</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<p className="text-gray-700">
								{data.taskCompletionRate < 80 ? (
									<span className="text-red-500">
										Warning:{' '}
									</span>
								) : (
									<span className="text-green-500">
										Good Job:{' '}
									</span>
								)}
								{data.taskCompletionRate < 80
									? 'Your task completion rate is lower than expected. Consider prioritizing your tasks better.'
									: "You're doing well! Keep up the good work in completing tasks on time."}
							</p>

							<p className="text-gray-700">
								{data.focusEfficiency < 85 ? (
									<span className="text-yellow-500">
										Suggestion:{' '}
									</span>
								) : (
									<span className="text-green-500">
										Great Job:{' '}
									</span>
								)}
								{data.focusEfficiency < 85
									? 'Consider adjusting your focus sessions to improve efficiency. You might benefit from a slightly longer session or reducing distractions.'
									: 'Your focus efficiency is great! Keep maintaining this balance for optimal productivity.'}
							</p>

							<p className="text-gray-700">
								{data.totalTimeSpent >
								data.totalEstimatedTime ? (
									<span className="text-red-500">
										Warning:{' '}
									</span>
								) : (
									<span className="text-green-500">Tip:</span>
								)}
								{data.totalTimeSpent > data.totalEstimatedTime
									? 'You are spending more time than estimated on tasks. You might want to reassess the time allocation for better balance.'
									: "You're on track with your time estimates. Great job managing your schedule!"}
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Task Completion Progress */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Task Completion Progress</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-row gap-4 items-center">
						<Progress
							value={data.taskCompletionRate}
							max={100}
							className="w-full"
						/>
						<p className='text-center whitespace-nowrap w-max'>
							{data.taskCompletionRate} {' % Completed'}
						</p>
					</CardContent>
				</Card>

				{/* Smart Suggestions */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Smart Suggestions</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							<li className="text-yellow-500">
								Consider using the Pomodoro technique to stay
								more focused during tasks.
							</li>
							<li className="text-yellow-500">
								Try adjusting your schedule to allow more break
								time between study sessions.
							</li>
							<li className="text-yellow-500">
								Reassess high-priority tasks to avoid burnout.
								You may want to push some tasks to the next
								week.
							</li>
						</ul>
					</CardContent>
				</Card>

				{/* Motivational Feedback */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Motivational Feedback</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<p className="text-green-500">
								{data.taskCompletionRate >= 80
									? "You're doing an amazing job! Keep it up!"
									: "Don't worry, it's okay to have challenges. Just focus on improving each week!"}
							</p>
							<p className="text-gray-700">
								"Every small step counts. Make adjustments and
								keep pushing forward!"
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default AnalyzePage;
