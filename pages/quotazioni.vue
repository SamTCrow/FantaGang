<script lang="ts" setup>
	const { data: listone } = useFetch("/api/quotazioni", { lazy: true });
	const columns = [
		{ key: "Nome", label: "Nome", sortable: true },
		{ key: "Squadra", label: "Squadra", sortable: true },
		{ key: "Ruolo", label: "R", sortable: true },
		{ key: "Quotazione", label: "Qt", sortable: true },
		{ key: "PartiteGiocate", label: "PG", sortable: true },
		{ key: "Goal", label: "G", sortable: true },
		{ key: "Assist", label: "A", sortable: true },
		{ key: "Ammonizioni", label: "Am", sortable: true },
		{ key: "Espulsioni", label: "Es", sortable: true },
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
			return listone.value.filter((player) =>
				Object.values(player).some((value) =>
					String(value).toLowerCase().includes(q.value.toLowerCase())
				)
			);
	});
</script>

<template>
	<UContainer>
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
				:columns="columns"
				class="overflow-scroll">
				<template #Squadra-data="{ row }">
					<span>{{ row.Squadra.toUpperCase() }}</span>
				</template>
				<template #Quotazione-data="{ row }">
					<span>{{ Number(row.Quotazione) }}</span>
				</template>
			</UTable>
		</div>
		<USkeleton
			v-else
			class="h-screen w-full" />
	</UContainer>
</template>
