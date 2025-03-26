<script>
	import ScrollToTop from '../../services/tools/top-anker.svelte';
</script>

<div class="page">
	<header>
		<img src="../assets/dzif-Logo.svg" alt="Logo des DZIF" />
		<h1>Datenschutz</h1>
	</header>


	<div class="datenschutz">
		<button class="button-back" onclick="history.back()">Zurück</button>
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
			<a href="/datenschutz">Datenschutz</a>
		</div>
	</footer>
</div>
<ScrollToTop />