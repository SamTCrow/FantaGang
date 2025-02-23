type Squadra = {
	id: number;
	nome: string;
	presidente: string;
	userId: number | null;
	lega: string | null;
	legaId: number | null;
	stemma: string | null;
	createdAt: Date;
};

type ListSquadre = Squadra[];

export const useGetSquadre = async () => {
	const listaSquadre = useState<ListSquadre | undefined>("listaSquadre", () => undefined);
	const loadingSquadre = useState<boolean>("loadingSquadre", () => false);

	const getUserSquadre = async () => {
		loadingSquadre.value = true;
		const { data: list, success } = await $fetch("/api/user/squadre");
		if (success && list) {
			listaSquadre.value = list.map((lista) => ({ ...lista, createdAt: new Date(lista.createdAt) }));
		}
		loadingSquadre.value = false;
	};

	return { listaSquadre, loadingSquadre, getUserSquadre };
};
