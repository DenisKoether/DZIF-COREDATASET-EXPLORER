<script>
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
	on:click={scrollToTop}
	aria-label="Scroll to top"
>
	⬆️
</button>
