<script lang="ts" setup>
	import type { Classifica } from "~/server/utils/classifica";
	interface Squadra {
		nome: string;
		id: number;
		presidente: string;
	}

	interface Lega {
		nome: string;
		id: number;
		giornateTotali: number;
		inizio: string;
		squadre: Squadra[];
		classifica: Classifica;
	}

	const toast = useToast();
	const legaId = useRoute().params.legaId;
	const show = ref(new Set());
	const { data: lega, refresh } = await useFetch<Lega>(() => "/api/leghe/" + legaId, {
		lazy: true,
	});

	const generaCalendario = async () => {
		try {
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
		} catch (error: any) {
			toast.add({ title: error.data.statusMessage, color: "red" });
		}
	};
</script>

<template>
	<div>
		<UContainer>
			<UCard v-if="lega">
				<template #header>
					<div class="flex justify-between pb-6">
						<span class="font-bold text-xl">{{ lega.nome.toUpperCase() }}</span>
						<UButton
							label="Crea Calendario"
							@click="generaCalendario" />
					</div>
					<div class="text-center text-lg">
						<UCard>
							<template #header>
								<div class="flex justify-between">
									<span>Giornate: {{ lega.giornateTotali }}</span>
									<span
										>Inizio:
										{{ new Date(lega.inizio).toLocaleDateString() }}</span
									>
								</div>
							</template>
							<ul>
								<li
									v-auto-animate
									v-for="squadra in lega.squadre"
									:key="squadra.id"
									class="hover:scale-125 hover:font-bold hover:opacity-85 flex flex-col">
									<span
										@click="
											show.has(squadra.id)
												? show.delete(squadra.id)
												: show.add(squadra.id)
										">
										{{ squadra.nome }}
									</span>
									<span
										v-if="show.has(squadra.id)"
										class="text-sm"
										>Presidente: {{ squadra.presidente }}
									</span>
								</li>
							</ul>
						</UCard>
					</div>
				</template>
				<div>
					<Classifica
						:legaId="Number(legaId)"
						:giornateTotali="lega.giornateTotali" />
				</div>
			</UCard>
		</UContainer>
	</div>
</template>

<style></style>
