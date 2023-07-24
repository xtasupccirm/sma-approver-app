import { createSignal, createEffect, lazy } from "solid-js";
import { Routes, Route } from "@solidjs/router";
import { A } from "solid-start";
import { database, initializeData } from "~/api/dataStore";

const DataItem = lazy(() => import("../routes/data/[...id]"));

export default function Posts() {
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

	return (
		<div>
			<h2>List of Data Items:</h2>
			<ul class="grid md:grid-cols-3 gap-4">
				<Show when={loader()}>
					<For each={data}>
						{(item) => (
							<li class="relative">
								<A href={`/data/${item.id}`}>
									<img src={item.imageurl} alt="" />
									<p class="absolute bottom-0 bg-cyan-500 w-full">
										SCHEDULED {item.postAtSpecificTime}
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
	const createdAtDate = new Date(isoTime);
	return createdAtDate.toLocaleString("en-US", {
		timeZone: "America/New_York",
	});
}
