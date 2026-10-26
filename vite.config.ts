import { sveltekit } from '@sveltejs/kit/vite';
import sveltePreprocess from 'svelte-preprocess';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	server: {
    	allowedHosts: ['bridgehead.dev.dzif.de']
	},
	plugins: [
		// SvelteKit 3 no longer reads svelte.config.js - config goes here.
		sveltekit({
			preprocess: sveltePreprocess()
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
