<script lang="ts" setup>
	const { legaSelect } = await useGetLeghe();
	const state = reactive({});
	const nomeLega = "Nome a caso per ora";
	const giornate = 12;
	const giornateInLega = 12;
	const giornata = ref();
	const items = computed(() => {
		const listaGiornate = [];
		for (let x = 1; x <= giornate; x++) {
			const giornata = {
				name: `Giornata n° ${x}`,
				value: x,
			};
			listaGiornate.push(giornata);
		}
		return listaGiornate;
	});
</script>

<template>
	<UContainer v-if="!legaSelect">
		<span class="text-4xl text-center text-pretty flex justify-center"> Seleziona una lega! </span>
	</UContainer>
	<UContainer v-else>
		<UCard v-auto-animate>
			<template #header>
				{{ nomeLega }}
			</template>
			<div v-auto-animate>
				<USelect
					v-model="giornata"
					placeholder="Giornata"
					:options="items"
					option-attribute="name" />

				<div v-if="giornata > 0">
					<UForm :state="state"> </UForm>
				</div>
			</div>
		</UCard>
	</UContainer>
</template>
