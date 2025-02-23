<script lang="ts" setup>
	const { clear, fetch, loggedIn } = useUserSession();
	onMounted(async () => {
		clear();
		fetch();
		clearNuxtState();
		await navigateTo("/");
	});
</script>

<template></template>
