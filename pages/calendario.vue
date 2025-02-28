<script lang="ts" setup>
	import type { FormSubmitEvent } from "#ui/types";
	import { schemaPartitaInsert, type SchemaPartitaInsert } from "~/shared/utils/partitaPost";
	import type { Partita } from "~/types/types";

	const { legaSelect } = await useGetLeghe();
	const toast = useToast();
	const form = ref();
	const show = ref(false);
	const giornata = ref();
	const { user } = useUserSession();
	const isEditing = ref(false);
	const editingPartita = ref<Partita | null>(null);

	const state = reactive({
		legaId: legaSelect.value?.id ?? 1,
		giornata: giornata.value ?? 1,
		squadraCasa: undefined as undefined | number,
		puntiCasa: undefined as undefined | number,
		squadraOspite: undefined as undefined | number,
		puntiOspite: undefined as undefined | number,
	});

	const { data: squadreInLega } = await useFetch(() => `/api/squadre/squadre?legaId=${legaSelect.value?.id ?? ""}`, {
		lazy: true,
	});

	const {
		data: partite,
		refresh: fetchPartite,
		status: loadingPartite,
	} = useFetch<Partita[]>(() => `/api/partite/${legaSelect.value?.id}/${giornata.value ?? 1}`, {
		lazy: true,
		immediate: false,
		default: () => [],
	});

	watch([legaSelect, giornata], ([newLega, newGiornata]) => {
		if (newLega?.id && newGiornata) {
			fetchPartite();
		}
	});

	const clear = () => {
		state.giornata = giornata.value ?? 1;
		state.legaId = legaSelect.value?.id ?? 1;
		state.squadraCasa = undefined;
		state.puntiCasa = undefined;
		state.squadraOspite = undefined;
		state.puntiOspite = undefined;
		isEditing.value = false;
		editingPartita.value = null;
	};

	const options = computed(() => {
		if (!squadreInLega.value || !partite.value) {
			return [];
		}
		const giocato = new Set([
			...partite.value.map((p) => p.squadraCasa),
			...partite.value.map((p) => p.squadraOspite),
		]);
		return squadreInLega.value.map((squadra) => ({
			id: squadra.id,
			nome: squadra.nome,
			disabled: giocato.has(squadra.id),
		}));
	});

	const items = computed(() => {
		const totalGiornate = legaSelect.value?.giornateTotali ?? 0;
		return Array.from({ length: totalGiornate }, (_, i) => ({
			name: `Giornata n° ${i + 1}`,
			value: i + 1,
		}));
	});

	const aggiungiPartita = async (event: FormSubmitEvent<SchemaPartitaInsert>) => {
		const payload = {
			legaId: legaSelect.value?.id,
			giornata: giornata.value,
			squadraCasa: event.data.squadraCasa,
			puntiCasa: event.data.puntiCasa,
			squadraOspite: event.data.squadraOspite,
			puntiOspite: event.data.puntiOspite,
		};

		if (isEditing.value && editingPartita.value) {
			const result = await $fetch("/api/partite/partite", {
				method: "PUT",
				body: {
					...payload,
					partitaId: editingPartita.value.id,
				},
			});

			if (!result) {
				toast.add({ title: "Errore durante la modifica", color: "red" });
				return;
			}
			toast.add({ title: "Partita modificata" });
		} else {
			const result = await $fetch("/api/partite/partite", {
				method: "POST",
				body: payload,
			});

			if (!result) {
				toast.add({ title: "Errore imprevisto", color: "red" });
				return;
			}
			toast.add({ title: "Partita aggiunta" });
		}

		fetchPartite();
		clear();
	};

	const aggiungiGiornata = async () => {
		if (legaSelect.value && user.value) {
			const result = await $fetch("/api/leghe/leghe", {
				method: "PUT",
				body: {
					legaId: legaSelect.value.id,
					giornate: legaSelect.value.giornateTotali + 1,
					userId: user.value.id,
				},
			});
			legaSelect.value.giornateTotali++;
			toast.add({ title: "Giornata aggiunta" });
			return result;
		}
		return toast.add({ title: "Utente non autorizzato" });
	};

	const cancellaPartita = async (partitaId: number) => {
		const cancellaPartita = await $fetch("/api/partite/partite", {
			method: "delete",
			body: { partitaId: partitaId },
		});
		if (cancellaPartita) {
			toast.add({ title: "Partita cancellata" });
			fetchPartite();
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
	<UContainer v-if="!legaSelect">
		<span class="text-4xl text-center text-pretty flex justify-center"> Seleziona una lega! </span>
	</UContainer>
	<UContainer v-else>
		<UCard v-auto-animate>
			<template #header>
				<div class="flex justify-between items-center">
					<span>{{ legaSelect.nome }}</span>
				</div>
			</template>
			<div
				v-auto-animate
				class="space-y-2">
				<div class="flex gap-6 items-center">
					<UiSelettoreGiornata
						v-model="giornata"
						place-holder="Seleziona Giornata..."
						@change="fetchPartite" />
					<UButton
						class="hidden"
						icon="heroicons-outline:plus"
						@click="aggiungiGiornata" />
				</div>
				<div v-if="giornata > 0">
					<UCard>
						<template #header>
							<div v-auto-animate>
								<div
									v-auto-animate
									class="flex justify-between">
									<span>Risultati {{ giornata }}° giornata</span>
									<UButton
										:label="isEditing ? 'Modifica Partita' : 'Aggiungi Partita'"
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
													wrapper: 'content-end items-end justify-end',
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
</template>
