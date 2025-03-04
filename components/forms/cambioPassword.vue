<script lang="ts" setup>
	import { z } from "zod";
	import { userCheck } from "~/shared/utils/userPost";
	import type { FormSubmitEvent } from "#ui/types";

	const { fetch } = useUserSession();
	const toast = useToast();
	const schema = z
		.object({
			vecchiaPassword: z
				.string({ message: "Richiesta" })
				.min(6, { message: "La password deve essere almeno di 6 caratteri" })
				.max(12, { message: "La password non deve superare i 12 caratteri" }),
			password: z
				.string({ message: "Richiesta" })
				.min(6, { message: "La password deve essere almeno di 6 caratteri" })
				.max(12, { message: "La password non deve superare i 12 caratteri" }),
			confirmPassword: z
				.string({ message: "Richiesta" })
				.min(6, { message: "La password deve essere almeno di 6 caratteri" })
				.max(12, { message: "La password non deve superare i 12 caratteri" }),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Le password non corrispondono",
			path: ["confirmPassword"],
		});

	type Schema = z.output<typeof schema>;

	const state = reactive({
		vecchiaPassword: undefined,
		password: undefined,
		confirmPassword: undefined,
	});

	const clearState = () => {
		(state.vecchiaPassword = undefined),
			(state.password = undefined),
			(state.confirmPassword = undefined);
	};

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
		} finally {
			clearState();
		}
	};
</script>

<template>
	<UCard>
		<template #header>
			<span>Cambia la tua password</span>
		</template>
		<UForm
			:state="state"
			:schema="schema"
			@submit="cambioUserName">
			<div class="flex flex-col justify-center gap-6 items-center">
				<UFormGroup
					name="vecchiaPassword"
					label="Vecchia Password">
					<UInput
						v-model="state.vecchiaPassword"
						type="password" />
				</UFormGroup>
				<UFormGroup
					name="password"
					label="Password">
					<UInput
						v-model="state.password"
						type="password" />
				</UFormGroup>

				<UFormGroup
					name="confirmPassword"
					label="Ripeti la password">
					<UInput
						v-model="state.confirmPassword"
						type="password" />
				</UFormGroup>
				<UButton
					type="submit"
					label="Cambia" />
			</div>
		</UForm>
	</UCard>
</template>
