<script lang="ts" setup>
</script>

<template>
	<UContainer>
		<UCard
			><template #header>
				<AuthState v-slot="{ loggedIn }">
					<UCard>
						<template #header>
							{{
								loggedIn
									? "Scegli o crea una lega per cominciare"
									: "Registrati per cominciare!"
							}}
						</template>
						<UiTutorial />
					</UCard>
				</AuthState>
			</template>
		</UCard>
	</UContainer>
</template>
