<script lang="ts" setup>
	const giornata = ref(1);
	const legaId = useRoute().params.legaId;

	const { data: legaInfo } = await useFetch(() => `/api/leghe/${Number(legaId)}`, {
		lazy: true,
		method: "get",
	});

	const {
		data: partite,
		refresh: getPartite,
		status,
	} = useFetch(() => `/api/partite/${legaId}/${giornata.value}`, {
		lazy: true,
	});
</script>

<template>
	<div>
		<UContainer>
			<UCard>
				<template #header>
					<div class="text-center pb-6 text-lg">
						<ULink
							:to="'/lega/' + legaInfo?.id"
							class="hover:font-bold hover:opacity-80"
							>{{ legaInfo?.nome.toUpperCase() }}</ULink
						>
					</div>
					<div
						class="space-y-4"
						v-auto-animate>
						<UiSelettoreGiornata
							:giornate="legaInfo?.giornateTotali"
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
					:giornateTotali="legaInfo?.giornateTotali"
					:legaId="Number(legaId)" />
			</UCard>
		</UContainer>
	</div>
</template>

<style></style>
