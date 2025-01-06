import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
} from './../components/common/card';

import { Progress } from '@/components/common/progress';

import Header from '@/layouts/header';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthError, authFetch } from '@/helpers/utility/authFetch';

type AnalyzeData = {
	totalTasks: number;
	completedTasks: number;
	inProgressTasks: number;
	overdueTasks: number;
	totalTimeSpent: number; // minute
	avgSessionDuration: number; // minute
	taskCompletionRate: number; // percentage
};

type Insight = {
	rating: string;
	insight: string;
};

type Feedback = {
	overall: string;
	insights: Insight[];
};

type ResponseSchema = {
	stats: AnalyzeData;
	feedback?: Feedback;
};

const AnalyzePage = () => {
	const [data, setData] = useState<ResponseSchema>({
		stats: {
			totalTasks: 0,
			completedTasks: 0,
			inProgressTasks: 0,
			overdueTasks: 0,
			// focusSessionsCompleted: 0,
			avgSessionDuration: 0,
			// avgBreakTime: 0,
			totalTimeSpent: 0,
			// totalEstimatedTime: 0,
			taskCompletionRate: 0,
		},
	});

	const navigate = useNavigate();

	const stats = data.stats;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await authFetch(
					'http://localhost:3000/ai/analyze',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);

				const newData = await response.json();

				stats.avgSessionDuration /= 60;
				stats.totalTimeSpent /= 60;

				stats.avgSessionDuration.toFixed(2);
				stats.totalTimeSpent.toFixed(2);
				setData(newData);
			} catch (error) {
				if (error instanceof AuthError) {
					navigate('/signIn');
				}
			}
		};

		fetchData();
	}, []);

	console.log(data);

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
							<CardTitle>Task Summary</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 p-0 text-center mx-auto">
								<li>
									Total Tasks:{' '}
									<span className="font-bold">
										{stats.totalTasks}
									</span>
								</li>
								<li>
									Completed:{' '}
									<span className="font-bold">
										{stats.completedTasks}
									</span>
								</li>
								<li>
									In Progress:{' '}
									<span className="font-bold">
										{stats.inProgressTasks}
									</span>
								</li>
								<li>
									Overdue:{' '}
									<span className="font-bold text-red-500">
										{stats.overdueTasks}
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
							<ul className="space-y-2 p-0">
								<li>
									Total Session Time:{' '}
									<span className="font-bold">
										{stats.totalTimeSpent} mins
									</span>
								</li>
								<li>
									Avg Session Time:{' '}
									<span className="font-bold">
										{stats.avgSessionDuration} mins
									</span>
								</li>
								<li>
									Task Completion Rate:{' '}
									<span className="font-bold">
										{stats.taskCompletionRate} %
									</span>
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>

				<Card className="mb-8">
					<CardHeader>
						<div className="pl-7">
							<CardTitle>Task Completion Progress</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="flex flex-row gap-3 items-center">
						<Progress
							value={stats.taskCompletionRate}
							max={100}
							className="w-full"
						/>
						<p className="text-center whitespace-nowrap w-max pt-3">
							{stats.taskCompletionRate} {' % Completed'}
						</p>
					</CardContent>
				</Card>

				<div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 my-8">
					{/* AI-Generated Insights */}
					<Card className="mb-8">
						<CardHeader>
							<CardTitle>AI-Generated Insights</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4 text-left">
								{data.feedback?.insights.map(
									(insight, index) => {
										return (
											<p
												key={index}
												className="text-gray-700"
											>
												<span
													className={
														insight.rating ==
														'Can be improved'
															? 'text-yellow-500'
															: 'text-green-500'
													}
												>
													{insight.rating + ': '}
												</span>
												{insight.insight}
											</p>
										);
									}
								)}
							</div>
						</CardContent>
					</Card>

					{/* Smart Suggestions */}
					<Card className="mb-8">
						<CardHeader>
							<CardTitle>Smart Suggestions</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 text-left">
								<li className="text-yellow-500">
									Consider using the Pomodoro technique to
									stay more focused during tasks.
								</li>
								<li className="text-yellow-500">
									Try adjusting your schedule to allow more
									break time between study sessions.
								</li>
								<li className="text-yellow-500">
									Reassess high-priority tasks to avoid
									burnout. You may want to push some tasks to
									the next week.
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
							<div className="space-y-4 text-left">
								<p className="text-green-500">
									{stats.taskCompletionRate >= 80
										? "You're doing an amazing job! Keep it up!"
										: "Don't worry, it's okay to have challenges. Just focus on improving each week!"}
								</p>
								<p className="text-gray-700">
									"Every small step counts. Make adjustments
									and keep pushing forward!"
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
