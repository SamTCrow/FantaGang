<script lang="ts" setup>
	import { calcoloGol } from "~/shared/utils/calcolaPunteggio";
	import type { Partita } from "~/types/types";
	const partita = defineProps<Partita>();
	interface Risultato {
		casa: number;
		ospite: number;
	}

	const gol = computed(() => calcoloGol(partita.puntiCasa, partita.puntiOspite));
</script>

<template>
	<div
		class="flex gap-2 p-2 md:p-4 md:text-lg text-xs justify-evenly outline outline-1 outline-offset-1 text-center">
		<div class="gap-4 w-full flex justify-around items-center">
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
		<div class="gap-2 md:gap-4 font-bold flex justify-center items-center">
			<span class="">{{ gol.casa }}</span>
			<span class="">-</span>
			<span class="">{{ gol.ospite }}</span>
		</div>
		<div class="gap-4 w-full flex justify-around items-center">
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
