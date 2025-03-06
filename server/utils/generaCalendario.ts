interface Squadre {
	id: number;
	nome: string;
}
interface Partita {
	legaId: number;
	numeroGiornata: number;
	squadraCasa: number;
	squadraOspite: number;
}

export const generaCalendario = (squadre: Squadre[], ar = true, legaId: number, stagioni = 1) => {
	const listaSquadre =
		squadre.length % 2 !== 0 ? [...squadre, { id: null, nome: "bye" }] : [...squadre];
	const ns = listaSquadre.length;
	const giornate = ns - 1;
	const ancora = squadre[0];
	const squadreRotanti = listaSquadre.slice(1);
	const calendario: Partita[] = [];

	for (let giornata = 0; giornata < giornate; giornata++) {
		const partiteGiornata: Partita[] = [];
		const avversarioAncora = squadreRotanti[giornata];
		if (avversarioAncora.id !== null) {
			partiteGiornata.push({
				legaId: legaId,
				numeroGiornata: giornata + 1,
				squadraCasa: ancora.id,
				squadraOspite: avversarioAncora.id,
			});
		}
		for (let i = 0; i < Math.floor(squadreRotanti.length / 2); i++) {
			const squadraCasaIndex = (giornata + i + 1) % giornate;
			const squadraOspiteIndex = (giornata - i - 1 + giornate) % giornate;

			if (squadraCasaIndex !== giornata && squadraOspiteIndex !== giornata) {
				const squadraCasa = squadreRotanti[squadraCasaIndex];
				const squadraOspite = squadreRotanti[squadraOspiteIndex];
				if (squadraCasa.id !== null && squadraOspite.id !== null) {
					partiteGiornata.push({
						legaId: legaId,
						numeroGiornata: giornata + 1,
						squadraCasa: squadraCasa.id,
						squadraOspite: squadraOspite.id,
					});
				}
			}
		}
		calendario.push(...partiteGiornata);
	}
	if (ar === true) {
		const ritorno = calendario.map((p) => ({
			legaId: legaId,
			numeroGiornata: p.numeroGiornata + giornate,
			squadraCasa: p.squadraCasa,
			squadraOspite: p.squadraOspite,
		}));
		calendario.push(...ritorno);
	}

	return calendario;
};
