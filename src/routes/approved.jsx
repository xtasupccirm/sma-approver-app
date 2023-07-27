import { A } from "solid-start";
import Posts from "~/components/Posts";
import { createRoot } from "solid-js";
import { Router } from "solid-start/islands/server-router";
import Postsall from "~/components/Postsall";
export default function Approved() {
	return (
		<>
			<Postsall />
		</>
	);
}
