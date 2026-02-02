<script setup lang="ts">
interface Player {
  id: number;
  username: string;
  mail: string;
  solde: number;
}

const props = defineProps<{
  players: Player[]
}>();
</script>

<template>
  <div class="w-full">
    <div class="w-full bg-[#062c2c]/70 rounded-lg p-2">
      <div class="grid grid-cols-12 gap-2 text-gray-400 text-sm font-bold px-2 py-1 border-b border-white/5">
        <div class="col-span-1">ID</div>
        <div class="col-span-4">Nom d'utilisateur</div>
        <div class="col-span-4">Email</div>
        <div class="col-span-3 text-right">Solde</div>
      </div>

      <div class="mt-2">
        <div v-for="player in props.players" :key="player.id" class="grid grid-cols-12 items-center gap-2 px-2 py-3 hover:bg-white/3 rounded-md transition-colors">
          <div class="col-span-1 text-gray-300">{{ player.id }}</div>
          <div class="col-span-4 text-white">{{ player.username }}</div>
          <div class="col-span-4 text-gray-200">{{ player.mail }}</div>
          <div class="col-span-3 text-right text-gray-200">{{ player.solde }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
