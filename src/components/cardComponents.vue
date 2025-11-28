<template>
  <div
    :class="[
      'w-[100px] h-[140px] sm:w-[120px] sm:h-[170px]',
      'rounded-lg border border-black/15',
      'flex flex-col justify-between p-2',
      'box-border select-none relative',
      'font-sans transition-all duration-300 ease-in-out',
      'hover:shadow-xl hover:-translate-y-1',
      faceUp ? 'bg-white shadow-lg' : 'bg-gradient-to-br from-blue-900 via-blue-500 to-blue-900'
    ]"
    role="img"
    :aria-label="faceUp ? `${value} de ${suit}` : 'Dos de la carte'"
  >
    <template v-if="faceUp">
      <!-- Coin supérieur -->
      <div class="flex flex-col gap-0.5 leading-none items-start">
        <div :class="['text-base sm:text-lg font-bold leading-none', suitClass]">
          {{ value }}
        </div>
        <div :class="['text-sm leading-none', suitClass]">
          {{ suit }}
        </div>
      </div>

      <!-- Centre -->
      <div class="flex items-center justify-center flex-1">
        <div :class="['text-5xl sm:text-[56px] leading-none', suitClass]">
          {{ suit }}
        </div>
      </div>

      <!-- Coin inférieur (rotation 180°) -->
      <div class="flex flex-col gap-0.5 leading-none items-start rotate-180">
        <div :class="['text-base sm:text-lg font-bold leading-none', suitClass]">
          {{ value }}
        </div>
        <div :class="['text-sm leading-none', suitClass]">
          {{ suit }}
        </div>
      </div>
    </template>

    <!-- Dos de carte -->
    <template v-else>
      <div 
        class="absolute inset-3 border-2 border-white/30 rounded bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]"
      ></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: string
  suit: string
  faceUp?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  faceUp: true
})

const suitClass = computed(() => {
  return props.suit === '♥' || props.suit === '♦' ? 'text-red-600' : 'text-gray-800'
})
</script>