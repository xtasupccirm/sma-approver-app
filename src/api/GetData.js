export default function getData() {
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

			// Update the data state with the fetched data
			if (data) {
				return data;
			}
		} catch (err) {
			// Handle any errors
			console.error("Error fetching data:", err);
		}
	}

	// Export the fetchData function
	return fetchData;
}
