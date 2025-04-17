<script lang="ts" setup>
	const { loggedIn, clear } = useUserSession();
	const { legaSelect } = await useGetLeghe();

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
				: async () => await navigateTo("/login"),
		},
		{
			label: loggedIn.value ? "Opzioni" : "",
			to: "/opzioni",
			disabled: !loggedIn.value,
		},
		{
			label: loggedIn.value ? "Leghe" : "",
			to: "/leghe/",
			disabled: !loggedIn.value,
		},
		{
			label: loggedIn.value ? "Squadre" : "",
			to: "/squadre/",
			disabled: !loggedIn.value,
		},

		{
			label: loggedIn.value ? "Quotazioni" : "",
			to: "/quotazioni",
			disabled: !loggedIn.value,
		},
	]);
</script>

<template>
	<AuthState v-slot="{ user }">
		<div class="flex flex-col gap-4 w-full">
			<div
				class="p-2 flex flex-col gap-2"
				v-if="user">
				<span class="text-lg">Benvenuto {{ user.username }}</span>
				<div class="flex w-full gap-2">
					<UiSelettoreLega class="grow" />
					<UButton
						v-if="legaSelect?.id"
						icon="heroicons:arrow-right"
						class="hidden md:flex"
						:to="`/lega/${legaSelect?.id}`" />
				</div>
			</div>
			<UVerticalNavigation
				:links="links"
				:ui="{ label: 'text-xl' }"
				class="w-full" />
		</div>
	</AuthState>
</template>

<style>
	[aria-disabled="true"] {
		opacity: 20% !important;
		cursor: not-allowed;
	}
</style>
