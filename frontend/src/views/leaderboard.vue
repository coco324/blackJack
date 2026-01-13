
<script setup>
import backgroundImage from '../assets/ImageBackgoundHome.png'
import trophyComponent from '../components/logoComponents/trophyComponent.vue'
import medalComponent from '../components/logoComponents/medalComponent.vue'
import statComponent from '../components/logoComponents/statComponent.vue'
import LeaderboardTable from '../components/LeaderboardTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const leaders = ref([
	{ username: 'Antony', wins: 120, games: 150, points: 2400 },
	{ username: 'Marion', wins: 100, games: 140, points: 2000 },
	{ username: 'Ludo', wins: 88, games: 120, points: 1760 },
	{ username: 'Sacha', wins: 55, games: 95, points: 1100 },
	{ username: 'Alex', wins: 42, games: 80, points: 840 },
	{ username: 'Nora', wins: 30, games: 70, points: 600 },
])
</script>

<template>
	<div class="min-h-screen bg-cover bg-center flex items-start justify-center py-12" :style="{ backgroundImage: `url(${backgroundImage})` }">
		<div class="w-full max-w-4xl px-6">
			<div class="flex items-center justify-between mb-6">
				<div>
					<h1 class="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-500">CLASSEMENT</h1>
					<p class="text-yellow-100 mt-1">Top joueurs</p>
				</div>
				<div class="flex items-center gap-3">
					<button @click="router.push('/')" class="px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-700">Accueil</button>
				</div>
			</div>

			<div class="rounded-2xl border-2 border-[#806210] bg-[#083042] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
				<LeaderboardTable :players="leaders" />
			</div>
		</div>
	</div>
</template>
