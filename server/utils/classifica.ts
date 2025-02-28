type Risultato = {
	idCasa: number;
	squadraCasa: string;
	puntiCasa: number;
	idOspite: number;
	squadraOspite: string;
	puntiOspite: number;
};

type risultatiSquadra = {
	posizione: number;
	nome: string;
	id: number;
	pti: number;
	pt: number;
	pv: number;
	pn: number;
	pp: number;
	gf: number;
	gs: number;
	tot: number;
};

export type Giornata = {
	numero: number;
	risultati: Risultato[];
};

export type Classifica = risultatiSquadra[];

export const calcoloClassifica = async (risultati: Giornata[]) => {
	const classifica = new Map<number, Omit<risultatiSquadra, "id">>();

	const calcoloGol = (punti: number) => {
		if (punti < 66) {
			return 0;
		}
		return Math.floor((punti - 66) / 6) + 1;
	};

	risultati.forEach((risultato) => {
		risultato.risultati.forEach((partita) => {
			const squadraCasa = classifica.get(partita.idCasa) ?? {
				nome: partita.squadraCasa,
				posizione: 0,
				pt: 0,
				pti: 0,
				pv: 0,
				pn: 0,
				pp: 0,
				gf: 0,
				gs: 0,
				tot: 0,
			};

			const squadraOspite = classifica.get(partita.idOspite) ?? {
				nome: partita.squadraOspite,
				posizione: 0,
				pti: 0,
				pt: 0,
				pv: 0,
				pn: 0,
				pp: 0,
				gf: 0,
				gs: 0,
				tot: 0,
			};

			const golCasa = calcoloGol(partita.puntiCasa);
			const golOspite = calcoloGol(partita.puntiOspite);

			squadraCasa.gf += golCasa;
			squadraCasa.gs += golOspite;
			squadraCasa.tot += partita.puntiCasa;
			squadraCasa.pt += 1;
			squadraOspite.gs += golOspite;
			squadraOspite.gs += golCasa;
			squadraOspite.tot += partita.puntiOspite;
			squadraOspite.pt += 1;

			if (golCasa > golOspite) {
				squadraCasa.pv += 1;
				squadraCasa.pti += 3;
				squadraOspite.pp += 1;
			} else if (golCasa < golOspite) {
				squadraOspite.pv += 1;
				squadraOspite.pti += 3;
				squadraCasa.pp += 1;
			} else {
				squadraCasa.pn += 1;
				squadraOspite.pn += 1;
				squadraCasa.pti += 1;
				squadraOspite.pti += 1;
			}

			classifica.set(partita.idCasa, squadraCasa);
			classifica.set(partita.idOspite, squadraOspite);
		});
	});
	const classificaElaborata = Array.from(classifica.values())
		.sort((a, b) => b.pti - a.pti)
		.map((squadra, index) => ({
			...squadra,
			posizione: index + 1,
		}));

	return classificaElaborata;
};
