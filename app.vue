<template>
	<div id="pageContainer">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
		<UNotifications :timeout="3000" />
	</div>
</template>
