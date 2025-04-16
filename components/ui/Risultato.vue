<script lang="ts" setup>
	import { calcoloGol } from "~/shared/utils/calcolaPunteggio";
	import type { Partita } from "~/types/types";
	interface Risultato {
		casa: number;
		ospite: number;
	}
	const partita = defineProps<Partita>();

	const gol = computed(() => calcoloGol(partita.puntiCasa ?? 0, partita.puntiOspite ?? 0));
</script>

<template>
	<div
		class="flex gap-2 p-2 md:p-4 md:text-lg text-xs outline outline-1 outline-offset-1 items-center align-middle">
		<div
			class="gap-4 w-full flex justify-around items-center flex-wrap-reverse md:flex-nowrap text-left align-middle">
			<span class="font-bold">{{ partita.puntiCasa }}</span>
			<span
				class="w-full grow"
				:class="
					gol.casa > gol.ospite
						? 'scale-105 text-primary-800 dark:text-primary-200  font-bold'
						: ''
				"
				>{{ partita.nomeCasa?.toUpperCase() }}</span
			>
		</div>
		<div class="gap-4 font-bold flex justify-center items-center align-middle">
			<span>{{ gol.casa }}</span>
			<span>-</span>
			<span>{{ gol.ospite }}</span>
		</div>
		<div
			class="gap-4 w-full flex justify-around items-center flex-wrap md:flex-nowrap text-right align-middle">
			<span
				class="w-full grow"
				:class="
					gol.ospite > gol.casa
						? 'scale-105 text-primary-800 dark:text-primary-200  font-bold'
						: ''
				"
				>{{ partita.nomeOspite?.toUpperCase() }}</span
			>
			<span class="font-bold">{{ partita.puntiOspite }}</span>
		</div>
	</div>
</template>

<style></style>
