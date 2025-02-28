<script lang="ts" setup>
	import type { Partita } from "~/types/types";
	const partita = defineProps<Partita>();
	interface Risultato {
		casa: number;
		ospite: number;
	}

	const calcoloGol = (puntiCasa: number, puntiOspite: number): Risultato => {
		if (puntiCasa < 66 && puntiOspite < 66) {
			const diff = Math.abs(puntiCasa - puntiOspite);
			if (diff >= 6) {
				return {
					casa: puntiCasa > puntiOspite ? 1 : 0,
					ospite: puntiOspite > puntiCasa ? 1 : 0,
				};
			}
			return { casa: 0, ospite: 0 };
		}

		return {
			casa: Math.max(0, Math.floor((puntiCasa - 66) / 6) + 1),
			ospite: Math.max(0, Math.floor((puntiOspite - 66) / 6) + 1),
		};
	};

	const gol = computed(() => calcoloGol(partita.puntiCasa, partita.puntiOspite));
</script>

<template>
	<div class="flex p-6 text-lg justify-evenly outline outline-1 outline-offset-1 text-center">
		<div class="gap-4 w-full flex justify-around">
			<span class="font-bold">{{ partita.puntiCasa }}</span>
			<span
				class="w-full grow line-clamp-1"
				:class="
					gol.casa > gol.ospite ? 'scale-105 text-primary-800 dark:text-primary-200 text-lg font-bold' : ''
				"
				>{{ partita.nomeCasa?.toUpperCase() }}</span
			>
		</div>
		<div class="gap-4 font-bold flex justify-center">
			<span class="">{{ gol.casa }}</span>
			<span class="">-</span>
			<span class="">{{ gol.ospite }}</span>
		</div>
		<div class="gap-4 w-full flex justify-around">
			<span
				class="w-full grow line-clamp-1"
				:class="
					gol.ospite > gol.casa ? 'scale-105 text-primary-800 dark:text-primary-200 text-lg font-bold' : ''
				"
				>{{ partita.nomeOspite?.toUpperCase() }}</span
			>
			<span class="font-bold">{{ partita.puntiOspite }}</span>
		</div>
	</div>
</template>

<style></style>
