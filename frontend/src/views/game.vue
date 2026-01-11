<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Cardcomponents from '../components/cardComponents.vue'
import { game } from '../models/game.ts'
import GameServices from '../Services/GameServices'
import backgroundImage from '../assets/ImageBackgoundHome.png'
import { UserStore } from '../stores/user.ts'


const router = useRouter()
const gameStarted = ref(false)
const gameInstance = ref<game | null>(null)
const sessionId = ref<number | null>(null)
const currentSolde = ref(1000)
const currentBet = ref(10)
const startBet = ref(10)
const showBetSelection = ref(false)

onMounted(async () => {
  try {
    await UserStore().initUser()
    
    // On vérifie la connexion 
    if (!UserStore().isLogin) {
      return 
    }
    else {
      console.log('✅ Utilisateur identifié:', UserStore().user?.getUsername())
      console.log('📍 Création de la session...')
      
      const id = UserStore().user?.getId() || 0
      const sessionData = await GameServices.CreateSession(id)

      if (sessionData) {
        sessionId.value = sessionData.sessionId
        currentSolde.value = sessionData.startSolde
      }
  }

  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error)
  }
})
showBetSelection.value = true // a revoir plus tard
function split() {
  if (gameInstance.value) {
    currentSolde.value -= startBet.value // Déduire la mise du solde
    currentBet.value += startBet.value // Doubler la mise pour le split
    gameInstance.value.playerSplit()
  }
}

function double() {
  if (gameInstance.value) {
    // Déduire la mise supplémentaire du solde (pour cette main uniquement)
    const handBet = gameInstance.value.getCurrentHand().getBet()
    currentSolde.value -= handBet
    currentBet.value += handBet // Augmenter le total de la mise actuelle
    gameInstance.value.playerDouble()
  }
}

function showBetMenu() {
  showBetSelection.value = true
}

function selectBet(Bet: number) {
  if (Bet > currentSolde.value) {
    alert('Solde insuffisant !')
    return
  }
  startBet.value = Bet
  currentBet.value = Bet
  showBetSelection.value = false
  startGame()
}

function startGame() {
  if (currentBet.value > currentSolde.value) {
    alert('Solde insuffisant !')
    return
  }

  // Déduire la mise du solde local
  currentSolde.value -= currentBet.value

  // On crée l'instance. Si sessionId est null, on passe 0 ou null.
  const id = sessionId.value || 0 

  if (!gameInstance.value) {
    gameInstance.value = new game(id)
    gameInstance.value.startGame()
    gameInstance.value.getPlayer().getCurrentHand().setBet(currentBet.value) // ajouter la mise a la main
  } else {
    gameInstance.value.resetRound()
    gameInstance.value.getCurrentHand().setBet(currentBet.value)
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

async function newRoundSameBet() {
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
  selectBet(startBet.value)
}

function formatScore(index: number): string {
  if (!gameInstance.value) return '0'
  
  const scores = gameInstance.value.getPlayerScoreByIndexWithAs(index)
  if (scores.length === 2 && scores[1] !== undefined && scores[1] > 0) {
    return `${scores[0]} / ${scores[1]}`
  }
  return `${scores[0]}`
}

async function endSession() {
  // On vérifie que sessionId existe ET n'est pas 0
if (sessionId.value && sessionId.value !== 0) {
  console.log('🛑 Fin de session enregistrée:', sessionId.value, 'Solde:', currentSolde.value)
  await GameServices.EndSession(sessionId.value, currentSolde.value)
} else {
  console.log('👋 Fin de partie Invité (non enregistré)')
}



// Dans tous les cas, on redirige vers l'accueil
router.push('/')
}
</script>

<template>
  <div class="h-screen flex items-center justify-center relative bg-cover bg-center" :style="{ backgroundImage: `url(${backgroundImage})` }"">
    
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
      <div class="border border-white/30 p-4 rounded-lg bg-black/20 mt-4 min-w-[400px]">
        <h2 class="text-white text-2xl font-bold mb-2">Mise Personalisé:</h2>
        <div class="px-1">
          <input type="range" min="0" :max="currentSolde" v-model.number="startBet" class="w-full h-2 bg-orange-500 rounded-lg appearance-none cursor-pointer accent-blue-500" />
        </div>
        <button 
          @click="selectBet(startBet)"
          :disabled="startBet > currentSolde || startBet <= 0"
          class="mt-3 w-full bg-[#ffd54a] text-gray-900 px-8 py-2 rounded-lg font-bold cursor-pointer hover:bg-[#ffe066] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Valider {{ startBet }} €
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
        <div class="mb-2 p-4 rounded-lg flex gap-4">
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
          <button v-if="gameInstance && gameInstance.getPlayerStatus() === 'start' && currentSolde >= currentBet"
            class="bg-white/90 text-[#0b6b2f] px-6 py-3 rounded-lg border-2 border-white/30 font-semibold cursor-pointer transition-all duration-200 hover:bg-white hover:scale-105 active:scale-[0.98]"
            @click="double()">
            Double 
          </button>
          <button
            v-if="gameInstance && gameInstance.getPlayerStatus() === 'start' && gameInstance.canSplit() && currentSolde >= currentBet"
            class="bg-white/90 text-[#0b6b2f] px-6 py-3 rounded-lg border-2 border-white/30 font-semibold cursor-pointer transition-all duration-200 hover:bg-white hover:scale-105 active:scale-[0.98]"
            @click="split()"
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
                  Score : {{ formatScore(pIndex) }}
                </div>
                
                <div class="flex gap-4 justify-center">
                    <Cardcomponents
                        v-for="(card, index) in hand"
                        :key="'hand-' + pIndex + '-card-' + index"
                        :value="card.getNom()"
                        :suit="card.getSigne()"
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
            :value="card.getNom()"
            :suit="card.getSigne()"
            :faceUp="card.getIsFaceUp()"
            backVariant="dots"
          />
        </div>
      </div>

      <button 
        v-if="gameInstance && gameInstance.allHandsPlayed()"
        class="bg-white/90 text-[#0b6b2f] px-6 py-3 rounded-lg border-2 border-white/30 font-semibold cursor-pointer transition-all duration-200 hover:bg-white hover:scale-105 active:scale-[0.98]"
        @click="newRound"
      >
        Nouvelle Mise
      </button>
      <button 
        v-if="gameInstance && gameInstance.allHandsPlayed()"
        class="bg-white/90 text-[#0b6b2f] px-6 py-3 rounded-lg border-2 border-white/30 font-semibold cursor-pointer transition-all duration-200 hover:bg-white hover:scale-105 active:scale-[0.98]"
        @click="newRoundSameBet"
      >
        Même Mise
      </button>
      
    </div>
  </div>
</template>

