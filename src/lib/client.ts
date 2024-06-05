import { type Writable, writable } from "svelte/store";
import DOMPurify from "dompurify";

export interface ClientState {
	song_title: string,
	album_title: string,
	artist_title: string,
	large_image_url: string,
};

export class Client {
	private user: string;
	private api_pub_key: string;
	private session_key: string;

	/**
	 * The current error, if any
	 */
	error: Writable<string | null>
	/**
	 * The current state, if any
	 */
	state: Writable<ClientState | null>

	

	constructor(username: string, session_token: string, api_key: string) {
		this.user = username;
		this.session_key = session_token;
		this.api_pub_key = api_key;
		this.error = writable(null);
		this.state = writable(null);
	}

	clear_error() {
		this.error.set(null);
	}

	private async make_request(): Promise<Response> {
		return await fetch(
			`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&format=json&api_key=${this.api_pub_key}&user=${this.user}`,
		);
	}

	private async update_state_from_json(object: any) {
		let most_recent_track = object['recenttracks']['track'][0];

		if (most_recent_track['@attr']['nowplaying'] != "true") {
			this.state.set(null);
			this.error.set('No Song Playing');
		} else {
			this.clear_error();
		}

		const new_state: ClientState = {
			song_title: most_recent_track['name'],
			album_title: most_recent_track['album']['#text'],
			artist_title: most_recent_track['artist']['#text'],
			large_image_url: most_recent_track['image'][most_recent_track['image'].length - 1]['#text']
		};

		this.state.set(new_state);
	}

	async update_state() {
		try {
			let attempt_count = 0;
			let message = '';
			while (attempt_count < 3) {
				let response = await this.make_request();
				let json = await response.json();
				// server error
				if (response.status > 499) {
					message = json.message;
					continue;
				}
				else if (response.status > 399) {
					this.error.set(json.message as string);
					return;
				} else {
					this.clear_error();
					this.update_state_from_json(json);
					return;
				}
			}

			this.error.set(message);
		} catch (e) {
			console.error(e);
			this.error.set("an error has occured, check the console");
		}
	}
}