<script>
	import ScrollToTop from '../../services/tools/top-anker.svelte';
	import { reloadPage } from '../../services/tools/utils.js';
</script>

<div class="page">
	<header>
		<img src="../assets/dzif-Logo.svg" alt="Logo des DZIF" />
		<h1>Impressum</h1>
	</header>

	<div class="impressum-outline">
		<button class="button-back" on:click={reloadPage}>Zurück</button>
		<div class="impressum">
			<h2>Impressum</h2>
			<p><strong>Angaben gemäß § 5 TMG</strong></p>
			<p>
				<strong>Helmholtz-Zentrum für Infektionsforschung GmbH</strong><br>
				Inhoffenstraße 7, 38124 Braunschweig, Deutschland
			</p>

			<p>
				<strong>Vertreten durch:</strong><br>
				Geschäftsführung: Prof. Dr. Dirk Heinz, Dr. Rolf Apweiler
			</p>

			<p>
				<strong>Kontakt:</strong><br>
				E-Mail: <a href="mailto:tibbd@dzif.de">tibbd@dzif.de</a><br>
				Telefon: +49 (0)531 6181-0
			</p>

			<p>
				<strong>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:</strong><br>
				Dr. Berit Lange<br>
				Helmholtz-Zentrum für Infektionsforschung<br>
				Koordinatorin Bioressourcen, Biodaten und Digitale Gesundheit<br>
				Inhoffenstraße 7, 38124 Braunschweig, Deutschland
			</p>

			<p>
				<strong>Verweise und Links:</strong><br>
				<a href="https://www.dzif.de/de/infrastruktur/bioressourcen-biodaten-und-digitale-gesundheit" target="_blank">
					Bioressourcen, Biodaten und Digitale Gesundheit
				</a>
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