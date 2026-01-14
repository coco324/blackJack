<script setup lang="ts">
import { useRouter } from 'vue-router'
import backgroundImage from '../assets/ImageBackgoundHome.png'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center p-6" :style="{ backgroundImage: `url(${backgroundImage})` }">
    
    <!-- Bouton retour -->
    <button 
      @click="router.push('/')"
      class="absolute top-6 left-6 bg-gray-800/80 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m15 18-6-6 6-6"/>
      </svg>
      Retour
    </button>

    <div class="max-w-4xl w-full">
      <!-- Titre -->
      <h1 class="text-center mb-8 pb-2 bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-transparent font-bold text-5xl">
        Règles du Blackjack
      </h1>

      <!-- Contenu principal -->
      <div class="border-2 border-[#806210] rounded-2xl p-8 bg-[#083042]/95 backdrop-blur-md space-y-6">
        
        <!-- Objectif -->
        <div class="p-6 rounded-xl bg-gradient-to-b from-[#0d3d4d]/50 to-[#0a2d3d]/50">
          <h2 class="text-yellow-400 font-bold text-2xl mb-3 flex items-center gap-2">
            <span>🎯</span> Objectif du jeu
          </h2>
          <p class="text-white text-lg leading-relaxed">
            Battre le croupier en obtenant un total de points le plus proche possible de <span class="text-yellow-400 font-bold">21</span>, sans le dépasser.
          </p>
        </div>

        <!-- Valeur des cartes -->
        <div class="p-6 rounded-xl bg-gradient-to-b from-[#0d3d4d]/50 to-[#0a2d3d]/50">
          <h2 class="text-yellow-400 font-bold text-2xl mb-4 flex items-center gap-2">
            <span>🃏</span> Valeur des cartes
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
            <div class="p-4 bg-[#0a2d3d]/60 rounded-lg">
              <p class="font-bold text-yellow-300 mb-2">2 à 10</p>
              <p class="text-gray-300">Valeur nominale</p>
            </div>
            <div class="p-4 bg-[#0a2d3d]/60 rounded-lg">
              <p class="font-bold text-yellow-300 mb-2">Valet, Dame, Roi</p>
              <p class="text-gray-300">Valent 10 points</p>
            </div>
            <div class="p-4 bg-[#0a2d3d]/60 rounded-lg">
              <p class="font-bold text-yellow-300 mb-2">As</p>
              <p class="text-gray-300">1 ou 11 points</p>
            </div>
          </div>
        </div>

        <!-- Déroulement -->
        <div class="p-6 rounded-xl bg-gradient-to-b from-[#0d3d4d]/50 to-[#0a2d3d]/50">
          <h2 class="text-yellow-400 font-bold text-2xl mb-4 flex items-center gap-2">
            <span>🎮</span> Déroulement d'une partie
          </h2>
          <ol class="text-white space-y-3 text-lg">
            <li class="flex gap-3">
              <span class="text-yellow-400 font-bold min-w-[30px]">1.</span>
              <span>Placez votre mise</span>
            </li>
            <li class="flex gap-3">
              <span class="text-yellow-400 font-bold min-w-[30px]">2.</span>
              <span>Vous recevez 2 cartes visibles, le croupier en reçoit 2 (1 visible, 1 cachée)</span>
            </li>
            <li class="flex gap-3">
              <span class="text-yellow-400 font-bold min-w-[30px]">3.</span>
              <span>Choisissez votre action : <span class="text-yellow-300">Hit</span> (tirer), <span class="text-yellow-300">Stand</span> (rester), <span class="text-yellow-300">Double</span> ou <span class="text-yellow-300">Split</span></span>
            </li>
            <li class="flex gap-3">
              <span class="text-yellow-400 font-bold min-w-[30px]">4.</span>
              <span>Le croupier tire des cartes jusqu'à atteindre au minimum 17</span>
            </li>
          </ol>
        </div>

        <!-- Actions -->
        <div class="p-6 rounded-xl bg-gradient-to-b from-[#0d3d4d]/50 to-[#0a2d3d]/50">
          <h2 class="text-yellow-400 font-bold text-2xl mb-4 flex items-center gap-2">
            <span>⚡</span> Actions possibles
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
            <div class="p-4 bg-[#0a2d3d]/60 rounded-lg">
              <p class="font-bold text-yellow-300 mb-2">Hit (Tirer)</p>
              <p class="text-gray-300">Demander une carte supplémentaire</p>
            </div>
            <div class="p-4 bg-[#0a2d3d]/60 rounded-lg">
              <p class="font-bold text-yellow-300 mb-2">Stand (Rester)</p>
              <p class="text-gray-300">Conserver votre main actuelle</p>
            </div>
            <div class="p-4 bg-[#0a2d3d]/60 rounded-lg">
              <p class="font-bold text-yellow-300 mb-2">Double</p>
              <p class="text-gray-300">Doubler la mise et recevoir 1 carte</p>
            </div>
            <div class="p-4 bg-[#0a2d3d]/60 rounded-lg">
              <p class="font-bold text-yellow-300 mb-2">Split</p>
              <p class="text-gray-300">Séparer une paire en 2 mains</p>
            </div>
          </div>
        </div>

        <!-- Résultats -->
        <div class="p-6 rounded-xl bg-gradient-to-b from-[#0d3d4d]/50 to-[#0a2d3d]/50">
          <h2 class="text-yellow-400 font-bold text-2xl mb-4 flex items-center gap-2">
            <span>🏆</span> Résultats
          </h2>
          <div class="space-y-3 text-white text-lg">
            <div class="flex items-start gap-3">
              <span class="text-green-400">✓</span>
              <p><span class="font-bold text-green-400">Victoire :</span> Votre score est supérieur à celui du croupier (sans dépasser 21)</p>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-red-400">✗</span>
              <p><span class="font-bold text-red-400">Défaite :</span> Vous dépassez 21 ou le croupier a un meilleur score</p>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-yellow-400">≈</span>
              <p><span class="font-bold text-yellow-400">Égalité :</span> Même score que le croupier (mise récupérée)</p>
            </div>
            <div class="flex items-start gap-3">
              <span class="text-yellow-400">★</span>
              <p><span class="font-bold text-yellow-400">Blackjack :</span> 21 avec 2 cartes (As + figure), paie 3:2</p>
            </div>
          </div>
        </div>


      </div>

      <p class="text-white text-center mt-6 font-light">Misez intelligemment • Jouez responsable</p>
    </div>
  </div>
</template>
