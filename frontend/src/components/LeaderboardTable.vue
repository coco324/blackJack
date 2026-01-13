<script setup lang="ts">
// On définit l'interface pour un meilleur auto-complétion
interface Player {
  username: string;
  solde: number;
}

// On renomme 'user' en 'props' pour éviter les conflits avec le v-for
const props = defineProps<{
  players: Player[]
}>();
</script>

<template>
  <div class="w-full">
    <div class="w-full bg-[#062c2c]/70 rounded-lg p-2">
      <div class="grid grid-cols-12 gap-2 text-gray-400 text-sm font-bold px-2 py-1 border-b border-white/5">
        <div class="col-span-1">#</div>
        <div class="col-span-8">Joueur</div>
        <div class="col-span-2 text-right">Solde</div>
      </div>

      <div class="mt-2">
        <div v-for="(player, idx) in props.players" :key="player.username" class="grid grid-cols-12 items-center gap-2 px-2 py-3 hover:bg-white/3 rounded-md transition-colors ">
          <div class="col-span-1 text-yellow-300 font-bold ">{{ idx + 1 }}</div>
          <div class="col-span-8 flex items-center gap-3 ">
            <div class="w-10 h-10 rounded-full bg-[#0a263d] flex items-center justify-center border-2 border-yellow-500 text-yellow-400 font-bold">{{ player.username.charAt(0) }}</div>
            <div class="text-white font-semibold">{{ player.username }}</div>
          </div>
          <div class="col-span-2 text-right text-gray-200">{{ player.solde }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
