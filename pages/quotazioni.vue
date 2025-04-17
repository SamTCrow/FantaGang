<script lang="ts" setup>
	const { data: listone, status } = await useFetch("/api/quotazioni", { lazy: true });
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

	const roles = [
		{
			name: "Portiere",
			value: "P",
		},
		{
			name: "Attaccante",
			value: "A",
		},
		{ name: "Centrocampista", value: "C" },
		{ name: "Difensore", value: "D" },
		{ name: "Tutti", value: "" },
	];
	const q = ref("");
	const role = ref<string>("");
	const filteredRows = computed(() => {
		if (!q.value && !role.value) {
			return listone.value;
		}
		if (listone.value)
			return listone.value.filter(
				(player) =>
					(player.Nome?.toLowerCase().includes(q.value) ||
						player.Squadra?.toLowerCase().includes(q.value)) &&
					(role.value ? player.Ruolo?.toLowerCase() === role.value?.toLowerCase() : true)
			);
	});
</script>

<template>
	<UContainer>
		<div class="space-y-4">
			<div class="flex gap-4">
				<UInput
					v-model="q"
					placeholder="Ricerca" />
				<USelect
					v-model="role"
					:options="roles"
					option-attribute="name" />
			</div>
			<UTable
				sortable
				searchable
				:loading="status === 'pending'"
				:rows="filteredRows ?? []"
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
	</UContainer>
</template>
