import { env } from "$env/dynamic/private"
import { redirect } from "@sveltejs/kit";
import md5 from "md5";

const sign_method = (kv: Record<string, string>): string => {
	let buf = '';

	Object.keys(kv).sort().forEach((k) => {
		buf += k;
		buf += kv[k];
	});

	buf += env.LASTFM_API_SHARED_SECRET;

	return md5(buf);
};

export const redirect_to_sign_in = (calling_url: URL): string => {
	let auth_cb = new URL(calling_url);
	auth_cb.pathname = '/auth';
	return `https://last.fm/api/auth/?api_key=${env.LASTFM_API_KEY}&cb=${auth_cb}`;

}

// export const gen_url = (kv: Record<string, string>): string => {

// }

export const generate_session = async (user_token: string): Promise<string> => {
	const signature = sign_method({
		'token': user_token,
		'api_key': env.LASTFM_API_KEY,
		'method': 'auth.getSession'
	});

	const session_url = `https://ws.audioscrobbler.com/2.0/?method=auth.getSession&token=${user_token}&api_key=${env.LASTFM_API_KEY}&format=json&api_sig=${signature}`;

	const response = await fetch(session_url);
	const json = await response.json();

	if (json.error) {
		throw json;
	} else {
		return JSON.stringify(json.session);
	}
}