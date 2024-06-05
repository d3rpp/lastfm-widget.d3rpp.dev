import type { PageServerLoad, PageServerLoadEvent } from "./$types";
import { env } from "$env/dynamic/private";

import { TOKEN_COOKIE_NAME } from "$lib";

import { redirect } from "@sveltejs/kit";


export const load = (({ url, cookies }: PageServerLoadEvent) => {
	const last_fm_token = cookies.get(TOKEN_COOKIE_NAME);
	if (last_fm_token == undefined) {
		let auth_cb = new URL(url);
		auth_cb.pathname = '/auth';


		const auth_url = `https://last.fm/api/auth/?api_key=${env.LASTFM_API_KEY}&cb=${auth_cb}`

		redirect(307, auth_url);
	} else {
		return {
			session_token: last_fm_token
		};
	}
}) satisfies PageServerLoad;
