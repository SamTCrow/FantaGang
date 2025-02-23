type Lega = {
	id: number;
	nome: string;
	createdBy: number | null;
	createdAt: Date;
	createdByUsername: string | null;
	inizio: Date | null;
	giornateTotali: number;
	giornateGiocate: number;
};

type ListaLeghe = Lega[];

export const useGetLeghe = async () => {
	const listaLeghe = useState<ListaLeghe | undefined>("listaLeghe", () => undefined);
	const legheLoading = useState<boolean>("legheLoading", () => false);
	const legaSelect = useState<number | undefined>("legaSelect", () => undefined);

	const getUserLeghe = async () => {
		legheLoading.value = true;
		const lista = await $fetch("/api/user/leghe");
		if (lista) {
			listaLeghe.value = lista.map((lega: any) => ({
				...lega,
				createdAt: new Date(lega.createdAt),
			}));
		}
		legheLoading.value = false;
	};
	return { listaLeghe, getUserLeghe, legheLoading, legaSelect };
};
