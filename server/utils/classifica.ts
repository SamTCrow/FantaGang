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

interface Punteggio {
	casa: number;
	ospite: number;
}

export type Classifica = risultatiSquadra[];

export const calcoloClassifica = async (risultati: Giornata[]) => {
	const classifica = new Map<number, Omit<risultatiSquadra, "id">>();
	const calcoloGol = (puntiCasa: number, puntiOspite: number): Punteggio => {
		if (puntiCasa < 66 && puntiOspite < 66) {
			const diff = Math.abs(puntiCasa - puntiOspite);
			if (diff >= 6) {
				return {
					casa: puntiCasa > puntiOspite ? 1 : 0,
					ospite: puntiOspite > puntiCasa ? 1 : 0,
				};
			}
			return { casa: 0, ospite: 0 };
		}
		return {
			casa: Math.max(0, Math.floor((puntiCasa - 66) / 6) + 1),
			ospite: Math.max(0, Math.floor((puntiOspite - 66) / 6) + 1),
		};
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

			const gol = calcoloGol(partita.puntiCasa, partita.puntiOspite);

			squadraCasa.gf += gol.casa;
			squadraCasa.gs += gol.ospite;
			squadraCasa.tot += partita.puntiCasa;
			squadraCasa.pt += 1;
			squadraOspite.gs += gol.ospite;
			squadraOspite.gs += gol.casa;
			squadraOspite.tot += partita.puntiOspite;
			squadraOspite.pt += 1;

			if (gol.casa > gol.ospite) {
				squadraCasa.pv += 1;
				squadraCasa.pti += 3;
				squadraOspite.pp += 1;
			} else if (gol.casa < gol.ospite) {
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
		.sort((a, b) => {
			if (b.pti !== a.pti) {
				return b.pti - a.pti;
			}
			return b.tot - a.tot;
		})
		.map((squadra, index) => ({
			...squadra,
			posizione: index + 1,
		}));

	return classificaElaborata;
};
