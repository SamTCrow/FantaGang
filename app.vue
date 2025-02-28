<script lang="ts" setup>
const { getUserLeghe } = await useGetLeghe()
const { getUserSquadre } = await useGetSquadre()
const { loggedIn } = useUserSession()

onMounted(async () => {
  if (loggedIn.value) {
    getUserLeghe()
    getUserSquadre()
  }
})
</script>

<template>
  <div id="pageContainer">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications :timeout="3000" />
  </div>
</template>
