<script lang="ts" setup>
	import { schemaSquadreInsert, type SchemaSquadreInsert } from "~/utils/validators/squadraPost";
	import type { FormSubmitEvent } from "#ui/types";
	const toast = useToast();
	const lega = await useGetLega();
	const { listaSquadre, listaSquadreRefresh } = await useGetSquadre();
	const columns = [
		{
			key: "nome",
			label: "Nome della squadra",
		},
		{
			key: "proprietario",
			label: "Presidente",
		},
		{
			key: "utils",
			label: "",
		},
	];

	const state = reactive({
		nome: undefined,
		proprietario: undefined,
		legaId: lega,
	});
	const eliminaSquadra = async (squadraId: Number) => {
		const response = await $fetch("/api/deleteSquadra", {
			method: "post",
			body: {
				squadraId: squadraId,
			},
		});
		if (response.success) {
			toast.add({ title: "Squadra Eliminata!" });
			await listaSquadreRefresh();
		}
	};

	const aggiungiSquadra = async (event: FormSubmitEvent<SchemaSquadreInsert>) => {
		const response = await $fetch("/api/squadre", {
			method: "POST",
			body: {
				nome: event.data.nome,
				proprietario: event.data.proprietario,
				legaId: event.data.legaId,
			},
		});
		if (response.success) {
			toast.add({ title: "Squadra aggiunta!" });
			await listaSquadreRefresh();
		}
	};
</script>

<template>
	<UContainer>
		<UCard>
			<template #header> Le squadre nella lega </template>
			<UContainer>
				<UTable
					:rows="listaSquadre || []"
					:columns="columns"
					:empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Nessuna squadra.' }"
				>
					<template #utils-data="{ row }">
						<UButton
							icon="material-symbols:delete-outline"
							label="Elimina"
							@click="eliminaSquadra(row.id)"
						/>
					</template>
				</UTable>
			</UContainer>
		</UCard>
		<UCard>
			<template #header>
				<span>Aggiungi una squadra</span>
			</template>
			<UForm
				class="space-y-4"
				:schema="schemaSquadreInsert"
				:state="state"
				@submit="aggiungiSquadra"
			>
				<UFormGroup
					label="Nome della Squadra"
					required
				>
					<UInput v-model="state.nome" />
				</UFormGroup>
				<UFormGroup label="Proprietario della Squadra">
					<UInput v-model="state.proprietario" />
				</UFormGroup>
				<UButton type="submit">Aggiungi squadra</UButton>
			</UForm>
		</UCard>
	</UContainer>
</template>
