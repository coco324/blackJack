
<script setup>
import backgroundImage from '../assets/ImageBackgoundHome.png'
import trophyComponent from '../components/logoComponents/trophyComponent.vue'
import medalComponent from '../components/logoComponents/medalComponent.vue'
import statComponent from '../components/logoComponents/statComponent.vue'
import LeaderboardTable from '../components/LeaderboardTable.vue'
import { useRouter } from 'vue-router'
import { ref,onMounted } from 'vue'
import UserServices from '../Services/UserServices'

const router = useRouter()
const leaders = ref([]);

onMounted(() => {
    GetLeaderboard();
});

async function GetLeaderboard() {

    const res = await UserServices.GetLeaderboard();
    if (res) {
        leaders.value = res;
    }

}


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
