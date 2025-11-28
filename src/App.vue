<script setup lang="ts">
import { ref } from 'vue'
import Cardcomponents from './components/cardComponents.vue'
import { game } from './models/game.ts'

const gameStarted = ref(false)
const gameInstance = ref<game | null>(null)
const playerCards = ref<Array<{ name: string; suit: string }>>([])

function startGame() {
  // crée et démarre une partie
  gameInstance.value = new game()
  gameInstance.value.startGame()

  // mappe les objets Carte en objets simples utilisables par le template
  const p = gameInstance.value.getPlayerMain() || []
  playerCards.value = p.map((c: any) => ({
    name: c.getNom(),   // utilise le getter
    suit: c.getSigne()
  }))
  gameStarted.value = true
}
</script>

<template>
  <div class="h-screen flex items-center justify-center relative bg-gradient-to-b from-[#0b6b2f] to-[#0a5a29] bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(180deg,#0b6b2f_0%,#0a5a29_100%)] bg-[length:12px_12px,cover]">
    <!-- Bouton de démarrage -->
    <button 
      v-if="!gameStarted" 
      class="bg-[#ffd54a] text-gray-900 px-8 py-4 rounded-lg border-none text-lg font-bold cursor-pointer shadow-[0_6px_14px_rgba(0,0,0,0.25)] transition-transform duration-100 hover:bg-[#ffe066] active:translate-y-px"
      @click="startGame"
    >
      Démarrer
    </button>

    <!-- Zone de jeu du joueur -->
    <div v-else class="flex flex-col items-center gap-8 p-5">
    
      <div class="absolute left-1/2 -translate-x-1/2 bottom-20 flex gap-4 justify-center items-center">
        <Cardcomponents
          v-for="(card, index) in playerCards"
          :key="index"
          :value="card.name"
          :suit="card.suit"
          :faceUp="true"
        />
      </div>

      <button 
        class="bg-white/90 text-[#0b6b2f] px-6 py-3 rounded-lg border-2 border-white/30 font-semibold cursor-pointer transition-all duration-200 hover:bg-white hover:scale-105 active:scale-[0.98]"
        @click="gameStarted = false"
      >
        Nouvelle partie
      </button>
    </div>
  </div>
</template>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}

body {
  background: linear-gradient(180deg, #0b6b2f 0%, #0a5a29 100%);
  background-image: radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), 
                    linear-gradient(180deg, #0b6b2f 0%, #0a5a29 100%);
  background-size: 12px 12px, cover;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}
</style>