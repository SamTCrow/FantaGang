<script lang="ts" setup>
	const { data: listone } = useFetch("/api/quotazioni", { lazy: true });
</script>

<template>
	<UTable
		v-if="listone"
		:rows="listone" />
	<USkeleton
		v-else
		class="h-screen w-full" />
</template>
