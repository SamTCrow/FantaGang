<script lang="ts" setup>
	const props = defineProps<{
		legaId: number;
		giornateTotali: number | undefined;
	}>();

	const da = ref();
	const a = ref();

	const { data: classifica } = await useFetch(
		() => `/api/classifiche/${props.legaId}?from=${da.value ?? 1}&to=${a.value ?? 40}`,
		{
			lazy: true,
		}
	);

	const columns = [
		{
			key: "posizione",
			label: "Posizione",
		},
		{
			key: "nome",
			label: "Nome",
		},
		{
			key: "pti",
			label: "PTI",
		},
		{
			key: "pt",
			label: "PT",
		},
		{
			key: "pv",
			label: "PV",
		},
		{
			key: "pn",
			label: "PN",
		},
		{
			key: "pp",
			label: "PP",
		},
		{
			key: "gf",
			label: "GF",
		},
		{
			key: "gs",
			label: "GS",
		},
		{
			key: "tot",
			label: "TOT",
		},
	];
</script>

<template>
	<div>
		<div class="flex gap-6">
			<UiSelettoreGiornata
				:giornate="props.giornateTotali"
				v-model="da"
				class="w-32"
				place-holder="Da..." />
			<UiSelettoreGiornata
				:giornate="props.giornateTotali"
				v-model="a"
				class="w-32"
				place-holder="A..." />
		</div>
		<UTable
			v-if="classifica"
			:rows="classifica"
			:columns="columns" />
	</div>
</template>
