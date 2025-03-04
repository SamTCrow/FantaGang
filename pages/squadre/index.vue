<script lang="ts" setup>
	import type { FormSubmitEvent } from "#ui/types";
	import { schemaSquadreInsert, type SchemaSquadreInsert } from "~/shared/utils/squadraPost";

	const { legaSelect, listaLeghe } = await useGetLeghe();
	const { listaSquadre, loadingSquadre, getUserSquadre } = await useGetSquadre();
	const toast = useToast();
	const q = ref("");
	const edit = ref(false);
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
			key: "utils",
			label: "",
		},
	];

	const state = reactive({
		legaId: legaSelect.value?.id,
	} as SchemaSquadreInsert & {
		squadraId: number | undefined;
	});

	const clearState = () => {
		state.nome = "";
		state.proprietario = "";
		state.stemma = "";
		state.legaId = legaSelect.value?.id ?? 0;
		edit.value = false;
	};

	const eliminaSquadra = async (squadraId: number) => {
		try {
			await $fetch("/api/squadre/squadre", {
				method: "delete",
				query: {
					id: squadraId,
				},
			});
			toast.add({ title: "Squadra Eliminata!" });
			getUserSquadre();
		} catch (error) {
			console.error(error);
			toast.add({ title: "Errore nell'eliminazione della squadra", color: "red" });
		}
	};

	const aggiungiSquadra = async (event: FormSubmitEvent<SchemaSquadreInsert>) => {
		const payload = {
			nome: event.data.nome,
			proprietario: event.data.proprietario,
			legaId: event.data.legaId,
			stemma: event.data.stemma,
			...(edit.value ? { squadraId: state.squadraId } : {}),
		};
		const method = edit.value ? "put" : "post";

		try {
			await $fetch("/api/squadre/squadre", {
				method: method,
				body: payload,
			});
			toast.add({ title: edit.value ? "Squadra modificata" : "Squadra aggiunta" });
			await getUserSquadre();
		} catch (error: any) {
			console.error(error);
			toast.add({ title: "Errore imprevisto", color: "red" });
		} finally {
			clearState();
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
		clearState();
	};
</script>

<template>
	<AuthState v-slot="{ loggedIn }">
		<UContainer
			v-if="loggedIn"
			class="space-y-2">
			<UCard>
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
							hidden
							label="Stemma"
							name="stemma"
							class="grow">
							<UInput
								v-model="state.stemma"
								type="file"
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
				<div
					class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 justify-between">
					<UInput
						v-model="q"
						placeholder="Cerca squadre..." />
					<UPagination
						v-if="filteredRows"
						v-model="page"
						:page-count="perPage"
						:total="filteredRows.length + 1" />
				</div>
				<UTable
					sortable
					:loading="loadingSquadre"
					:loading-state="{
						icon: 'i-heroicons-arrow-path-20-solid',
						label: 'Loading...',
					}"
					:rows="filteredRows || []"
					:columns="columns"
					:empty-state="{
						icon: 'i-heroicons-circle-stack-20-solid',
						label: 'Nessuna squadra.',
					}">
					<template #utils-data="{ row }">
						<div class="space-x-2">
							<UButton
								icon="heroicons-outline:trash"
								@click="eliminaSquadra(row.id)" />
							<UButton
								icon="heroicons:pencil-square"
								@click="modificaSquadra(row)" />
						</div>
					</template>
				</UTable>
			</UCard>
		</UContainer>
		<div v-else>
			<span class="text-2xl">Devi essere registrarto per accedere a questa pagina!</span>
		</div>
	</AuthState>
</template>
