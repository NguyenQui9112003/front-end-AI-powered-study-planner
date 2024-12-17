
type AISuggestionProps = {
    OnAnalyze: () => void;
}

export const AISuggestion = (props: AISuggestionProps) => {
	return (
		<div className="h-auto mt-4 p-4 border-2 shadow-sm rounded-md hidden sm:flex flex-col">
            <div className="flex w-full justify-center">
                <h1 className="text-xl font-medium">AI Suggestion</h1>
            </div>

            <div className="flex w-full p-1 my-4 justify-center min-h-full border-2 border-blue-300">
                <p className="text-sm font-medium text-blue-700">
                    {`Overall, your schedule seems ambitious but manageable. However, there are a few areas for improvement:

* **Time Allocation:**  The time allocated to History might be insufficient, given the essay writing requirement. Consider extending the essay writing time, potentially by reducing the time spent on Physics problem sets on Monday, or spreading the work across multiple days.
* **Breaks:**  While breaks are included, ensure they are truly utilized for rest and rejuvenation, not just passive scrolling.  Consider incorporating short, active breaks like stretching or walking.
* **Evening Studying:** Avoiding late-night studying is crucial.  Consider shifting some of the sessions to earlier in the day.  For instance, moving the Monday Chemistry Lab Report to the afternoon might prevent late-night work.
* **Balance:** The schedule leans heavily towards STEM subjects; consider if a more balanced approach, incorporating short review sessions for History between other subjects, might aid retention and reduce mental fatigue.


**Specific Suggestions:**
1.  **Extend History time:** Add an additional hour to History sessions on Monday and Tuesday.
2.  **Shift Chemistry:** Move the Monday Chemistry Lab Report to between 1:00 PM and 4:00 PM.
3.  **Prioritize:**  Focus on completing the most challenging tasks (e.g., the History essay) early in the day when you are most alert.
4.  **Incorporate short reviews:** Allocate 15-20 minutes between subjects to quickly review the previous material, improving retention.

By implementing these suggestions, your study schedule will be more efficient, balanced, and less likely to lead to burnout.  Remember to adjust the schedule based on your personal preferences and energy levels.`}</p>
            </div>
			
			<button
            onClick={props.OnAnalyze} 
            className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Analyze
            </button>
		</div>
	);
};
