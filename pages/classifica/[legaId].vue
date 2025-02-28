<script lang="ts" setup>
	const giornata = ref(1);
	const da = ref();
	const a = ref();
	const legaId = useRoute().params.legaId;

	const { data: legaInfo } = await useFetch<any>(() => `/api/leghe/${legaId}`, { lazy: true, method: "get" });

	const { data: classifica } = await useFetch(
		() => `/api/classifiche/${legaId}?from=${da.value ?? 1}&to=${a.value ?? 40}`,
		{
			lazy: true,
		}
	);

	const { data: partite, refresh: getPartite } = useFetch(() => `/api/partite/${legaId}/${giornata.value}`, {
		lazy: true,
	});

</script>

<template>
	<div>
		<UContainer>
			<UCard>
				<template #header>
					<div class="text-center pb-6 text-lg">
						{{ legaInfo?.nome.toUpperCase() }}
					</div>
					<div class="space-y-4">
						<UiSelettoreGiornata
							v-model="giornata"
							place-holder="Seleziona giornata..."
							@change="getPartite" />
						<UiRisultato
							v-for="partita in partite"
							v-bind="partita" />
					</div>
				</template>
				<div class="flex gap-6">
					<UiSelettoreGiornata
						v-model="da"
						class="w-32"
						place-holder="Da..." />
					<UiSelettoreGiornata
						v-model="a"
						class="w-32"
						place-holder="A..." />
				</div>
				<UTable
					v-if="classifica"
					:rows="classifica"
					:columns="columns" />
			</UCard>
		</UContainer>
	</div>
</template>

<style></style>
