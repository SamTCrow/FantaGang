<script lang="ts" setup>
	const { legaSelect } = await useGetLeghe();

	const state = reactive({});

	const giornata = ref();

	const items = computed(() => {
		const listaGiornate = [];
		if (legaSelect.value?.giornateTotali) {
			for (let x = 1; x <= legaSelect.value?.giornateTotali; x++) {
				const giornata = {
					name: `Giornata n° ${x}`,
					value: x,
				};
				listaGiornate.push(giornata);
			}

			return listaGiornate;
		}
	});
</script>

<template>
	<UContainer v-if="!legaSelect">
		<span class="text-4xl text-center text-pretty flex justify-center"> Seleziona una lega! </span>
	</UContainer>
	<UContainer v-else>
		<UCard v-auto-animate>
			<template #header>
				{{ legaSelect.nome }}
			</template>
			<div
				v-auto-animate
				class="space-y-2">
				<USelect
					v-model="giornata"
					placeholder="Seleziona giornata"
					:options="items"
					option-attribute="name" />

				<div v-if="giornata > 0">
					<UCard v-auto-animate>
						<template #header> Risultati {{ giornata }}° giornata</template>
            
					</UCard>
				</div>
			</div>
		</UCard>
	</UContainer>
</template>
