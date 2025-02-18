<script lang="ts" setup></script>

<template>
	<div class="nascondiStampa fixed flex h-full mt-20 justify-center"><Navigazione /></div>
	<div class="w-[1000px] p-4 mx-auto">
		<slot />
	</div>
</template>

<style>
	@media print {
		@page {
			size: auto;
			margin: 25mm 25mm 25mm 25mm !important;
		}

		body {
			print-color-adjust: exact;
			-webkit-print-color-adjust: exact;
		}

		input {
			outline: 0 !important;
			border: 0 !important;
			border-width: 0 !important;
			box-shadow: none !important;
			padding: 0 !important;
			font-size: 1.25rem !important;
			line-height: 1.75rem !important;
		}
		input:focus {
			outline: none !important;
		}

		.nascondiStampa {
			display: none;
		}
	}
</style>
