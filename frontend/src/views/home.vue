<script setup>
import backgroundImage from '../assets/ImageBackgoundHome.png'
import trophyComponent from '../components/logoComponents/trophyComponent.vue';
import statComponent from '../components/logoComponents/statComponent.vue';
import medalComponent from '../components/logoComponents/medalComponent.vue';
import UserServices from '../Services/UserServices';
import { ref, onMounted } from 'vue';

const isLoggedIn = ref(false);
const user = ref(null);

// 1. Vérification automatique au chargement
onMounted(async () => {
  await checkAuth();
});

// 2. Fonction de Login
async function fakeLogin() {
  const res = await UserServices.Login('a@a.com', 'aA1&zz');
  console.log("Réponse Login:", res);
  
  if (res.user) { // Si le backend renvoie l'objet user
    isLoggedIn.value = true;
    user.value = res.user;
  }
}

// 3. Fonction de vérification de session
async function checkAuth() {
  const res = await UserServices.CheckAuth();
  console.log("Réponse CheckAuth:", res);
  
  if (res.isConnected) {
    isLoggedIn.value = true;
    user.value = res.user;
  } else {
    isLoggedIn.value = false;
    user.value = null;
  }
}
</script>

<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="absolute top-6 right-6 flex gap-4 p-2 ">
      <button class="bg-gray-800 px-4 py-1 rounded-lg text-white font-bold hover:bg-gray-700 active:bg-gray-600 " @click="fakeLogin()">Se connecter</button>
      <button class="bg-green-800 px-4 py-1 rounded-lg text-white font-bold hover:bg-green-700 active:bg-green-600"@click="checkAuth()">S'inscrire</button>
    </div>



    <div class="size-200 flex flex-col items-center">
      <h1 class="p-6 pt-26 bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-transparent font-bold text-6xl ">BLACKJACK</h1>
      <h2 class="text-yellow-100 pb-6 text-lg font-bold">Tentez votre chance et battez le croupier !</h2>


      <div class="border border-2 border-[#806210] rounded-2xl p-6 bg-[#083042] grid grid-cols-2 gap-4 mb-8 m-4 w-full ">
        <button class="p-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg col-span-2 font-bold text-lg h-17 hover:bg-gradient-to-r hover:from-yellow-600 hover:to-yellow-700 active:bg-gradient-to-r active:from-yellow-700 active:to-yellow-800">Jouer en invité</button>
        <button class="p-2 border border-gray-600 rounded-lg text-white h-15 hover:bg-gray-700 active:bg-gray-800">Régle du jeu</button>
        <button class="p-2 border border-gray-600 rounded-lg text-white h-15 hover:bg-gray-700 active:bg-gray-800">In comming ....</button>
      </div>

      
      <div class="w-full max-w-4xl mx-auto p-8 rounded-2xl bg-[#062c2c]/80 border border-white/5 backdrop-blur-md">
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
  </div>
  </div>
        

</template>