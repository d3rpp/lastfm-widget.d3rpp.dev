import type { RequestHandler, RequestEvent } from "./$types";
import { SESSION_TOKEN_NAME, TOKEN_COOKIE_NAME } from "$lib";
import { redirect, error } from "@sveltejs/kit";
import { generate_session, redirect_to_sign_in } from "$lib/server/server_util";

export const GET = (async ({ url, cookies }: RequestEvent) => {
	const returned_token = url.searchParams.get('token');

	if (returned_token == undefined) {
		if (cookies.get(SESSION_TOKEN_NAME)) {
			redirect(302, '/');
		} else {
			redirect(307, redirect_to_sign_in(url));
		}
	}

	try {
		const session = await generate_session(returned_token);
		let expires = new Date();  
		expires.setFullYear(expires.getFullYear() + 1);
		cookies.set(SESSION_TOKEN_NAME, session, { path: '/', expires });
	} catch (e: any) {
		console.error(e);
	}

	let return_url = new URL(url);
	return_url.pathname = "/";
	return_url.searchParams.delete('token');

	throw redirect(302, return_url);
}) satisfies RequestHandler;