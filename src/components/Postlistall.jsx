import { createSignal, createEffect, lazy } from "solid-js";
import { Routes, Route } from "@solidjs/router";
import { A } from "solid-start";
import { database, initializeData } from "~/api/dataStore";

const DataItem = lazy(() => import("../routes/data/[...id]"));

export default function Postlistall() {
	const [data, setData] = createSignal([]);
	const [loading, setLoading] = createSignal(false);

	createEffect(() => {
		if (database().length === 0) {
			// If data is not yet fetched, initialize it
			initializeData();
		} else {
			// If data is already available, set the local data signal and sort by id
			const sortedData = database().sort((a, b) => a.id - b.id);
			setData(sortedData);
			setLoading(true);
		}

		return () => {
			// This function will run when the component is unmounted.
			// Use onCleanup to stop the effect from running again.
			setLoading(false); // Reset loading state when component unmounts
		};
	});

	return (
		<>
			<section class="secpad">
				<section class="maxwidth">
					<h1>My Social Media Posts</h1>
					<Show
						when={loading()}
						fallback={<div>Data is loading please wait...</div>}
					>
						<Routes>
							<Route path="/" element={<Home data={data()} />} />
							<Route path="/data/:id" element={<DataItem data={data()} />} />
						</Routes>
					</Show>
				</section>
			</section>
		</>
	);
}

function Home(props) {
	const [loader, setLoader] = createSignal(false);
	const { data } = props;
	setLoader(true);

	// Filter the data to show only items with status equal to null or not approved
	// const filteredData = data.filter(
	// 	(item) => item.status === true || item.status === true
	// );

	return (
		<div>
			<h2>List of Data Items:</h2>
			<ul class="grid md:grid-cols-3 gap-4">
				<Show when={loader()}>
					<For each={data}>
						{(item) => (
							<li class="relative">
								<A href={`/data/${item.id}`}>
									<img src={item.imageurl[0]} alt="" />
									<p class="absolute bottom-0 bg-cyan-500 w-full">
										SCHEDULED {convertToEasternTime(item.postAtSpecificTime)}
									</p>
								</A>
							</li>
						)}
					</For>
				</Show>
			</ul>
		</div>
	);
}

// Function to convert ISO 8601 time to Eastern Time (America/New_York)
function convertToEasternTime(isoTime) {
	// Parse the custom date format into a Date object
	const [dateString, timeString] = isoTime.split(" ");
	const [month, day, year] = dateString.split("/");
	const [hours, minutes] = timeString.split(":");
	const easternTime = new Date(year, month - 1, day, hours, minutes);

	// Convert to Eastern Time and add a day
	easternTime.toLocaleString("en-US", { timeZone: "America/New_York" });
	easternTime.setDate(easternTime.getDate());

	// Format the date to include day and time in Eastern Time
	const formattedDate = easternTime.toLocaleString("en-US", {
		timeZone: "America/New_York",
		weekday: "short",
		month: "numeric",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
	});

	return formattedDate;
}
