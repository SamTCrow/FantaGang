<script lang="ts" setup>
	const links = [
		{
			label: "Home",
			to: "/",
		},
		{
			label: "Squadre",
			to: "/squadre",
		},
		{
			label: "Altro",
			to: "/altro",
		},
	];
</script>

<template>
	<UVerticalNavigation
		:links="links"
		:ui="{ label: 'text-lg' }"
	/>
</template>
