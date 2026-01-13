<script setup>
import backgroundImage from '../assets/ImageBackgoundHome.png'
import trophyComponent from '../components/logoComponents/trophyComponent.vue';
import statComponent from '../components/logoComponents/statComponent.vue';
import medalComponent from '../components/logoComponents/medalComponent.vue';
import UserServices from '../Services/UserServices';
import { ref, onMounted } from 'vue';
import router from '../router';
import { UserStore } from '../stores/user';

const stats = ref({ victoires: 0, parties: 0, taux: 0 });
// 1. Vérification automatique au chargement (et à chaque retour sur la page)
onMounted(async () => {
  await UserStore().initUser();
  if (UserStore().isLogin) {
    await loadStats();
  }
});

// 2. Fonction de Login
async function fakeLogin() {
  const res = await UserServices.Login('a@a.com', 'aA1&zz');
  // console.log("Réponse Login:", res);
  await UserStore().initUser();

  await loadStats();
}
async function Logout() {
  UserServices.Logout();
  UserStore().reset();
  stats.value = { victoires: 0, parties: 0, taux: 0 };
}


async function loadStats() {
  const res = await UserServices.GetUserStats();
  // console.log(res);
  if (res && !res.error) {
    stats.value = {
      victoires: res.totalWins || 0,
      parties: res.totalGames || 0,
      taux: (res.totalWins / res.totalGames * 100).toFixed(1),
    };
  }
}

</script>

<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div v-if="!UserStore().isLogin" class="absolute top-6 right-6 flex gap-4 p-2 ">
      <button class="bg-gray-800 px-4 py-1 rounded-lg text-white font-bold hover:bg-gray-700 active:bg-gray-600" @click="router.push('/login')">Se connecter</button>
      <button class="bg-green-800 px-4 py-1 rounded-lg text-white font-bold hover:bg-green-700 active:bg-green-600"@click="router.push('/registration')">S'inscrire</button>
    </div>
    <div v-if="UserStore().isLogin" class="absolute top-6 right-6 flex gap-4 p-2 ">
      <div class="absolute top-6 right-6 z-50 group">
        <div class="p-1 rounded-2xl bg-[#0a263d]/90 backdrop-blur-md border-2 border-[#806210] shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center gap-1">
          <div class="w-8 h-8 rounded-full bg-[#0a263d] flex items-center justify-center border-2 border-yellow-500 m-2">
            <span class="text-yellow-500 font-bold">{{ UserStore().user.getUsername().charAt(0) }}</span>
          </div>
          <p class="text-white font-bold mr-2">{{ UserStore().user?.getUsername() }}</p>
        <div class="px-4 py-2 text-center min-w-[120px]">
          <p class="text-[10px] text-gray-500 uppercase font-black leading-none mb-1">Solde</p>
          <p class="text-yellow-400 font-black flex items-center justify-center gap-1 text-[15px]">
            {{ UserStore().user?.getSolde() }}
            <span class="text-[15px] opacity-70">€</span>
          </p>
        </div>
        <button class="rounded-lg text-white hover:text-gray-400" @click="Logout()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg></button>

    </div>
    </div>
  </div>
    <div class="size-200 flex flex-col items-center">
      <h1 class="p-6 pt-26 bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-transparent font-bold text-6xl ">BLACKJACK</h1>
      <h2 class="text-yellow-100 pb-6 text-lg font-bold">Tentez votre chance et battez le croupier !</h2>


      <div class="border-2 border-[#806210] rounded-2xl p-6 bg-[#083042] grid grid-cols-2 gap-4 mb-8 m-4 w-full ">
        <button class="p-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg col-span-2 font-bold text-lg h-17 hover:bg-gradient-to-r hover:from-yellow-600 hover:to-yellow-700 active:bg-gradient-to-r active:from-yellow-700 active:to-yellow-800" @click="router.push('/game')">{{ UserStore().user ? 'Jouer' : 'Jouer en invité' }}</button>
        <button class="p-2 border border-gray-600 rounded-lg text-white h-15 hover:bg-gray-700 active:bg-gray-800" @click="router.push('/rules')" :class="UserStore().isLogin ? 'col-span-1' : 'col-span-2'">Règle du jeu</button>
        <button v-if="UserStore().isLogin" class="p-2 border border-gray-600 rounded-lg text-white h-15 hover:bg-gray-700 col-span-1 active:bg-gray-800" @click="router.push('/leaderboard')">Classement</button>
      </div>

      
      <div v-if="!UserStore().isLogin" class="w-full max-w-4xl mx-auto p-8 rounded-2xl bg-[#062c2c]/80 border border-white/5 backdrop-blur-md">
        <h3 class="text-[#00e699] text-center font-medium mb-10 text-lg">
          Connectez-vous pour débloquer plus de fonctionnalités !
        </h3>

        <div class="grid grid-cols-3 gap-4">
      
        <div class="flex flex-col items-center hover:scale-110 duration-200 group">
          <div class="w-16 h-16 rounded-full bg-[#0a3d3d] flex items-center justify-center mb-4 ">
            <trophyComponent class="w-7 h-7 text-[#00e699]" />
          </div>
          <span class="text-gray-300 text-sm font-bold ">
            Classement mondial
          </span>
        </div>

        <div class="flex flex-col items-center hover:scale-110 duration-200 group">
          <div class="w-16 h-16 rounded-full bg-[#0a3d3d] flex items-center justify-center mb-4 ">
            <statComponent class="w-7 h-7 text-[#00e699]" />
          </div>
          <span class="text-gray-300 text-sm font-bold">
            Suivie des statistiques
          </span>
        </div>

        <div class="flex flex-col items-center hover:scale-110 duration-200 group">
          <div class="w-16 h-16 rounded-full bg-[#0a3d3d] flex items-center justify-center mb-4">
            <medalComponent class="w-7 h-7 text-[#00e699]" />
          </div>
          <span class="text-gray-300 text-sm font-bold">
            Succes & récompenses
          </span>
        </div>

        </div>
      </div>

      <!-- statistiques si connecté -->
      <div v-if="UserStore().isLogin" class="border-2 border-[#806210] rounded-2xl p-6 bg-[#083042] grid grid-cols-3 gap-4 m-4 w-full">
        <div class="flex flex-col items-center p-4 rounded-xl bg-gradient-to-b from-[#0d3d4d]/50 to-[#0a2d3d]/50 hover:scale-105 duration-200  ">
          <p class="text-5xl font-black text-yellow-400 mb-2">{{ stats.victoires }}</p>
          <p class="text-gray-300 text-sm font-semibold">Victoires</p>
        </div>
        <div class="flex flex-col items-center p-4 rounded-xl bg-gradient-to-b from-[#0d3d4d]/50 to-[#0a2d3d]/50 hover:scale-105 duration-200">
          <p class="text-5xl font-black text-yellow-400 mb-2">{{ stats.parties }}</p>
          <p class="text-gray-300 text-sm font-semibold">Parties</p>
        </div>
        <div class="flex flex-col items-center p-4 rounded-xl bg-gradient-to-b from-[#0d3d4d]/50 to-[#0a2d3d]/50 hover:scale-105 duration-200">
          <p class="text-5xl font-black text-yellow-400 mb-2">{{ stats.taux }}%</p>
          <p class="text-gray-300 text-sm font-semibold">Taux</p>
        </div>
      </div>
      <p class="text-white font-light ">Misez intelligemment • Jouez responsable</p>

    </div>
  </div>
  
        

</template>