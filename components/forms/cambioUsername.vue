<script lang="ts" setup>
	import { z } from "zod";
	import { userCheck } from "~/shared/utils/userPost";
	import type { FormSubmitEvent } from "#ui/types";

	const { fetch } = useUserSession();
	const toast = useToast();
	const schema = z
		.object({
			userName: z
				.string()
				.min(3, { message: "Il nome deve essere di almeno 3 caratteri" })
				.max(20, { message: "Il nome non puo' essere piu' lungo di 20 caratteri" })
				.trim()
				.refine(
					async (data) => {
						const user = await userCheck(data);
						return user;
					},
					{ message: "Nome utente esistente" }
				),
			password: z
				.string({ message: "Richiesta" })
				.min(6, { message: "La password deve essere almeno di 6 caratteri" })
				.max(12, { message: "La password non deve superare i 12 caratteri" })
				.optional(),
			confirmPassword: z
				.string({ message: "Richiesta" })
				.min(6, { message: "La password deve essere almeno di 6 caratteri" })
				.max(12, { message: "La password non deve superare i 12 caratteri" })
				.optional(),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Le password non corrispondono",
			path: ["confirmPassword"],
		});

	type Schema = z.output<typeof schema>;

	const { user } = useUserSession();
	const state = reactive({
		userName: user.value?.username,
	});

	const cambioUserName = async (event: FormSubmitEvent<Schema>) => {
		try {
			await $fetch("/api/user/user", {
				method: "put",
				body: event.data,
			});
			toast.add({ title: "Utente modificato con successo" });
			await fetch();
		} catch (error) {
			console.error(error);
			toast.add({ title: "Impossibile modificare l'utente", color: "red" });
		}
	};
</script>

<template>
	<UCard>
		<template #header>
			<span>Cambia il tuo nome utente</span>
		</template>
		<UForm
			:state="state"
			:schema="schema"
			@submit="cambioUserName">
			<div class="flex justify-center gap-6 items-start">
				<UFormGroup name="userName">
					<UInput v-model="state.userName" />
				</UFormGroup>
				<UButton
					type="submit"
					label="Cambia" />
			</div>
		</UForm>
	</UCard>
</template>
