<script setup>
import { computed } from 'vue'
import { player } from '../models/player';

const props = defineProps({
  players: { type: Array, default: () => [] }
})


</script>

<template>
  <div class="w-full">
    <div class="w-full bg-[#062c2c]/70 rounded-lg p-2">
      <div class="grid grid-cols-12 gap-2 text-gray-400 text-sm font-bold px-2 py-1 border-b border-white/5">
        <div class="col-span-1">#</div>
        <div class="col-span-6">Joueur</div>
        <div class="col-span-2 text-right">Victoires</div>
        <div class="col-span-2 text-right">Parties</div>
        <div class="col-span-1 text-right">%</div>
      </div>

      <div class="mt-2">
        <div v-for="(p, idx) in players" :key="p.username" class="grid grid-cols-12 items-center gap-2 px-2 py-3 hover:bg-white/3 rounded-md transition-colors">
          <div class="col-span-1 text-yellow-300 font-bold">{{ idx + 1 }}</div>
          <div class="col-span-6 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[#0a263d] flex items-center justify-center border-2 border-yellow-500 text-yellow-400 font-bold">{{ p.username.charAt(0) }}</div>
            <div class="text-white font-semibold">{{ p.username }}</div>
          </div>
          <div class="col-span-2 text-right text-gray-200">{{ p.wins }}</div>
          <div class="col-span-2 text-right text-gray-200">{{ p.games }}</div>
          <div class="col-span-1 text-right text-yellow-300 font-bold">{{ (p.wins / p.games * 100).toFixed(1) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
