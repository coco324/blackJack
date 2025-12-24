<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Cardcomponents from '../components/cardComponents.vue'
import { game } from '../models/game.ts'
import GameServices from '../Services/GameServices'

const router = useRouter()
const gameStarted = ref(false)
const gameInstance = ref<game | null>(null)
const sessionId = ref<number | null>(null)
const currentSolde = ref(1000)
const currentBet = ref(10)
const showBetSelection = ref(false)

onMounted(async () => {
  console.log('📍 Création de la session...')
  const sessionData = await GameServices.CreateSession()
  
  if (sessionData) {
    sessionId.value = sessionData.sessionId
    currentSolde.value = sessionData.startSolde
    console.log('✅ Session créée:', sessionId.value, 'Solde:', currentSolde.value)
  } else {
    alert('❌ Erreur: impossible de créer une session')
    router.push('/')
  }
})

function showBetMenu() {
  showBetSelection.value = true
}

function selectBet(amount: number) {
  if (amount > currentSolde.value) {
    alert('Solde insuffisant !')
    return
  }
  currentBet.value = amount
  showBetSelection.value = false
  startGame()
}

function startGame() {
  if (!sessionId.value) {
    alert('❌ Erreur: pas de session active')
    return
  }

  if (currentBet.value > currentSolde.value) {
    alert('Solde insuffisant !')
    return
  }

  // ✅ Déduire la mise du solde au moment de la mise
  currentSolde.value -= currentBet.value

  if (!gameInstance.value) {
    gameInstance.value = new game(sessionId.value)
    gameInstance.value.setBet(currentBet.value)
    gameInstance.value.startGame()
    console.log('🎮 Nouvelle partie, mise:', currentBet.value, 'Nouveau solde:', currentSolde.value)
  } else {
    gameInstance.value.resetRound()
    gameInstance.value.setBet(currentBet.value)
    console.log('🔄 Nouvelle manche, mise:', currentBet.value, 'Nouveau solde:', currentSolde.value)
  }
  
  gameStarted.value = true
}

async function newRound() {
  if (!gameInstance.value) return
  
  // ✅ Calculer les gains (sans soustraire la mise, déjà faite)
  const winnings = gameInstance.value.calculateWinnings()
  currentSolde.value += winnings
  
  console.log('Gains:', winnings, 'Nouveau solde:', currentSolde.value)
  
  // ✅ Vérifier si le solde est épuisé
  if (currentSolde.value <= 0) {
    alert('Vous n\'avez plus de solde ! Session terminée.')
    await endSession()
    return
  }
  
  gameStarted.value = false
  showBetSelection.value = true
}

async function endSession() {
  if (sessionId.value) {
    console.log('🛑 Fin de session:', sessionId.value, 'Solde final:', currentSolde.value)
    await GameServices.EndSession(sessionId.value, currentSolde.value)
    router.push('/')
  }
}
</script>

<template>
  <div class="h-screen flex items-center justify-center relative bg-gradient-to-b from-[#0b6b2f] to-[#0a5a29] bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(180deg,#0b6b2f_0%,#0a5a29_100%)] bg-[length:12px_12px,cover]">
    
    <!-- ✅ Affichage du solde en haut à DROITE -->
    <div class="absolute top-6 right-6 text-white font-semibold text-lg bg-black/30 px-4 py-2 rounded-lg border border-white/20">
      Solde: {{ currentSolde }} €
    </div>

    <!-- Bouton quitter en haut à gauche -->
    <div class="absolute top-6 left-6">
      <button 
        @click="endSession"
        class="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
      >
        Quitter
      </button>
    </div>

    <!-- Sélection de mise -->
    <div v-if="!gameStarted && showBetSelection" class="flex flex-col items-center gap-4">
      <h2 class="text-white text-2xl font-bold">Choisissez votre mise</h2>
      <div class="grid grid-cols-3 gap-4">
        <button 
          v-for="bet in [5, 10, 25, 50, 100, 250]" 
          :key="bet"
          @click="selectBet(bet)"
          :disabled="bet > currentSolde"
          class="bg-[#ffd54a] text-gray-900 px-8 py-4 rounded-lg text-lg font-bold cursor-pointer shadow-[0_6px_14px_rgba(0,0,0,0.25)] transition-transform duration-100 hover:bg-[#ffe066] active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ bet }} €
        </button>
      </div>
    </div>

    <!-- Bouton démarrer -->
    <button 
      v-else-if="!gameStarted"
      class="bg-[#ffd54a] text-gray-900 px-8 py-4 rounded-lg text-lg font-bold cursor-pointer shadow-[0_6px_14px_rgba(0,0,0,0.25)] transition-transform duration-100 hover:bg-[#ffe066] active:translate-y-px"
      @click="showBetMenu"
    >
      Nouvelle partie
    </button>

    <!-- Zone de jeu -->
    <div v-else class="flex flex-col items-center gap-8 p-5">
      <!-- Affichage de la mise actuelle -->
      <div class="absolute top-20 text-white font-semibold bg-black/30 px-4 py-2 rounded-lg border border-white/20">
        Mise: {{ currentBet }} €
      </div>

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
            v-if="gameInstance && gameInstance.getPlayerStatus() === 'start' && gameInstance.canSplit()"
            class="bg-white/90 text-[#0b6b2f] px-6 py-3 rounded-lg border-2 border-white/30 font-semibold cursor-pointer transition-all duration-200 hover:bg-white hover:scale-105 active:scale-[0.98]"
            @click="gameInstance?.playerSplit()"
          >
            Split
          </button>
        </div>
        <div class="flex space-x-10 justify-center items-start">
            <div 
              v-for="(hand, pIndex) in gameInstance?.getPlayersMain()" 
              :key="pIndex" 
              class="flex flex-col gap-2 items-center transition-all duration-300"
              :class="gameInstance?.getCurrentHandIndex() === pIndex ? 'opacity-100 scale-105' : 'opacity-60 scale-95 brightness-75'"
            >
                <div class="text-white/90 uppercase tracking-wider text-sm font-bold">
                  Score : {{ gameInstance?.getPlayerScoreByIndex(pIndex) }}
                </div>
                
                <div class="flex gap-4 justify-center">
                    <Cardcomponents
                        v-for="(card, index) in hand"
                        :key="'hand-' + pIndex + '-card-' + index"
                        :value="card.name"
                        :suit="card.suit"
                        :faceUp="true"
                    />
                </div>

                <div v-if="gameInstance && (gameInstance.getPlayerStatusByIndex(pIndex) === 'win' || gameInstance.getPlayerStatusByIndex(pIndex) === 'loose' || gameInstance.getPlayerStatusByIndex(pIndex) === 'push')" class="mt-2 text-lg font-bold text-yellow-300">
                  {{ gameInstance.getPlayerStatusByIndex(pIndex) === 'win' ? 'Gagné !' : gameInstance.getPlayerStatusByIndex(pIndex) === 'loose' ? 'Perdu !' : "Égalité !" }}
                </div>
            </div>
        </div>
      </div>

      <!-- Zone du croupier -->
      <div class="absolute left-1/2 -translate-x-1/2 top-28 flex flex-col items-center gap-3">
        <div class="text-white/90 uppercase tracking-wider text-sm">Croupier - Score : {{ gameInstance?.getDealerScore() }}</div>
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
        v-if="gameInstance && gameInstance.allHandsPlayed()"
        class="bg-white/90 text-[#0b6b2f] px-6 py-3 rounded-lg border-2 border-white/30 font-semibold cursor-pointer transition-all duration-200 hover:bg-white hover:scale-105 active:scale-[0.98]"
        @click="newRound"
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