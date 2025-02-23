<script lang="ts" setup>
	const { loggedIn, clear } = useUserSession();
	const toast = useToast();

	const links = computed(() => [
		{
			label: loggedIn.value ? "Log Out" : "Log In",
			click: loggedIn.value
				? async () => {
						clear();
						toast.add({ title: "Sei uscito", color: "red" });
						await navigateTo("/");
				  }
				: () => navigateTo("/login"),
		},
		{
			label: "Home",
			to: "/",
		},

		{
			label: "Leghe",
			to: "/leghe",
			disabled: !loggedIn.value,
		},
		{
			label: "Squadre",
			to: "/squadre",
			disabled: !loggedIn.value,
		},
	]);
</script>

<template>
	<AuthState v-slot="{ user }">
		<div class="flex flex-col gap-4 w-full">
			<div
				class="p-2 flex flex-col gap-2"
				v-if="user"
			>
				<span class="text-lg">Benvenuto {{ user.username }}</span>
				<UiSelettoreLega />
			</div>
			<UVerticalNavigation
				:links="links"
				:ui="{ label: 'text-xl' }"
				class="w-full"
			/>
		</div>
	</AuthState>
</template>

<style>
	[aria-disabled="true"] {
		opacity: 20% !important;
		cursor: not-allowed;
	}
</style>
