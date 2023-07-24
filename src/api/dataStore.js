// dataStore.js
import { createSignal } from "solid-js";

export const [database, setDatabase] = createSignal([]);

// Function to fetch the data and update the data signal
async function fetchData() {
	try {
		const supabaseUrl = "https://mvmpsepzhzcakmzpuukg.supabase.co";
		const supabaseKey =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bXBzZXB6aHpjYWttenB1dWtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MDA2MTcxOCwiZXhwIjoyMDA1NjM3NzE4fQ.iZgxnljyCMgvCJWfrri1idM4PgkQZoEETr719YKrutM";

		const response = await fetch(`${supabaseUrl}/rest/v1/smaapprover`, {
			headers: {
				apikey: supabaseKey,
				Authorization: `Bearer ${supabaseKey}`,
			},
		});

		if (!response.ok) {
			throw new Error("Error fetching data from Supabase.");
		}

		const data = await response.json();
		return data;
	} catch (err) {
		// Handle any errors
		console.error("Error fetching data:", err);
		return [];
	}
}

// Function to initialize the data signal by fetching the data
export async function initializeData() {
	const fetchedData = await fetchData();
	setDatabase(fetchedData);
	console.log(fetchedData);
	console.log(database());
}
