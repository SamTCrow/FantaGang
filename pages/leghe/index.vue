<script lang="ts" setup>
	import type { FormSubmitEvent, Form } from "#ui/types";
	import { schemaLegaInsert, type SchemaLegaInsert } from "~/shared/utils/legaPost";

	const { listaLeghe, getUserLeghe, legheLoading } = await useGetLeghe();

	const page = ref(1);
	const q = ref("");
	const perPage = 10;
	const toast = useToast();
	const edit = ref(false);
	const form = ref<Form<SchemaLegaInsert>>();
	const state = reactive({
		inizio: undefined,
		legaId: undefined,
	} as SchemaLegaInsert & {
		legaId: number | undefined;
	});

	const formattedDate = computed(() => {
		if (!state.inizio || isNaN(new Date(state.inizio).getTime())) {
			return "";
		}
		return new Date(state.inizio).toLocaleDateString();
	});

	const columns = [
		{
			key: "nome",
			label: "Nome",
		},
		{
			key: "createdByUsername",
			label: "Creatore",
		},
		{
			key: "inizio",
			label: "Inizio",
		},
		{
			key: "giornateTotali",
			label: "Giornate",
		},
		{
			key: "giornateGiocate",
			label: "Giocate",
		},
		{
			key: "createdAt",
			label: "Creata il",
		},
		{
			key: "utils",
		},
	];

	const filteredRows = computed(() => {
		if (!listaLeghe.value) {
			return [];
		}
		if (!q.value) {
			return listaLeghe.value?.slice((page.value - 1) * perPage, page.value * perPage);
		}
		if (listaLeghe.value) {
			return listaLeghe.value
				.filter((lega) => {
					return Object.values(lega).some((value) => {
						return String(value).toLowerCase().includes(q.value.toLowerCase());
					});
				})
				.slice((page.value - 1) * perPage, page.value * perPage);
		}
	});

	const clearState = () => {
		state.nome = "";
		state.giornate = 0;
		state.inizio = undefined;
		state.legaId = undefined;
		edit.value = false;
	};

	const creaLega = async (event: FormSubmitEvent<SchemaLegaInsert>) => {
		const payload = {
			nome: event.data.nome,
			giornate: event.data.giornate,
			inizio: event.data.inizio ? new Date(event.data.inizio) : undefined,
			...(edit.value && state.legaId ? { legaId: state.legaId } : {}),
		};
		const method = edit.value ? "put" : "post";

		try {
			await $fetch("/api/leghe/leghe", {
				method: method,
				body: payload,
			});
			toast.add({ title: edit.value ? "Lega modificata" : "Lega creata" });
			await getUserLeghe();
		} catch (error) {
			console.error(error);
			toast.add({ title: "Errore nell'inserimento della lega", color: "red" });
		} finally {
			clearState();
		}
	};

	const cancellaLega = async (id: string) => {
		try {
			await $fetch("/api/leghe/leghe", {
				method: "delete",
				query: {
					id: id,
				},
			});
			toast.add({ title: "Lega eliminata", color: "green" });
			getUserLeghe();
		} catch (error) {
			console.error(error);
			toast.add({ title: "Errore nell'eliminazione della lega", color: "red" });
		}
	};

	const modificaLega = (row: Lega) => {
		edit.value = true;
		state.nome = row.nome;
		state.legaId = row.id;
		state.giornate = row.giornateTotali;
		state.inizio = row.inizio ? new Date(row.inizio) : undefined;
	};

	const annulla = () => {
		clearState();
		edit.value = false;
	};
</script>

<template>
	<AuthState v-slot="{ loggedIn }">
		<UContainer
			v-if="loggedIn"
			class="space-y-2">
			<UCard>
				<template #header> Nuova Lega </template>
				<UForm
					ref="form"
					class="space-y-4"
					:schema="schemaLegaInsert"
					:state="state"
					@submit="creaLega">
					<UFormGroup
						label="Nome della nuova lega"
						name="nome"
						required>
						<UInput v-model="state.nome" />
					</UFormGroup>
					<div class="flex gap-6">
						<UFormGroup
							label="Giornate"
							name="giornate">
							<UInput v-model="state.giornate" />
						</UFormGroup>
						<UFormGroup
							label="Inizio"
							name="inizio">
							<UPopover :popper="{ placement: 'bottom-start' }">
								<UButton
									icon="i-heroicons-calendar-days-20-solid"
									:label="formattedDate" />

								<template #panel="{ close }">
									<UiDatePicker
										v-model="state.inizio"
										is-required
										@close="close" />
								</template>
							</UPopover>
						</UFormGroup>
					</div>
					<div class="space-x-2">
						<UButton
							type="submit"
							:label="edit ? 'Modifica lega' : 'Crea lega'" />
						<UButton
							label="Annulla"
							@click="annulla" />
					</div>
				</UForm>
			</UCard>
			<UCard>
				<template #header> Le tue leghe </template>
				<div
					class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700 justify-between">
					<UInput
						v-model="q"
						placeholder="Cerca leghe..." />
					<UPagination
						v-if="filteredRows"
						v-model="page"
						:page-count="perPage"
						:total="filteredRows.length + 1" />
				</div>
				<UTable
					v-auto-animate
					:loading="legheLoading ? true : false"
					:rows="filteredRows || []"
					:columns="columns"
					:empty-state="{
						icon: 'i-heroicons-circle-stack-20-solid',
						label: 'Nessuna Lega.',
					}">
					<template #nome-data="{ row }">
						<ULink
							:to="'/lega/' + row.id"
							class="hover:opacity-80">
							{{ row.nome }}
						</ULink>
					</template>
					<template #createdAt-data="{ row }">
						{{ new Date(row.createdAt).toLocaleDateString() }}
					</template>
					<template #inizio-data="{ row }">
						{{ row.inizio ? new Date(row.inizio).toLocaleDateString() : "ND" }}
					</template>
					<template #utils-data="{ row }">
						<AuthState v-slot="{ user }">
							<div class="space-x-2">
								<UButton
									v-if="user"
									:disabled="row.createdBy !== user.id"
									icon="heroicons-outline:trash"
									@click="cancellaLega(row.id)" />
								<UButton
									v-if="user"
									:disabled="row.createdBy !== user.id"
									icon="heroicons-outline:pencil-square"
									@click="modificaLega(row)" />
							</div>
						</AuthState>
					</template>
				</UTable>
			</UCard>
		</UContainer>
		<div v-else>
			<span class="text-2xl">Devi essere registrarto per accedere a questa pagina!</span>
		</div>
	</AuthState>
</template>
