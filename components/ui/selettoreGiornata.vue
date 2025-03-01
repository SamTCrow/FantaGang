<script lang="ts" setup>
	
	const props = defineProps<{ placeHolder: string, giornate?: number }>();
	const items = computed(() => {	
	const totalGiornate = props.giornate ?? 1;
		return Array.from({ length: totalGiornate }, (_, i) => ({
			name: `Giornata n° ${i + 1}`,
			value: i + 1,
		}));
	});
	
</script>

<template>
	<USelect
		class="w-full"
		:placeholder="props.placeHolder"
		:options="items"
		option-attribute="name" />
</template>

<style></style>
