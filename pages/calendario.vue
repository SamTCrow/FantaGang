<script lang="ts" setup>
	import { schemaPartitaInsert, type SchemaPartitaInsert } from "~/shared/utils/partitaPost";
	import type { FormSubmitEvent } from "#ui/types";

	const { legaSelect } = await useGetLeghe();
  const toast = useToast()
  const form = ref();
  const show = ref(true);
  const giornata = ref();
  const state = reactive({
      legaId: legaSelect.value?.id ?? 1,
      giornata: giornata.value ?? 1,
      squadraCasa: undefined,
      puntiCasa: undefined,
      squadraOspite: undefined,
      puntiOspite: undefined,
    });

	const { data: squadreInLega } = await useFetch(() => `/api/squadre/squadre?legaId=${legaSelect.value?.id ?? ""}`, {
		lazy: true,  
	});

  const { data: partite, refresh: fetchPartite } = await useFetch(()=> {
  if(legaSelect.value && giornata.value){
    return  `/api/partite/${legaSelect.value?.id}/${giornata.value}`
  }
  return ""
  }, {
    lazy: true,
    immediate: false,
    
  })

  

  const clear = () => {
    
    state.giornata = giornata.value ?? 1;
    state.legaId = legaSelect.value?.id ?? 1,
    state.squadraCasa = undefined;
    state.puntiCasa = undefined;
    state.squadraOspite = undefined;
    state.puntiOspite = undefined;
  }

	const options = computed(() => {
    if (!squadreInLega.value) return [];
    const squadre = squadreInLega.value?.map((squadra) =>  ({
      id: squadra.id,
      nome: squadra.nome,
      disabled: partite.value?.some((giocate) => giocate.squadraCasa === squadra.id || giocate.squadraOspite === squadra.id) 
    }))
    return squadre
  })

	const items = computed(() => {
		const listaGiornate = [];
		if (legaSelect.value?.giornateTotali) {
			for (let x = 1; x <= legaSelect.value?.giornateTotali; x++) {
				const giornata = {
					name: `Giornata n° ${x}`,
					value: x,
				};
				listaGiornate.push(giornata);
			}

			return listaGiornate;
		}
	});

  const aggiungiPartita = async (event: FormSubmitEvent<SchemaPartitaInsert>) => {
    const result = await $fetch("/api/partite/partite", {
      method: "POST",
      body: {
        legaId: legaSelect.value?.id,
        giornata: giornata.value,
        squadraCasa: event.data.squadraCasa,
        puntiCasa: event.data.puntiCasa,
        squadraOspite: event.data.squadraOspite,
        puntiOspite: event.data.puntiOspite
      }
    })

    if(!result){
      toast.add({title: "Errore imprevisto", color: "red"})
    }

    toast.add({title: "Partita aggiunta"})
    fetchPartite();
    clear()
    
  }


</script>

<template>
	<UContainer v-if="!legaSelect">
		<span class="text-4xl text-center text-pretty flex justify-center"> Seleziona una lega! </span>
	</UContainer>
	<UContainer v-else>
		<UCard v-auto-animate>
			<template #header>
				{{ legaSelect.nome }}
			</template>
			<div
				v-auto-animate
				class="space-y-2">
				<USelect
					v-model="giornata"
					placeholder="Seleziona giornata"
					:options="items"
					option-attribute="name" 
          @change="fetchPartite"
          />

				<div v-if="giornata > 0">
					<UCard>
						<template #header>
							<div v-auto-animate>
								<div
									class="flex justify-between"
									v-auto-animate>
									<span>Risultati {{ giornata }}° giornata</span>
									<UButton
										label="Aggiungi Partita"
										icon="heroicons-outline:plus"
										@click="() => (show = !show)" />
								</div>
								<UForm
									ref="form"
									:state="state"
									:schema="schemaPartitaInsert"
									v-if="show"
                  @submit="aggiungiPartita">
									<div class="grid grid-cols-5 p-4 gap-4 " v-auto-animate>
										<UFormGroup
											label="Punti"
											class="mr-auto"
                      name="puntiCasa" v-auto-animate>
											<UInput class="w-16" v-model="state.puntiCasa" size="sm"/> 
                    </UFormGroup name="puntiCasa">
                    <UFormGroup label="Casa" name="squadraCasa" >
											<USelect
												v-model="state.squadraCasa"
												:options="options ?? []"
                        size="sm"
												option-attribute="nome"
												value-attribute="id" />
										</UFormGroup>

										<span class="text-center">VS</span>

										<UFormGroup label="Ospite" name="squadraOspite" >
											<USelect
                      size="sm"
												v-model="state.squadraOspite"
												:options="options ?? []"
												option-attribute="nome"
												value-attribute="id" />
										</UFormGroup>
										<UFormGroup
											label="Punti"
											
                      :ui="{
                        label: {
                          wrapper: 'content-end items-end justify-end',
                          
                        },
                        error: 'text-right'
                      }"
                      name="puntiOspite">
											<UInput size="sm" class="w-16 ml-auto" v-model="state.puntiOspite"/>
										</UFormGroup>
									</div>

									<UButton
										type="submit"
										label="Aggiungi"/>
								</UForm>
							</div>
						</template>
            <div v-if="partite?.length" v-auto-animate >
              {{ partite }}
            </div>
					</UCard>
				</div>
			</div>
		</UCard>
	</UContainer>
</template>
