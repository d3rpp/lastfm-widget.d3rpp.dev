import type { PageServerLoad, PageServerLoadEvent } from "./$types";
import { env } from "$env/dynamic/private";

import { SESSION_TOKEN_NAME } from "$lib";

import { redirect_to_sign_in } from "$lib/server/server_util";
import { redirect } from "@sveltejs/kit";


export const load = (async ({ url, cookies }: PageServerLoadEvent) => {
	const last_fm_session_token = cookies.get(SESSION_TOKEN_NAME);
	if (last_fm_session_token == undefined) {
		redirect(307, redirect_to_sign_in(url));
	} else {
		return {
			user: JSON.parse(last_fm_session_token) as { name: string, key: string },
			// this is technically a public key since it's in all of the request URLs anyway
			// as such this is fine.
			public_api_key: env.LASTFM_API_KEY
		};
	}
}) satisfies PageServerLoad;
