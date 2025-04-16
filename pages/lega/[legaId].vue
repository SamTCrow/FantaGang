<script lang="ts" setup>
	const legaId = useRoute().params.legaId;
	const items = [
		{
			label: "Info",
			slot: "info",
		},
		{
			label: "Squadre",
			slot: "squadre",
		},
		{
			label: "Calendario",
			slot: "calendario",
		},
	];
</script>

<template>
	<UContainer>
		<UTabs :items="items">
			<template #info>
				<TabLega :legaId="Number(legaId)" />
			</template>
			<template #squadre>
				<TabSquadre :legaId="Number(legaId)" />
			</template>
			<template #calendario>
				<TabCalendario :legaId="Number(legaId)" />
			</template>
		</UTabs>
	</UContainer>
</template>

<style></style>
