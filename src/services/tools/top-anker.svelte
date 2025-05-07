<script lang="ts">
	import { onMount } from 'svelte';

	let isVisible = false;

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const onScroll = () => {
		isVisible = window.scrollY > 100;
	};

	onMount(() => {
		window.addEventListener('scroll', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	});

</script>

<button
	class="scroll-to-top {isVisible ? 'visible' : ''}"
	onclick={scrollToTop}
	aria-label="Scroll to top"
>
	<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#007bff"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg>
</button>
