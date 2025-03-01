export interface Punteggio {
	casa: number;
	ospite: number;
}

export const calcoloGol = (puntiCasa: number, puntiOspite: number): Punteggio => {
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
