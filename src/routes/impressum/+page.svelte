<script>
	import ScrollToTop from '../../services/tools/top-anker.svelte';
		import { reloadPage } from '../../services/tools/utils.js';
</script>

<div class="page">
	<header>
		<img src="../assets/dzif-Logo.svg" alt="Logo des DZIF" />
		<h1>Impressum</h1>
	</header>

	<div class="impressum">
		<button on:click={reloadPage}>BACK</button>
	</div>

	<footer class="footer">
		<div class="footer__left-section">
			<div class="footer__made-with">
				Made with ♥ and <a href="https://github.com/samply/lens">samply/lens-core</a>
			</div>
			<div class="footer__logo">
				<img src="../assets/dzg-logo-2022.svg" alt="Logo des DZG" />
			</div>
		</div>
		<div class="footer__links">
			<a href="/impressum">Impressum</a>
			<a href="/kontakt">Kontakt</a>
		</div>
	</footer>
</div>
<ScrollToTop />