<script lang="ts" setup>
	const {  getUserLeghe } = await useGetLeghe();
	const { loggedIn } = useUserSession();
	watch(loggedIn, async () => {
		if (loggedIn.value) {
			await getUserLeghe();
		}
	});
</script>
<template>
	<div id="pageContainer">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
		<UNotifications :timeout="3000" />
	</div>
</template>
