<script lang="ts" setup>
	const { legaId } = defineProps<{ legaId: number }>();
	const toast = useToast();
	const { data: lega, refresh } = useFetch(() => `/api/leghe/${Number(legaId)}`, {
		method: "get",
		lazy: true,
	});
	const { user } = useUserSession();
	const admin = lega.value?.userId == user?.value?.id;
	const giornata = ref(lega.value?.ultimaGiornata ?? 1);
	const generaCalendario = async () => {
		try {
			if (admin) {
				const result = await $fetch("/api/leghe/azioni/generaCalendario", {
					query: {
						legaId: legaId,
						ar: "true",
					},
				});
				if (result) {
					toast.add({ title: "Calendario generato con successo." });
					refresh();
				}
			}
		} catch (error: any) {
			toast.add({ title: error.data.statusMessage, color: "red" });
		}
	};
	const {
		data: partite,
		refresh: getPartite,
		status,
	} = await useFetch(() => `/api/partite/${legaId}/${giornata.value}`, {});
	const print = () => window.print();
</script>

<template>
	<UCard v-if="lega">
		<template #header>
			<div class="space-y-4">
				<div class="flex justify-between">
					<span class="font-bold text-xl">{{ lega.nome.toUpperCase() }}</span>
					<AuthState v-slot="{ loggedIn, user }">
						<UButton
							v-if="loggedIn && user?.id == lega.userId"
							label="Crea Calendario"
							@click="generaCalendario" />
					</AuthState>
				</div>
				<div class="flex justify-between">
					<span>Giornate: {{ lega.giornateTotali }}</span>
					<span
						>Inizio:
						{{ lega.inizio ? new Date(lega.inizio).toLocaleDateString() : "ND" }}</span
					>
				</div>
			</div>
		</template>
		<div class="space-y-4 stampabile">
			<div class="text-center pb-2 items-center align-middle text-lg relative">
				<ULink
					:to="'/lega/' + lega?.id"
					class="hover:font-bold hover:opacity-80"
					>{{ lega?.nome.toUpperCase() }}</ULink
				>
				<UButton
					icon="heroicons:printer"
					class="absolute right-0"
					@click="print" />
			</div>
			<div
				class="space-y-4"
				v-auto-animate>
				<UiSelettoreGiornata
					:giornate="lega?.giornateTotali ?? 0"
					v-model="giornata"
					place-holder="Seleziona giornata..."
					@change="getPartite" />
				<USkeleton
					v-if="status === 'pending'"
					class="h-32 w-full" />
				<UiRisultato
					v-else
					v-for="partita in partite"
					:key="partita.id"
					v-bind="partita" />
			</div>
			<Classifica
				:legaId="Number(legaId)"
				:giornateTotali="lega.giornateTotali" />
		</div>
	</UCard>
</template>

<style></style>
