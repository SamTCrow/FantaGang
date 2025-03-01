<script lang="ts" setup>
	// TODO migliorare la pagina iniziale
	const { user, loggedIn } = useUserSession();
</script>

<template>
	<UContainer>
		<UCard
			><template #header>
				<AuthState v-slot="{ loggedIn }"
					>{{
						loggedIn
							? "Scegli o crea una lega per cominciare"
							: "Registrati per cominciare!"
					}}
				</AuthState>
			</template>
		</UCard>
	</UContainer>
</template>
