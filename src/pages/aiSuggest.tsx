import Header from '@/layouts/header';
import { Input } from '@/components/common/input';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/common/collapsible';
import { Button } from '@/components/common/button';
import { FilterIcon } from 'lucide-react';

export const AISuggestPage = () => {
	return (
		<>
			<Header />
			<div className="flex flex-col sm:flex-row m-4 gap-4">
				<div className=""></div>
				<div className="">
					<Collapsible className="flex flex-col">
						<div
							id="task-search"
							className="flex flex-row gap-4 mb-4"
						>
							<Input type="text" placeholder="Search" />
							<CollapsibleTrigger asChild>
								<Button variant="ghost" size="sm">
									<FilterIcon className="h-4 w-4" />
									<span className="sr-only">Toggle</span>
								</Button>
							</CollapsibleTrigger>
						</div>
						<CollapsibleContent></CollapsibleContent>
					</Collapsible>
				</div>
			</div>
		</>
	);
};

export default AISuggestPage;
