<script setup lang="ts">
import { ref, computed } from 'vue'
import Cardcomponents from './components/cardComponents.vue'
import { game } from './models/game'

const gameStarted = ref(false)
const gameInstance = ref<game | null>(null)

function startGame() {
  if (!gameInstance.value) {
    gameInstance.value = new game()
    gameInstance.value.startGame()
  } else {
    // reuse the same pack: reset only hands and redeal from the existing pack
    gameInstance.value.resetRound()
  }
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
      <div class="absolute left-1/2 -translate-x-1/2 bottom-20 flex flex-col items-center gap-2">
        <div class="mb-2 p-4 bg-green-800/50 rounded-lg flex gap-4">
          <button
            v-if="gameInstance && gameInstance.getPlayerStatus() === 'start'"
            class="bg-white/90 text-[#0b6b2f] px-6 py-3 rounded-lg border-2 border-white/30 font-semibold cursor-pointer transition-all duration-200 hover:bg-white hover:scale-105 active:scale-[0.98]"
            @click="gameInstance?.playerStand()"
          >
            Stand
          </button>
          <button
            v-if="gameInstance && gameInstance.getPlayerStatus() === 'start'"
            class="bg-white/90 text-[#0b6b2f] px-6 py-3 rounded-lg border-2 border-white/30 font-semibold cursor-pointer transition-all duration-200 hover:bg-white hover:scale-105 active:scale-[0.98]"
            @click="gameInstance?.playerHit()"
          >
            Hit
          </button>
          <button
            v-if="gameInstance && gameInstance.getPlayerStatus() === 'start'"
            class="bg-white/90 text-[#0b6b2f] px-6 py-3 rounded-lg border-2 border-white/30 font-semibold cursor-pointer transition-all duration-200 hover:bg-white hover:scale-105 active:scale-[0.98]"
            @click="gameInstance?.playerSplit()"
          >
            Split
          </button>
        </div>
        <div class="text-white/90 uppercase tracking-wider text-sm">Score : {{ gameInstance?.getPlayerScore() }}</div>
        <div v-if="gameInstance && (gameInstance.getPlayerStatus() === 'win' || gameInstance.getPlayerStatus() === 'loose' || gameInstance.getPlayerStatus() === 'push')" class="mt-2 text-xl font-bold text-yellow-300">
          {{ gameInstance.getPlayerStatus() === 'win' ? 'Vous avez gagné !' : gameInstance.getPlayerStatus() === 'loose' ? 'Vous avez perdu !' : "Égalité !" }}
        </div>
        <div class="flex gap-4 justify-center items-center">
          <Cardcomponents
            v-for="(card, index) in gameInstance?.getPlayerMain()"
            :key="index"
            :value="card.name"
            :suit="card.suit"
            :faceUp="true"
          />
        </div>
      </div>

      <!-- Zone du croupier -->
      <div class="absolute left-1/2 -translate-x-1/2 top-12 flex flex-col items-center gap-3">
        <div class="text-white/90 uppercase tracking-wider text-sm">Score : {{ gameInstance?.getDealerScore() }}</div>
        <div class="flex gap-4 justify-center items-center">
          <Cardcomponents
            v-for="(card, index) in gameInstance?.getDealerMain()"
            :key="`dealer-${index}`"
            :value="card.name"
            :suit="card.suit"
            :faceUp="card.isFaceUp"
            backVariant="dots"
          />
        </div>
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