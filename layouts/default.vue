<script lang="ts" setup>
	const show = ref(false);
</script>

<template>
	<div class="flex flex-col h-screen">
		<div
			class="nascondiStampa w-full flex items-center shadow-md z-10 col-span-8 bg-gray-200 dark:bg-gray-900 bg-opacity-90 justify-between">
			<ULink
				class="text-2xl p-2"
				to="/">
				Fanta-Gang
			</ULink>
			<div class="p-2 md:hidden">
				<UButton
					label="menu"
					@click="show = true" />
			</div>
		</div>

		<div class="flex flex-1 overflow-auto">
			<div
				class="nascondiStampa md:flex shadow-sm bg-gray-200 dark:bg-gray-900 bg-opacity-90 md:col-span-1 hidden w-64">
				<Navigazione />
			</div>
			<div class="w-full p-4 col-span-8 md:col-span-7 overflow-auto row-span-11">
				<slot />
			</div>
		</div>
		<USlideover v-model="show">
			<Navigazione />
			<UButton
				color="gray"
				variant="ghost"
				size="sm"
				icon="i-heroicons-x-mark-20-solid"
				class="flex sm:hidden absolute end-1 top-1 z-10"
				square
				padded
				@click="show = false" />
		</USlideover>
	</div>
</template>

<style>
	@custom-variant hover (&:hover);
	@media print {
		@page {
			size: auto;
			margin: none !important;
		}

		body {
			print-color-adjust: exact;
			-webkit-print-color-adjust: exact;
			visibility: hidden !important;
			background-color: white !important;
			color: black !important;
		}

		select {
			outline: none !important;
			box-shadow: none !important;
		}

		button {
			display: none !important;
		}

		[aria-hidden="true"] {
			display: none !important;
		}

		td,
		th {
			padding: 4px !important;
		}

		div {
			margin: none !important;
			border: none !important;
			outline: none !important;
		}

		span {
			margin: none !important;
			padding: 0 !important;
			vertical-align: middle !important;
			font-size: medium;
			font-weight: 400;
		}

		.nascondiStampa {
			display: none;
		}

		.stampabile {
			overflow: hidden !important;
			margin: 0 !important;
			width: 100% !important;
			visibility: visible !important;
			position: absolute !important;
			left: 0 !important;
			top: 0 !important;
			font-weight: bold !important;
			font-size: large !important;
		}
	}
	html {
		scroll-behavior: smooth;
	}
</style>
