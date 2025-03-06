<script lang="ts" setup>
	const legaId = useRoute().params.legaId;

	const { data: legaInfo } = await useFetch(() => `/api/leghe/${Number(legaId)}`, {
		method: "get",
	});

	const giornata = ref(legaInfo.value?.ultimaGiornata ?? 1);
	const {
		data: partite,
		refresh: getPartite,
		status,
	} = await useFetch(() => `/api/partite/${legaId}/${giornata.value}`, {});
	const print = () => window.print()
</script>

<template>
	<div>
		<UContainer>
			<UCard>
				<template #header>
					<div class="text-center pb-6 text-lg relative">
						<ULink
							:to="'/lega/' + legaInfo?.id"
							class="hover:font-bold hover:opacity-80"
							>{{ legaInfo?.nome.toUpperCase() }}</ULink
						>
						<UButton
							icon="heroicons:printer"
							class="absolute right-0"
							@click="print" />
					</div>
					<div
						class="space-y-4"
						v-auto-animate>
						<UiSelettoreGiornata
							:giornate="legaInfo?.giornateTotali ?? 0"
							v-model="giornata"
							place-holder="Seleziona giornata..."
							@change="getPartite" />
						<USkeleton
							v-if="status === 'pending'"
							class="h-32 w-full" />
						<UiRisultato
							v-else
							v-for="partita in partite"
							:key="partita.id"
							v-bind="partita" />
					</div>
				</template>
				<Classifica
					:giornateTotali="legaInfo?.giornateTotali ?? 0"
					:legaId="Number(legaId)" />
			</UCard>
		</UContainer>
	</div>
</template>

<style></style>
