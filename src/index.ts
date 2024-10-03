/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


const OPENAI_URL = 'https://api.openai.com';


export default {
	async fetch(request, env, ctx): Promise<Response> {

		const url = new URL(request.url);

		// for testing
		if (url.pathname.startsWith("/test")) {
			return new Response("Ok");
		}
		
		url.host = OPENAI_URL.replace(/^https?:\/\//, '');

		console.log(url.toString());
		

		const modifiedRequest = new Request(url.toString(), {
		  headers: request.headers,
		  method: request.method,
		  body: request.body,
		  redirect: 'follow'
		});
		
		console.log('request:', modifiedRequest.method, modifiedRequest.url, modifiedRequest.headers);
		
		const response = await fetch(modifiedRequest);
		const modifiedResponse = new Response(response.body, {
		  status: response.status,
		  statusText: response.statusText,
		  headers: response.headers
		});

		console.log('response:', response.status, response.statusText, response.headers);

		modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
		
		return modifiedResponse;
	},
} satisfies ExportedHandler<Env>;
