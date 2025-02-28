<script lang="ts" setup>
import { NuxtLink } from '#components'
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="nascondiStampa w-full flex items-center shadow-md z-10 col-span-8 bg-neutral-200 bg-opacity-90">
      <ULink
        class="text-2xl p-2"
        to="/"
      >
        Fanta-Gang
      </ULink>
    </div>

    <div class="flex flex-1 overflow-auto">
      <div class="nascondiStampa md:flex shadow-sm bg-neutral-200 bg-opacity-90 md:col-span-1 hidden w-64">
        <Navigazione />
      </div>
      <div class="stampabile w-full p-4 col-span-8 md:col-span-7 overflow-auto row-span-11">
        <slot />
      </div>
    </div>
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
			visibility: hidden !important;
		}

		input {
			outline: 0 !important;
			border: 0 !important;
			border-width: 0 !important;
			box-shadow: none !important;
			padding: 0 !important;
			font-size: 1rem !important;
			line-height: 1.25rem !important;
		}
		input:focus {
			outline: none !important;
		}

		.nascondiStampa {
			display: none;
		}

		.stampabile {
			overflow: hidden !important;
			margin: auto !important;
			width: screen !important;
			visibility: visible !important;
			position: absolute !important;
			left: 0 !important;
			top: 0 !important;
		}
	}
	html {
		scroll-behavior: smooth;
	}
</style>
