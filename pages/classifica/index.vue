<script lang="ts" setup></script>

<template>
	<AuthState v-slot="{ loggedIn }">
		<div
			v-if="loggedIn"
			class="text-4xl text-center text-pretty flex justify-center">
			Seleziona una lega!
		</div>
		<div v-else>
			<span class="text-2xl">Devi essere registrarto per accedere a questa pagina!</span>
		</div>
	</AuthState>
</template>
