<script lang="ts" setup>
	import type { FormSubmitEvent, Form } from "#ui/types";
	import { userPost, type UserPost } from "~/shared/utils/userPost";

	const toast = useToast();

	const registerState = reactive({
		userName: undefined,
		password: undefined,
		confirmPassword: undefined,
		email: undefined,
	});
	const form = ref<Form<UserPost>>();

	const handleRegister = async (event: FormSubmitEvent<UserPost>) => {
		const result = await $fetch("/api/auth/register", {
			method: "POST",
			body: {
				userName: event.data.userName,
				email: event.data.email,
				password: event.data.password,
				confirmPassword: event.data.confirmPassword,
			},
		});
		if (result.success) {
			form.value!.clear;
			toast.add({ title: "Utente Registrato" });
			await navigateTo("/");
		}
	};
</script>

<template>
	<UCard>
		<template #header> Inserisci i dati </template>
		<UForm
			ref="form"
			:schema="userPost"
			:state="registerState"
			class="space-y-4"
			@submit="handleRegister"
		>
			<UFormGroup
				label="Username"
				name="userName"
				required
			>
				<UInput v-model="registerState.userName" />
			</UFormGroup>
			<UFormGroup
				label="Email"
				name="email"
				required
			>
				<UInput v-model="registerState.email" />
			</UFormGroup>
			<UFormGroup
				label="Password"
				name="password"
				required
			>
				<UInput
					v-model="registerState.password"
					type="password"
				/>
			</UFormGroup>
			<UFormGroup
				label="Ripeti la password"
				name="confirmPassword"
				required
			>
				<UInput
					v-model="registerState.confirmPassword"
					type="password"
				/>
			</UFormGroup>
			<UButton type="submit">Registrati!</UButton>
		</UForm>
		<template #footer>
			<UButton
				icon="devicon:google"
				size="xl"
				label="Registrati con Google"
				color="white"
				to="/api/auth/google"
				class="w-full justify-center text-center"
				external
			/>
		</template>
	</UCard>
</template>
