<script lang="ts" setup>
	import type { FormSubmitEvent, Form } from "#ui/types";
	import { logInSchema, type UserLogin } from "~/shared/utils/userLogin";
	const { fetch } = useUserSession();
	const toast = useToast();
	const form = ref<Form<UserLogin>>();

	const state = reactive({
		userName: undefined,
		password: undefined,
	});

	const handleLogIn = async (event: FormSubmitEvent<UserLogin>) => {
		const result = await $fetch("/api/auth/login", {
			method: "post",
			body: {
				userName: event.data.userName,
				password: event.data.password,
			},
		});
		if (result.success) {
			form.value!.clear();
			fetch();
			toast.add({ title: result.message });

			await navigateTo("/");
		} else {
			toast.add({ title: result.message, color: "red" });
		}
	};
</script>

<template>
	<UCard>
		<template #header> Inserisci i dati </template>
		<UForm
			class="space-y-4"
			ref="form"
			:schema="logInSchema"
			:state="state"
			@submit="handleLogIn"
		>
			<UFormGroup
				label="Nome Utente"
				name="userName"
				require
			>
				<UInput v-model="state.userName" />
			</UFormGroup>
			<UFormGroup
				label="Password"
				name="password"
				require
			>
				<UInput
					v-model="state.password"
					type="password"
				/>
			</UFormGroup>
			<UButton type="submit">Log In</UButton>
		</UForm>
		<template #footer>
			<UButton
				icon="devicon:google"
				size="xl"
				label="Fai il login con Google"
				color="white"
				to="/api/auth/google"
				class="w-full justify-center text-center"
				external
			/>
		</template>
	</UCard>
</template>
