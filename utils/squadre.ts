export const useGetSquadre = async () => {
	const { data: listaSquadre, refresh: listaSquadreRefresh } = await useFetch(() => "/api/squadre/squadre", { lazy: true });
	return { listaSquadre, listaSquadreRefresh };
};
