<script lang="ts" setup>
	const dati = ref({
		giornata: "",
	});
	const inputSyle = {
		base: "text-center",
	};
	const dividerStyle = {
		border: {
			base: "border-gray-800",
		},
	};
	const state = reactive({});
	const lega = ref({ name: "Fanta Bevanda" });
	const partite = 5;
	const righe = [
		{ squadra: "Inserisci il nome della squadra" },
		{ squadra: "Inserisci il nome della squadra" },
		{ squadra: "Inserisci il nome della squadra" },
		{ squadra: "Inserisci il nome della squadra" },
		{ squadra: "Inserisci il nome della squadra" },
		{ squadra: "Inserisci il nome della squadra" },
		{ squadra: "Inserisci il nome della squadra" },
		{ squadra: "Inserisci il nome della squadra" },
		{ squadra: "Inserisci il nome della squadra" },
		{ squadra: "Inserisci il nome della squadra" },
	];
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
	<div class="max-w-[1000px] mx-auto">
		<span class="flex justify-center items-center text-4xl">
			{{ lega.name }}
		</span>
		<UDivider
			class="py-2"
			:ui="dividerStyle"
		/>
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
						size="xs"
						:ui="{
							base: 'text-xl text-center',
						}"
					/>
				</div>
				<UDivider
					class="py-2"
					:ui="dividerStyle"
				/>
				<div
					v-for="partita in partite"
					class="flex gap-2 justify-between py-2"
				>
					<div class="flex gap-4 w-[80%] justify-between">
						<UInput
							class="w-full"
							:ui="inputSyle"
							size="xs"
						/>
						-
						<UInput
							class="w-full"
							:ui="inputSyle"
							size="xs"
						/>
					</div>
					<UDivider
						orientation="vertical"
						:ui="dividerStyle"
					/>
					<div class="flex gap-4 w-[20%]">
						<UInput
							:ui="inputSyle"
							size="xs"
						/>
						-
						<UInput
							:ui="inputSyle"
							size="xs"
						/>
					</div>
				</div>
			</UFormGroup>
			<UDivider
				class="py-2"
				:ui="dividerStyle"
			/>
			<div class="text-xl pb-2">
				<span class="text-xl flex justify-center items-center">Classifica</span>
			</div>
			<UTable
				:ui="{
					wrapper: 'border border-gray-800 dark:border-gray-800',
					divide: 'divide-y divide-gray-800 dark:divide-gray-800',
					tbody: 'divide-y  divide-gray-800 dark:divide-gray-800',
					tr: {
						base: 'divide-x  divide-gray-800 dark:divide-gray-800',
					},
					th: {
						base: 'text-center',
					},
					td: {
						padding: 'px-2 py-2',
					},
				}"
				:columns="colonne"
				:rows="righe"
			>
				<template #squadra-data>
					<UInput
						:ui="inputSyle"
						size="xs"
					/>
				</template>
				<template #punti-data>
					<UInput
						:ui="inputSyle"
						size="xs"
					/>
				</template>
				<template #pv-data>
					<UInput
						:ui="inputSyle"
						size="xs"
					/>
				</template>
				<template #pn-data>
					<UInput
						:ui="inputSyle"
						size="xs"
					/>
				</template>
				<template #pp-data>
					<UInput
						:ui="inputSyle"
						size="xs"
					/>
				</template>
				<template #gf-data>
					<UInput
						:ui="inputSyle"
						size="xs"
					/>
				</template>
				<template #gs-data>
					<UInput
						:ui="inputSyle"
						size="xs"
					/>
				</template>
				<template #totali-data>
					<UInput
						:ui="inputSyle"
						size="xs"
					/>
				</template>
			</UTable>

			<UFormGroup>
				<template #default>
					<div class="flex justify-center items-center gap-4 pt-4">
						<span class="text-xl">Prossimo turno n°</span>
						<UInput
							class="w-[3rem]"
							type="text"
							placeholder=""
							maxlength="2"
						/>
					</div>
					<UDivider
						class="py-2"
						:ui="dividerStyle"
					/>

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
						<UDivider
							orientation="vertical"
							:ui="dividerStyle"
						/>
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
