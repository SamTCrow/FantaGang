<script lang="ts" setup>
	const { clear } = useUserSession();

	const toast = useToast();
	const conferma = ref(false);

	const deleteUser = async () => {
		if (!conferma.value) {
			return toast.add({ title: "Devi confermare l'operazione!", color: "red" });
		}
		try {
			await $fetch("/api/user/user", {
				method: "DELETE",
				query: {
					confirm: "TRUE",
				},
			});
			clear();
			toast.add({ title: "Account eliminato" });
			await navigateTo("/");
		} catch (error) {
			console.error(error);
			toast.add({ title: "Impossibile eliminare l'utente", color: "red" });
		}
	};
</script>

<template>
	<UCard>
		<template #header>
			<p class="text-red-500">Cancellati</p>
			<p class="text-red-500 text-sm">Questa azione è irreversibile</p>
		</template>
		<div class="flex justify-center items-center gap-6">
			<UButton
				label="Cancella account"
				@click="deleteUser" />
			<UCheckbox
				label="Conferma"
				v-model="conferma" />
		</div>
	</UCard>
</template>
