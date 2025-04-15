<script lang="ts" setup>
	const { data: listone } = useFetch("/api/quotazioni", { lazy: true });
	const columns = [
		{ key: "Nome", label: "Nome", sortable: true },
		{ key: "Squadra", label: "Squadra", sortable: true },
		{ key: "Ruolo", label: "Ruolo", sortable: true },
		{ key: "Quotazione", label: "Qt", sortable: true },
		{ key: "PartiteGiocate", label: "PG", sortable: true },
		{ key: "Goal", label: "G", sortable: true },
		{ key: "Assist", label: "A", sortable: true },
		{ key: "Ammonizioni", label: "Amm", sortable: true },
		{ key: "Espulsioni", label: "Esp", sortable: true },
		{ key: "RigoriTirati", label: "RT", sortable: true },
		{ key: "RigoriSegnati", label: "RS", sortable: true },
		{ key: "RigoriSbagliati", label: "RF", sortable: true },
		{ key: "RigoriParati", label: "RP", sortable: true },
		{ key: "MediaVoto", label: "MV", sortable: true },
		{ key: "MediaModificata", label: "MM", sortable: true },
	];

	const q = ref("");

	const filteredRows = computed(() => {
		if (!q.value) {
			return listone.value;
		}
		if (listone.value)
			return listone.value.filter((player) => {
				return Object.values(player).some((value) => {
					return String(value).toLowerCase().includes(q.value.toLowerCase());
				});
			});
	});
</script>

<template>
	<div
		v-if="filteredRows"
		class="space-y-4">
		<UInput
			v-model="q"
			placeholder="Ricerca" />
		<UTable
			sortable
			searchable
			:rows="filteredRows"
			:columns="columns">
			<template #Squadra-data="{ row }">
				<span>{{ row.Squadra.toUpperCase() }}</span>
			</template>
		</UTable>
	</div>
	<USkeleton
		v-else
		class="h-screen w-full" />
</template>
