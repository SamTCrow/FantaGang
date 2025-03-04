<script lang="ts" setup>
	//TODO aggiungere altre opzioni se necessario?
	const items = [
		{
			label: "Account",
			slot: "account",
		},
		{
			label: "Aspetto",
			slot: "aspetto",
		},
	];
</script>

<template>
	<AuthState v-slot="{ loggedIn }">
		<UContainer>
			<UTabs
				v-if="loggedIn"
				:items="items">
				<template #account>
					<div class="space-y-2">
						<FormsCambioUsername />
						<FormsCambioPassword />
						<FormsCancellaUser />
					</div>
				</template>
				<template #aspetto>
					<UiLook />
				</template>
			</UTabs>
			<div v-else>
				<span class="text-2xl">Devi essere registrarto per accedere a questa pagina!</span>
			</div>
		</UContainer>
	</AuthState>
</template>
