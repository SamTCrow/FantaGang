<script lang="ts" setup>
	const { legaSelect } = await useGetLeghe();
	const props = defineProps<{ placeHolder: string }>();
	const items = computed(() => {
		const totalGiornate = legaSelect.value?.giornateTotali ?? 0;
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
