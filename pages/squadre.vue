<script lang="ts" setup>
	import { schemaSquadreInsert, type SchemaSquadreInsert } from "~/shared/utils/squadraPost";
	import type { FormSubmitEvent } from "#ui/types";

	const { user } = useUserSession();
	const { legaSelect, listaLeghe } = await useGetLeghe();
	const toast = useToast();
	const q = ref("");
	const edit = ref(false);
	const { listaSquadre, loadingSquadre, getUserSquadre } = await useGetSquadre();
	const perPage = 10;
	const page = ref(1);

	const filteredRows = computed(() => {
		if (!q.value && !legaSelect.value) {
			return listaSquadre.value?.slice((page.value - 1) * perPage, page.value * perPage);
		}

		let filtered = listaSquadre.value;

		if (legaSelect.value) {
			filtered = filtered?.filter((squadra) => squadra.legaId === legaSelect.value?.id);
		}

		if (q.value) {
			filtered = filtered?.filter((squadra) => {
				return Object.values(squadra).some((value) => {
					return String(value).toLocaleLowerCase().includes(q.value.toLowerCase());
				});
			});
		}

		return filtered?.slice((page.value - 1) * perPage, page.value * perPage);
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

	const state = reactive({ userId: user.value?.id, legaId: legaSelect.value?.id } as SchemaSquadreInsert & {
		squadraId: number | undefined;
	});

	const clearState = () => {
		state.nome = "";
		state.proprietario = "";
		state.stemma = "";
		state.legaId = 0;
	};

	const eliminaSquadra = async (squadraId: number, createdBy: number) => {
		console.log(squadraId, createdBy);
		if (user.value) {
			const response = await $fetch("/api/squadre/squadre", {
				method: "DELETE",
				body: {
					id: squadraId,
					userId: createdBy,
				},
			});
			if (response.success) {
				toast.add({ title: "Squadra Eliminata!" });
				getUserSquadre();
			}
		}
	};

	const aggiungiSquadra = async (event: FormSubmitEvent<SchemaSquadreInsert>) => {
		if (user.value) {
			if (!edit.value) {
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
					clearState();
					getUserSquadre();
				} else {
					toast.add({ title: response.message, color: "red" });
				}
			} else {
				const response = await $fetch("/api/squadre/squadre", {
					method: "PUT",
					body: {
						squadraId: state.squadraId,
						userId: user.value.id,
						legaId: event.data.legaId,
						stemma: event.data.stemma,
						nome: event.data.nome,
						proprietario: event.data.proprietario,
					},
				});
				if (!response) {
					toast.add({ title: "Modifica non riuscita", color: "red" });
				}
				edit.value = false;
				clearState();
				getUserSquadre();
				toast.add({ title: "Squadra modficata" });
			}
		}
	};

	const modificaSquadra = (row: Squadra) => {
		edit.value = true;
		state.nome = row.nome;
		state.proprietario = row.presidente;
		state.stemma = row.stemma || undefined;
		state.squadraId = row.id;
		state.legaId = row.legaId ?? 0;
	};

	const annulla = () => {
		edit.value = false;
		clearState();
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
				@submit="aggiungiSquadra">
				<div class="flex gap-12 justify-between">
					<UFormGroup
						class="grow"
						label="Nome della Squadra"
						name="nome"
						required>
						<UInput v-model="state.nome" />
					</UFormGroup>
					<UFormGroup
						class="grow"
						label="Proprietario della Squadra"
						name="proprietario">
						<UInput v-model="state.proprietario" />
					</UFormGroup>
				</div>
				<div class="flex gap-12">
					<UFormGroup
						label="Lega"
						class="grow"
						name="lega">
						<USelect
							v-model="state.legaId"
							value-attribute="id"
							:options="listaLeghe"
							option-attribute="nome" />
					</UFormGroup>
					<UFormGroup
						label="Stemma"
						name="stemma"
						class="grow">
						<UInput
							type="file"
							v-model="state.stemma"
							disabled />
					</UFormGroup>
				</div>
				<div class="space-x-2">
					<UButton
						type="submit"
						:label="edit ? 'Modifica squadra' : 'Crea Squadra'" />
					<UButton
						label="Annulla"
						@click="annulla" />
				</div>
			</UForm>
		</UCard>
		<UCard>
			<template #header>
				<div class="flex justify-between">
					<span>Le tue squadre</span>
					<UButton
						label="Tutte"
						@click="() => (legaSelect = undefined)" />
				</div>
			</template>
			<div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 justify-between">
				<UInput
					v-model="q"
					placeholder="Cerca squadre..." />
				<UPagination
					v-model="page"
					v-if="filteredRows"
					:page-count="perPage"
					:total="filteredRows.length + 1" />
			</div>
			<UTable
				sortable
				:loading="loadingSquadre"
				:loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
				:rows="filteredRows || []"
				:columns="columns"
				:empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Nessuna squadra.' }">
				<template #utils-data="{ row }">
					<div class="space-x-2">
						<UButton
							icon="heroicons-outline:trash"
							@click="eliminaSquadra(row.id, row.userId)" />
						<UButton
							icon="heroicons:pencil-square"
							@click="modificaSquadra(row)" />
					</div>
				</template>
			</UTable>
		</UCard>
	</UContainer>
</template>
