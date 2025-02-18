<script lang="ts" setup>
	const dati = ref({
		giornata: null,
	});
	const inputSyle = {
		base: "text-center",
	};
	const state = reactive({});
	const lega = ref({ name: "Fanta Bevanda" });
	const partite = 5;
	const righe = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const colonne = [
		{
			key: "squadra",
			label: "SQUADRA",
		},
		{
			key: "punti",
			label: "PTI",
		},
		{
			key: "pv",
			label: "PV",
		},
		{
			key: "pn",
			label: "PN",
		},
		{
			key: "pp",
			label: "PP",
		},
		{
			key: "gf",
			label: "GF",
		},
		{
			key: "gs",
			label: "GS",
		},
		{
			key: "totali",
			label: "Pt. Tot.",
		},
	];
</script>

<template>
	<div>
		<span class="flex justify-center items-center text-4xl">
			{{ lega.name }}
		</span>
		<UDivider class="py-2" />
		<UForm :state="state">
			<UFormGroup>
				<div class="flex justify-center items-center gap-4 w-full">
					<span class="text-xl">Giornata N.</span>
					<UInput
						class="w-[3rem]"
						type="text"
						placeholder=""
						maxlength="2"
						v-model="dati.giornata"
						:ui="{
							base: 'text-xl text-center',
						}"
					/>
				</div>
				<UDivider class="py-2" />
				<div
					v-for="partita in partite"
					class="flex gap-2 justify-between py-2"
				>
					<div class="flex gap-4 w-[80%] justify-between">
						<UInput
							class="w-full"
							:ui="inputSyle"
						/>
						-
						<UInput
							class="w-full"
							:ui="inputSyle"
						/>
					</div>
					<UDivider orientation="vertical" />
					<div class="flex gap-4 w-[20%]">
						<UInput :ui="inputSyle" /> -
						<UInput :ui="inputSyle" />
					</div>
				</div>
			</UFormGroup>
			<UDivider class="py-2" />
			<div class="text-xl pb-2">
				<span class="text-xl flex justify-center items-center">Classifica</span>
			</div>
			<UTable
				:ui="{
					wrapper: 'border border-gray-200 dark:border-gray-800',
					divide: 'divide-y divide-gray-200 dark:divide-gray-800',
					tbody: 'divide-y  divide-gray-200 dark:divide-gray-800',
					tr: {
						base: 'divide-x  divide-gray-200 dark:divide-gray-800',
					},
					th: {
						base: 'text-center',
					},
				}"
				:columns="colonne"
				:rows="righe"
			>
				<template #squadra-data>
					<UInput :ui="inputSyle" />
				</template>
				<template #punti-data>
					<UInput :ui="inputSyle" />
				</template>
				<template #pv-data>
					<UInput :ui="inputSyle" />
				</template>
				<template #pn-data>
					<UInput :ui="inputSyle" />
				</template>
				<template #pp-data>
					<UInput :ui="inputSyle" />
				</template>
				<template #gf-data>
					<UInput :ui="inputSyle" />
				</template>
				<template #gs-data>
					<UInput :ui="inputSyle" />
				</template>
				<template #totali-data>
					<UInput :ui="inputSyle" />
				</template>
			</UTable>
			<UDivider class="py-2" />
			<UFormGroup>
				<template #default>
					<div class="flex justify-center items-center gap-4">
						<span class="text-xl">Prossimo turno n°</span>
						<UInput
							class="w-[3rem]"
							type="text"
							placeholder=""
							maxlength="2"
						/>
					</div>
					<UDivider class="py-2" />

					<div
						v-for="partita in partite"
						class="flex gap-2 justify-between py-2"
					>
						<div class="flex gap-4 w-[80%] justify-between">
							<UInput
								class="w-full"
								:ui="inputSyle"
							/>
							-
							<UInput
								class="w-full"
								:ui="inputSyle"
							/>
						</div>
						<UDivider orientation="vertical" />
						<div class="flex gap-4 w-[20%]">
							<UInput :ui="inputSyle" /> -
							<UInput :ui="inputSyle" />
						</div>
					</div>
				</template>
			</UFormGroup>
		</UForm>
	</div>
</template>
