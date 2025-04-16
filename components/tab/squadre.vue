<script lang="ts" setup>
	import type { FormSubmitEvent } from "#ui/types";
	import { schemaSquadreInsert, type SchemaSquadreInsert } from "~/shared/utils/squadraPost";

	const { legaId } = defineProps<{ legaId: number }>();
	const { data: listaSquadre, refresh } = useFetch(() => "/api/squadre/squadre", {
		query: {
			legaId: legaId,
		},
	});
	const { data: lega } = useFetch(() => `/api/leghe/${Number(legaId)}`, {
		method: "get",
		lazy: true,
	});
	const { user } = useUserSession();
	const admin = lega.value?.userId == user?.value?.id;
	const toast = useToast();
	const edit = ref(false);

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
			key: "utils",
			label: "",
		},
	];

	const state = reactive({
		legaId: legaId,
	} as SchemaSquadreInsert & {
		squadraId: number | undefined;
	});

	const clearState = () => {
		state.nome = "";
		state.proprietario = "";
		state.stemma = "";
		state.legaId = legaId;
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
			refresh();
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
			refresh();
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
	<div class="space-y-2">
		<UCard v-if="admin">
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
						hidden
						label="Stemma"
						name="stemma"
						class="">
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
				</div>
			</template>

			<UTable
				sortable
				:loading-state="{
					icon: 'i-heroicons-arrow-path-20-solid',
					label: 'Loading...',
				}"
				:rows="listaSquadre || []"
				:columns="columns"
				:empty-state="{
					icon: 'i-heroicons-circle-stack-20-solid',
					label: 'Nessuna squadra.',
				}">
				<template #utils-data="{ row }">
					<div class="space-x-2">
						<UButton
							v-if="admin"
							icon="heroicons-outline:trash"
							@click="eliminaSquadra(row.id)" />
						<UButton
							v-if="admin"
							icon="heroicons:pencil-square"
							@click="modificaSquadra(row)" />
					</div>
				</template>
			</UTable>
		</UCard>
	</div>
</template>
