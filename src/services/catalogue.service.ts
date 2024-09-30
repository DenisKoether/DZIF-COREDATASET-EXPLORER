// This file includes a function to the the catalogue

// Use this function to get the catalogue from this project
export async function getStaticCatalogue<T>(path: string): Promise<T> {
	const response = await fetch(path);
	const data = await response.json();
	return data;
}

// Daten für Catalogue holen?
export async function getCatalogueFromServer<T>(
	blazeServerUrl = 'http://localhost:8082'
): Promise<T> {
	try {
		const response = await fetch(blazeServerUrl);
		if (!response.ok) {
			throw new Error(
				`Fehler beim Abrufen der Daten vom Blaze-Server: ${response.statusText}`
			);
		}

		const data = await response.json(); // JSON-Daten parsen und zurückgeben
		return data;
	} catch (error) {
		console.error('Fehler beim Abrufen des Katalogs vom Blaze-Server:', error);
		throw error;
	}
}

export const catalogueText = {
	group: 'Group',
	collapseButtonTitle: 'Collapse Tree',
	expandButtonTitle: 'Expand Tree',
	numberInput: {
		labelFrom: 'von',
		labelTo: 'bis'
	}
};
