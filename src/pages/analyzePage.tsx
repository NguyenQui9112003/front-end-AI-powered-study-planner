import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
} from './../components/common/card';

import { Progress } from '@/components/common/progress';

import Header from '@/layouts/header';
import { useEffect, useState } from 'react';
import { Task } from '@/types/taskType';
import { getTokenData } from '@/helpers/utility/tokenData';

type AnalyzeData = {
	totalTasks: number;
	completedTasks: number;
	inProgressTasks: number;
	overdueTasks: number;
	totalSessionTime: string, // minute
	avgSessionTime: string, // minute
	taskCompletionRate: string, // percentage
};

export const AnalyzePage = () => {
	const user = getTokenData().username;

	// Placeholder data for rendering the UI
	const [data, setData] = useState<AnalyzeData>({
		totalTasks: 0,
		completedTasks: 0,
		inProgressTasks: 0,
		overdueTasks: 0,
		totalSessionTime: '0',
		avgSessionTime: '0',
		taskCompletionRate: '0',
	});

	const fetchTasks = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/tasks?userName=${encodeURIComponent(
					user
				)}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
					},
				}
			);

			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}

			const fetchedTasks = await response.json();

			const newData: AnalyzeData = {
				totalTasks: fetchedTasks.length,
				completedTasks: 0,
				inProgressTasks: 0,
				overdueTasks: 0,
				totalSessionTime: '0',
				avgSessionTime: '0',
				taskCompletionRate: '0',
			};

			fetchedTasks.forEach((task: Task) => {
				if (task.status === 'In Progress') {
					newData.inProgressTasks += 1;
				} else if (task.status === 'Completed') {
					newData.completedTasks += 1;
				} else if (task.status === 'Expired') {
					newData.overdueTasks += 1;
				}

				let timeFocusInMinutes = 0;
				timeFocusInMinutes = parseFloat(task.timeFocus) / 60; // Chuyển từ giây sang phút
				newData.totalSessionTime += timeFocusInMinutes;
			});
			
			if (newData.totalTasks > 0) {
				newData.avgSessionTime = (parseFloat(newData.totalSessionTime) / newData.totalTasks).toFixed(2);
				newData.totalSessionTime = parseFloat(newData.totalSessionTime).toFixed(2); 
				newData.taskCompletionRate = ((newData.completedTasks / newData.totalTasks) * 100).toFixed(2); 
			} else {
				newData.avgSessionTime = "0.00"; 
				newData.totalSessionTime = "0.00";
				newData.taskCompletionRate = "0.00";
			}

			setData(newData);
		} catch (error) {
			console.error('Error fetching profile:', error);
		}
	};

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

				<div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					<Card>
						<CardHeader>
							<div className='pl-7'>
								<CardTitle>Task Summary</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 text-center mx-auto">
								<li>
									Total Tasks:{' '}
									<span className="font-bold">{data.totalTasks}</span>
								</li>
								<li>
									Completed:{' '}
									<span className="font-bold">{data.completedTasks}</span>
								</li>
								<li>
									In Progress:{' '}
									<span className="font-bold">{data.inProgressTasks}</span>
								</li>
								<li>
									Overdue:{' '}
									<span className="font-bold text-red-500">{data.overdueTasks}</span>
								</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<div className='pl-7'>
								<CardTitle>Focus Session Stats</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								<li>
									Total Session Time:{' '}
									<span className="font-bold">
										{data.totalSessionTime} mins
									</span>
								</li>
								<li>
									Avg Session Time:{' '}
									<span className="font-bold">
										{data.avgSessionTime} mins
									</span>
								</li>
								<li>
									Task Completion Rate:{' '}
									<span className="font-bold">
										{data.taskCompletionRate} %
									</span>
								</li>
							</ul>
						</CardContent>
					</Card>

					<Card className="mb-8">
						<CardHeader>
							<div className='pl-7'>
								<CardTitle>Task Completion Progress</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="flex flex-row gap-3 items-center">
							<Progress
								value={parseFloat(data.taskCompletionRate)}
								max={100}
								className="w-full"
							/>
							<p className='text-center whitespace-nowrap w-max pt-3'>
								{data.taskCompletionRate} {' % Completed'}
							</p>
						</CardContent>
					</Card>

					{/* AI-Generated Insights */}
					<Card className="mb-8">
						<CardHeader>
							<div className='pl-7'>
								<CardTitle>AI-Generated Insights</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<p className="text-gray-700">
									{parseFloat(data.taskCompletionRate) < 60 ? (
										<span className="text-red-500">
											Warning:{' '}
										</span>
									) : (
										<span className="text-green-500">
											Good Job:{' '}
										</span>
									)}
									{parseFloat(data.taskCompletionRate) < 60
										? 'Your task completion rate is lower than expected. Consider prioritizing your tasks better.'
										: "You're doing well! Keep up the good work in completing tasks on time."}
								</p>

							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
};

export default AnalyzePage;
