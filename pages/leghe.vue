<script lang="ts" setup>
	import { schemaLegaInsert, type SchemaLegaInsert } from "~/shared/utils/legaPost";
	import { format } from "date-fns";
	import type { FormSubmitEvent, Form } from "#ui/types";
	const { user } = useUserSession();
	const { listaLeghe, getUserLeghe, legheLoading } = await useGetLeghe();
	const form = ref<Form<SchemaLegaInsert>>();
	const state = reactive({ inizio: new Date(), createdBy: user.value?.id } as SchemaLegaInsert);

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

	const creaLega = async (event: FormSubmitEvent<SchemaLegaInsert>) => {
		const result = $fetch("/api/leghe/leghe", {
			method: "post",
			body: event.data,
		});
		getUserLeghe();
		form.value?.clear();
	};

	const cancellaLega = async (id: string) => {
		const result = $fetch("/api/leghe/leghe", {
			method: "DELETE",
			body: {
				id: id,
				userId: user.value?.id,
			},
		});
		getUserLeghe();
	};
</script>

<template>
	<UContainer class="space-y-2">
		<UCard>
			<template #header> Nuova Lega </template>
			<UForm
				class="space-y-4"
				ref="form"
				:schema="schemaLegaInsert"
				:state="state"
				@submit="creaLega"
			>
				<UFormGroup
					label="Nome della nuova lega"
					name="nome"
					required
				>
					<UInput v-model="state.nome" />
				</UFormGroup>
				<div class="flex gap-6">
					<UFormGroup
						label="Giornate"
						name="giornate"
					>
						<UInput v-model="state.giornate" />
					</UFormGroup>
					<UFormGroup
						label="Inizio"
						name="inizio"
					>
						<UPopover :popper="{ placement: 'bottom-start' }">
							<UButton
								icon="i-heroicons-calendar-days-20-solid"
								:label="state.inizio ? format(state.inizio, 'd MMM, yyy') : ''"
							/>

							<template #panel="{ close }">
								<UiDatePicker
									v-model="state.inizio"
									is-required
									@close="close"
								/>
							</template>
						</UPopover>
					</UFormGroup>
				</div>
				<UButton type="submit">Crea lega</UButton>
			</UForm>
		</UCard>
		<UCard>
			<template #header> Le tue leghe </template>
			<UTable
				:loading="legheLoading ? true : false"
				:rows="listaLeghe || []"
				:columns="columns"
				:empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Nessuna Lega.' }"
			>
				<template #createdAt-data="{ row }">
					{{ new Date(row.createdAt).toLocaleDateString() }}
				</template>
				<template #inizio-data="{ row }">
					{{ row.inizio > 0 ? new Date(row.inizio).toLocaleDateString() : "ND" }}
				</template>
				<template #utils-data="{ row }">
					<AuthState v-slot="{ user }">
						<UButton
							v-if="user"
							:disabled="row.createdBy !== user.id"
							icon="heroicons-outline:trash"
							@click="cancellaLega(row.id)"
						/>
					</AuthState>
				</template>
			</UTable>
		</UCard>
	</UContainer>
</template>
