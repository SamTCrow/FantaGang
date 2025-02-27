<script lang="ts" setup>
	import type { Partita } from "~/types/types";
	const partita = defineProps<Partita>();

	const calcoloGol = (punti: number) => {
		if (punti < 66) return 0;
		return Math.floor((punti - 66) / 6) + 1;
	};

	const gol = computed(() => ({
		casa: calcoloGol(partita.puntiCasa),
		ospite: calcoloGol(partita.puntiOspite),
	}));
</script>

<template>
	<div class="flex w-full p-6 text-xl justify-evenly outline outline-1 outline-offset-1 text-center">
		<div class="gap-4 w-full flex justify-around">
			<span class="font-bold w-full">{{ partita.puntiCasa }}</span>
			<span
				class="w-full"
				:class="gol.casa > gol.ospite ? 'scale-125 text-primary-800 dark:text-primary-200' : ''"
				>{{ partita.nomeCasa?.toUpperCase() }}</span
			>
		</div>
		<div class="gap-4 font-bold w-full flex justify-center">
			<span class="">{{ gol.casa }}</span>
			<span class="">-</span>
			<span class="">{{ gol.ospite }}</span>
		</div>
		<div class="gap-4 w-full flex justify-around">
			<span
				class="w-full"
				:class="gol.ospite > gol.casa ? 'scale-125 text-primary-800 dark:text-primary-200' : ''"
				>{{ partita.nomeOspite?.toUpperCase() }}</span
			>
			<span class="font-bold w-full">{{ partita.puntiOspite }}</span>
		</div>
	</div>
</template>

<style></style>
