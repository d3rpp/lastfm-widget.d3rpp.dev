import type { RequestHandler, RequestEvent } from "./$types";
import { TOKEN_COOKIE_NAME } from "$lib";
import { redirect, error } from "@sveltejs/kit";

export const GET = (({ url, cookies }: RequestEvent) => {
	const returned_token = url.searchParams.get('token')
	if (returned_token == undefined) {
		error(400, "");
	}

	let expires = new Date();  
	expires.setFullYear(expires.getFullYear() + 1);

	cookies.set(TOKEN_COOKIE_NAME, returned_token, { path: '/', expires });

	let return_url = new URL(url);
	return_url.pathname = "/";

	throw redirect(302, return_url);
}) satisfies RequestHandler;