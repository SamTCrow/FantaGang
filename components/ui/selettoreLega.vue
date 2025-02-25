<script lang="ts" setup>
	const { listaLeghe: leghe, getUserLeghe, legheLoading, legaSelect } = await useGetLeghe();
	const { user } = useUserSession();
	getUserLeghe();

	const options = computed(() => {
		if (leghe.value) {
			const list = leghe.value.map((lega) => ({
				nome: lega.nome,
				value: lega.id,
				amministratore: lega.createdBy === user.value?.id,
				icon: lega.createdBy === user.value?.id ? "heroicons-outline:star" : "",
				giornateTotali: lega.giornateTotali,
				giornateGiocate: lega.giornateGiocate,
				inizio: lega.inizio,
			}));
			return list;
		}
	});
</script>

<template>
	<USelectMenu
		searchable
		searchable-placeholder="Cerca una lega"
		clear-search-on-close
		:loading="legheLoading"
		placeholder="Scegli una lega"
		v-model="legaSelect"
		:options="options"
		option-attribute="nome" />
</template>
