<script>
	import ScrollToTop from '../../services/tools/top-anker.svelte';
	import { reloadPage } from '../../services/tools/utils.js';

</script>

<div class="page">
	<header>
		<img src="../assets/dzif-Logo.svg" alt="Logo des DZIF" />
		<h1>Kontakt</h1>
	</header>

	<div class="kontakt-outline">
		<button class="button-back" on:click={reloadPage}>Zurück</button>
		<div class="kontakt">
			<h2>Kontakt</h2>
			<p>
				<strong>Inhaltliche Anfragen:</strong><br>
				Dr. Berit Lange<br>
				Helmholtz-Zentrum für Infektionsforschung<br>
				Koordinatorin Bioressourcen, Biodaten und Digitale Gesundheit<br>
				E-Mail: <a href="mailto:tibbd@dzif.de">tibbd@dzif.de</a>
			</p>

			<p>
				<strong>Technische Anfragen:</strong><br>
				Patrick Skowronek<br>
				E-Mail: <a href="mailto:patrick.skowronek@dkfz-heidelberg.de">patrick.skowronek@dkfz-heidelberg.de</a>
			</p>
		</div>
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
			<!--<a href="/datenschutz">Datenschutz</a>-->
		</div>
	</footer>
</div>
<ScrollToTop />