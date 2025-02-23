<script lang="ts" setup>
	const { listaLeghe: leghe, getUserLeghe, legheLoading, legaSelect } = await useGetLeghe();
	const { user } = useUserSession();
	getUserLeghe();
	console.log(leghe.value);
	const options = computed(() => {
		if (leghe.value) {
			const list = leghe.value.map((lega) => ({
				name: lega.nome,
				value: lega.id,
				amministratore: lega.createdBy === user.value?.id,
				icon: lega.createdBy === user.value?.id ? "heroicons-outline:star" : "",
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
		option-attribute="name"
	/>
</template>
