import { createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import { database } from "~/api/dataStore";

const supabaseUrl = "https://mvmpsepzhzcakmzpuukg.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bXBzZXB6aHpjYWttenB1dWtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MDA2MTcxOCwiZXhwIjoyMDA1NjM3NzE4fQ.iZgxnljyCMgvCJWfrri1idM4PgkQZoEETr719YKrutM";

export default function DataItem() {
	// Get the 'id' parameter from the route using useParams()
	const params = useParams();
	const id = Number(params.id); // Convert the id to a number

	// Find the data item with the matching 'id' in the database
	const item = database().find((item) => item.id === id);

	// Comments state
	const [comment, setComment] = createSignal("");
	const [comments, setComments] = createSignal([]);

	async function handleSubmit(event) {
		event.preventDefault();

		try {
			const url = `${supabaseUrl}/rest/v1/smaapprover?id=eq.${id}`;
			const headers = {
				apikey: supabaseKey,
				Authorization: `Bearer ${supabaseKey}`,
				"Content-Type": "application/json",
			};
			const body = JSON.stringify({ comment: comment() });

			const response = await fetch(url, {
				method: "PATCH",
				headers: headers,
				body: body,
			});

			const responseData = await response.text(); // Get the raw response data as text

			if (response.ok) {
				// Check if the response data is not empty before parsing as JSON
				const data = responseData ? JSON.parse(responseData) : null;
				console.log("Comment added:", data);
				// Clear the comment input after successful submission
				setComment("");

				// Update the list of comments with the new comment
				setComments([...comments(), comment()]);
			} else {
				console.error("Error adding comment:", responseData);
			}
		} catch (err) {
			console.error("Unexpected error occurred:", err);
		}
	}

	async function handleApprove() {
		try {
			const url = `${supabaseUrl}/rest/v1/smaapprover?id=eq.${id}`;
			const headers = {
				apikey: supabaseKey,
				Authorization: `Bearer ${supabaseKey}`,
				"Content-Type": "application/json",
			};
			const body = JSON.stringify({ status: true }); // Set status to true (Approve)

			const response = await fetch(url, {
				method: "PATCH",
				headers: headers,
				body: body,
			});

			if (response.ok) {
				console.log("Status updated to Approve.");
				// Update the status in the local data
				item.status = true;
			} else {
				console.error("Error updating status:", response.statusText);
			}
		} catch (err) {
			console.error("Unexpected error occurred:", err);
		}
	}

	async function handleReject() {
		try {
			const url = `${supabaseUrl}/rest/v1/smaapprover?id=eq.${id}`;
			const headers = {
				apikey: supabaseKey,
				Authorization: `Bearer ${supabaseKey}`,
				"Content-Type": "application/json",
			};
			const body = JSON.stringify({ status: false }); // Set status to false (Reject)

			const response = await fetch(url, {
				method: "PATCH",
				headers: headers,
				body: body,
			});

			if (response.ok) {
				console.log("Status updated to Reject.");
				// Update the status in the local data
				item.status = false;
			} else {
				console.error("Error updating status:", response.statusText);
			}
		} catch (err) {
			console.error("Unexpected error occurred:", err);
		}
	}

	return (
		<>
			<section class="secpad">
				<section class="maxwidth">
					{/* Display the content of the data item */}
					{item ? (
						<>
							{/* Display comments */}
							<p>Status: {item.status}</p>

							{/* Buttons to modify status */}
							<div class="flex gap-5">
								<button
									onClick={handleApprove}
									class="bg-green-500 p-2 rounded-lg text-white"
								>
									Approve
								</button>
								<button
									onClick={handleReject}
									class="bg-red-500 p-2 rounded-lg text-white"
								>
									Reject
								</button>
							</div>

							<ul>
								{comments().map((comment, index) => (
									<li key={index}>{comment}</li>
								))}
							</ul>

							{/* Form for submitting a new comment */}
							<h3 class="p-2">Revision Comment:</h3>
							<form
								onSubmit={handleSubmit}
								class="flex mb-4 rounded-lg border pl-2"
							>
								<input
									type="text"
									value={comment()}
									onInput={(e) => setComment(e.target.value)}
									placeholder="Write your comment for revision..."
									class="w-1/2"
								/>
								<button
									type="submit"
									class="bg-blue-500 p-2 rounded-lg text-white"
								>
									Submit
								</button>
							</form>
							<div class="grid md:grid-cols-2 gap-6">
								<img
									src={item.imageurl}
									alt={item.caption}
									class="max-h-[588px]"
								/>
								<div class="relative">
									<div class="max-h-[588px] overflow-y-auto shadow-md p-2">
										<pre class="whitespace-pre-wrap">{item.caption}</pre>
									</div>
								</div>
							</div>
						</>
					) : (
						<p>Data not found.</p>
					)}
				</section>
			</section>
		</>
	);
}