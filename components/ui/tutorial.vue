<script lang="ts" setup>
	const items = [
		{
			label: "1. Crea una lega",
			content:
				"Clicca su Leghe nel menù di navigazione e crea una nuova lega riempiendo i campi.",
		},
		{
			label: "2. Aggiungi le squadre",
			content:
				"Clicca su squadre nel menù di navigazioni e aggiungi squadre alla lega appena creata",
		},
		{
			label: "3. Inserisci i risultati",
			content:
				"Vai nella sezione calendario e inserisci i risultati delle varie giornate della lega. \nLa classifica verrà generata automaticamente nella omonima pagina.",
		},
	];
</script>

<template>
	<UAccordion
		class="whitespace-pre"
		:items="items"
		variant="soft" />
</template>
