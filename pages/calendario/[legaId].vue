<script lang="ts" setup>
	import type { FormSubmitEvent } from "#ui/types";
	import { schemaPartitaInsert, type SchemaPartitaInsert } from "~/shared/utils/partitaPost";
	import type { Partita } from "~/types/types";

	const legaId = useRoute().params.legaId;
	const toast = useToast();
	const form = ref();
	const show = ref(false);
	const giornata = ref<number | undefined>();
	const isEditing = ref(false);
	const editingPartita = ref<Partita | null>(null);

	const state = reactive({
		legaId: legaId,
		giornata: giornata.value ?? 1,
		squadraCasa: undefined as undefined | number,
		puntiCasa: undefined as undefined | number,
		squadraOspite: undefined as undefined | number,
		puntiOspite: undefined as undefined | number,
	});

	const { data: legaInfo } = await useFetch(() => `/api/leghe/${Number(legaId)}`, {
		lazy: true,
		method: "get",
	});

	const { data: partite, refresh: fetchPartite } = useFetch(
		() => `/api/partite/${Number(legaId)}/${giornata.value ?? 1}`,
		{
			lazy: true,
			immediate: false,
		}
	);

	const clear = () => {
		state.giornata = giornata.value ?? 1;
		state.legaId = legaId;
		state.squadraCasa = undefined;
		state.puntiCasa = undefined;
		state.squadraOspite = undefined;
		state.puntiOspite = undefined;
		isEditing.value = false;
		editingPartita.value = null;
	};

	const options = computed(() => {
		if (!legaInfo.value?.squadre || !partite.value) {
			return [];
		}
		const giocato = new Set(
			partite.value.flatMap(({ squadraCasa, squadraOspite }) => [squadraCasa, squadraOspite])
		);
		return legaInfo.value.squadre.map((squadra) => ({
			id: squadra.id,
			nome: squadra.nome,
			disabled: giocato.has(squadra.id),
		}));
	});

	const aggiungiPartita = async (event: FormSubmitEvent<SchemaPartitaInsert>) => {
		const payload = {
			legaId: legaId,
			giornata: giornata.value,
			squadraCasa: event.data.squadraCasa,
			puntiCasa: event.data.puntiCasa,
			squadraOspite: event.data.squadraOspite,
			puntiOspite: event.data.puntiOspite,
			...(isEditing.value && editingPartita.value
				? { partitaId: editingPartita.value.id }
				: {}),
		};

		try {
			const method = isEditing.value && editingPartita.value ? "put" : "post";

			await $fetch("/api/partite/partite", {
				method: method,
				body: payload,
			});

			toast.add({ title: isEditing.value ? "Partita modificata" : "Partita aggiunta" });
			await fetchPartite();
		} catch (error) {
			console.error(error);
			toast.add({ title: "Impossibile inserire il risultato", color: "red" });
		} finally {
			clear();
		}
	};

	const cancellaPartita = async (partitaId: number) => {
		try {
			await $fetch("/api/partite/partite", {
				method: "delete",
				query: {
					id: partitaId,
				},
			});

			toast.add({ title: "Partita eliminata", color: "green" });
			fetchPartite();
		} catch (error) {
			console.error(error);
			toast.add({ title: "Errore nell'eliminazione della partita", color: "red" });
		}
	};

	const modificaPartita = async (partita: Partita) => {
		show.value = true;
		isEditing.value = true;
		editingPartita.value = partita;
		state.squadraCasa = partita.squadraCasa ?? undefined;
		state.puntiCasa = partita.puntiCasa ?? undefined;
		state.squadraOspite = partita.squadraOspite ?? undefined;
		state.puntiOspite = partita.puntiOspite ?? undefined;
	};
</script>

<template>
	<AuthState v-slot="{ loggedIn }">
		<UContainer v-if="loggedIn">
			<UCard v-auto-animate>
				<template #header>
					<div class="flex justify-between items-center">
						<span>{{ legaInfo?.nome }}</span>
					</div>
				</template>
				<div
					v-auto-animate
					class="space-y-2">
					<div class="flex gap-6 items-center">
						<UiSelettoreGiornata
							v-model="giornata"
							:giornate="legaInfo?.giornateTotali"
							placeHolder="Seleziona Giornata..."
							@change="fetchPartite" />
					</div>
					<div v-if="giornata && giornata > 0">
						<UCard>
							<template #header>
								<div v-auto-animate>
									<div
										v-auto-animate
										class="flex justify-between">
										<span>Risultati {{ giornata }}° giornata</span>
										<UButton
											:label="
												isEditing ? 'Modifica Partita' : 'Aggiungi Partita'
											"
											icon="heroicons-outline:plus"
											@click="() => (show = !show)" />
									</div>
									<UForm
										v-if="show"
										ref="form"
										:state="state"
										:schema="schemaPartitaInsert"
										@submit="aggiungiPartita">
										<div
											v-auto-animate
											class="grid grid-cols-5 p-4 gap-4">
											<UFormGroup
												v-auto-animate
												label="Punti"
												class="mr-auto"
												name="puntiCasa">
												<UInput
													v-model="state.puntiCasa"
													class="w-16"
													size="sm" />
											</UFormGroup>
											<UFormGroup
												label="Casa"
												name="squadraCasa">
												<USelect
													v-model="state.squadraCasa"
													:options="options ?? []"
													size="sm"
													option-attribute="nome"
													value-attribute="id" />
											</UFormGroup>

											<span class="text-center">VS</span>

											<UFormGroup
												label="Ospite"
												name="squadraOspite">
												<USelect
													v-model="state.squadraOspite"
													size="sm"
													:options="options ?? []"
													option-attribute="nome"
													value-attribute="id" />
											</UFormGroup>
											<UFormGroup
												label="Punti"
												:ui="{
													label: {
														wrapper:
															'content-end items-end justify-end',
													},
													error: 'text-right',
												}"
												name="puntiOspite">
												<UInput
													v-model="state.puntiOspite"
													size="sm"
													class="w-16 ml-auto" />
											</UFormGroup>
										</div>

										<div class="flex gap-4 justify-end mt-4">
											<UButton
												v-if="isEditing"
												color="gray"
												variant="soft"
												icon="i-heroicons-x-mark"
												label="Annulla"
												@click="clear" />
											<UButton
												type="submit"
												:color="isEditing ? 'orange' : 'primary'"
												:label="isEditing ? 'Salva' : 'Aggiungi'" />
										</div>
									</UForm>
								</div>
							</template>
							<div
								v-if="partite?.length"
								v-auto-animate>
								<div
									v-for="partita in partite"
									:key="partita.id"
									class="flex gap-4 items-center">
									<UButton
										icon="heroicons:pencil"
										@click="() => modificaPartita(partita)" />
									<UiRisultato
										v-bind="partita"
										class="grow" />
									<UButton
										icon="heroicons:trash"
										@click="() => cancellaPartita(partita.id)" />
								</div>
							</div>
						</UCard>
					</div>
				</div>
			</UCard>
		</UContainer>
		<div v-else>
			<span class="text-2xl">Devi essere registrarto per accedere a questa pagina!</span>
		</div>
	</AuthState>
</template>
