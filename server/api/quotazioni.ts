import * as cheerio from "cheerio";
//TODO add cache
export default defineCachedEventHandler(
	async (event) => {
		const $ = await cheerio.fromURL(
			"https://www.gazzetta.it/calcio/fantanews/statistiche/serie-a-2024-25/"
		);
		const $selected = $(".playerStats");

		const listaQuotazioni = $selected.extract({
			Players: [
				{
					selector: "tr",
					value: {
						Nome: { selector: ".field-giocatore a", value: "innerText" },
						Squadra: ".hidden-team-name",
						Ruolo: ".field-ruolo",
						Quotazione: ".field-q",
						PartiteGiocate: ".field-pg",
						Goal: ".field-g",
						Assist: ".field-a",
						Ammonizioni: ".field-am",
						Espulsioni: ".field-es",
						RigoriTirati: ".field-rt",
						RigoriSegnati: ".field-r",
						RigoriSbagliati: ".field-rs",
						RigoriParati: ".field-rt",
						MediaVoto: ".field-mv",
						MediaModificata: ".field-mm",
					},
				},
			],
		}).Players;
		listaQuotazioni.shift();
		const nuovalista = listaQuotazioni.map((p) => {
			return {
				...p,
				Quotazione: Number(p.Quotazione),
				PartiteGiocate: Number(p.PartiteGiocate),
				Goal: Number(p.Goal),
				Assist: Number(p.Assist),
				Ammonizioni: Number(p.Ammonizioni),
				Espulsioni: Number(p.Espulsioni),
				MediaVoto: Number(p.MediaVoto),
				MediaModificata: Number(p.MediaModificata),
				RigoriTirati: Number(p.RigoriTirati),
				RigoriSbagliati: Number(p.RigoriSbagliati),
				RigoriSegnati: Number(p.RigoriSegnati),
				RigoriParati: Number(p.RigoriParati),
			};
		});

		return nuovalista;
	},
	{
		maxAge: 1 * 60 * 10,
	}
);
