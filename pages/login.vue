<script lang="ts" setup>
	const items = [
		{
			slot: "login",
			label: "Log In",
		},
		{
			slot: "register",
			label: "Registrati",
		},
	];
</script>

<template>
	<UContainer>
		<UTabs :items="items">
			<template #login>
				<UiLogin />
			</template>
			<template #register>
				<UiRegister />
			</template>
		</UTabs>
	</UContainer>
</template>
