import { A } from "solid-start";
import Posts from "~/components/Posts";
import { createRoot } from "solid-js";
import { Router } from "solid-start/islands/server-router";
export default function Home() {
	return (
		<>
			<Posts />
		</>
	);
}
