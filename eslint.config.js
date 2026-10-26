import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import sveltePreprocess from 'svelte-preprocess';

export default ts.config(
	{
		// Replaces the former .eslintignore - flat config no longer reads that file.
		ignores: [
			'.DS_Store',
			'node_modules/',
			'build/',
			'.svelte-kit/',
			'package/',
			'dist/',
			'test-results/',
			'static/',
			'.env',
			'.env.*',
			'!.env.example',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock'
		]
	},

	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,

	// Turns off the stylistic rules that Prettier owns. Must stay last of the
	// shared configs so it can override what they enable.
	prettier,
	...svelte.configs.prettier,

	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},

	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
				extraFileExtensions: ['.svelte'],
				// Mirrors the sveltekit() options in vite.config.ts.
				svelteConfig: { preprocess: sveltePreprocess() }
			}
		}
	}
);
