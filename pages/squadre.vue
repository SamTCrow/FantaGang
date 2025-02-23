<script lang="ts" setup>
	import { schemaSquadreInsert, type SchemaSquadreInsert } from "~/shared/utils/squadraPost";
	import type { FormSubmitEvent } from "#ui/types";

	const { user } = useUserSession();
	const { legaSelect } = await useGetLeghe();
	const toast = useToast();
	const q = ref("");
	const { listaSquadre, loadingSquadre, getUserSquadre } = await useGetSquadre();
	getUserSquadre();
	const filteredRows = computed(() => {
		if (!q.value) {
			return listaSquadre.value;
		}
		return listaSquadre.value?.filter((squadra) => {
			return Object.values(squadra).some((value) => {
				return String(value).toLocaleLowerCase().includes(q.value.toLowerCase());
			});
		});
	});
	const columns = [
		{
			key: "nome",
			label: "Nome della squadra",
			sortable: true,
		},
		{
			key: "presidente",
			label: "Presidente",
			sortable: true,
		},
		{
			key: "lega",
			label: "Lega",
			sortable: true,
		},
		{
			key: "stemma",
			label: "Stemma",
		},
		{
			key: "utils",
			label: "",
		},
	];

	const state = reactive({ userId: user.value?.id, legaId: legaSelect.value } as SchemaSquadreInsert);

	const eliminaSquadra = async (squadraId: Number) => {
		const response = await $fetch("/api/squadre/squadre", {
			method: "DELETE",
			body: {
				squadraId: squadraId,
			},
		});
		if (response.success) {
			toast.add({ title: "Squadra Eliminata!" });
			getUserSquadre();
		}
	};

	const aggiungiSquadra = async (event: FormSubmitEvent<SchemaSquadreInsert>) => {
		if (user.value) {
			const response = await $fetch("/api/squadre/squadre", {
				method: "POST",
				body: {
					nome: event.data.nome,
					proprietario: event.data.proprietario,
					legaId: event.data.legaId,
					userId: user.value.id,
					stemma: event.data.stemma,
				},
			});
			if (response.success) {
				toast.add({ title: response.message });
				getUserSquadre();
			} else {
				toast.add({ title: response.message, color: "red" });
			}
		}
	};
</script>

<template>
	<UContainer class="space-y-2"
		><UCard>
			<template #header>
				<span>Aggiungi una squadra</span>
			</template>
			<UForm
				class="space-y-4"
				:schema="schemaSquadreInsert"
				:state="state"
				@submit="aggiungiSquadra"
			>
				<div class="flex gap-12 justify-between">
					<UFormGroup
						class="grow"
						label="Nome della Squadra"
						name="nome"
						required
					>
						<UInput v-model="state.nome" />
					</UFormGroup>
					<UFormGroup
						class="grow"
						label="Proprietario della Squadra"
						name="proprietario"
					>
						<UInput v-model="state.proprietario" />
					</UFormGroup>
				</div>
				<div class="flex gap-12">
					<UFormGroup
						label="Lega"
						class="grow"
						name="lega"
					>
						<UiSelettoreLega v-model="state.legaId" />
					</UFormGroup>
					<UFormGroup
						label="Stemma"
						name="stemma"
						class="grow"
					>
						<UInput
							type="file"
							v-model="state.stemma"
							disabled
						/>
					</UFormGroup>
				</div>
				<UButton type="submit">Aggiungi squadra</UButton>
			</UForm>
		</UCard>
		<UCard>
			<template #header
				><div class="flex justify-between items-center">
					<span>Le tue squadre</span
					><UInput
						placeholder="Cerca..."
						v-model="q"
					/>
				</div>
			</template>
			<UContainer>
				<UTable
					sortable
					:loading="loadingSquadre"
					:loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
					:rows="filteredRows || []"
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
	</UContainer>
</template>
