<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../Services/UserServices";
import backgroundImage from '../assets/ImageBackgoundHome.png'

const router = useRouter();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1. Un objet réactif pour les données du formulaire
const form = ref({
  email: "",
  password: "",
});
// 2. Un objet pour gérer l'état des erreurs
const errors = ref({
  email: false,
  password: false,
});
function resetErrors() {
  errors.value.email = false;
  errors.value.password = false;
  emailError.value = "Le champ ne doit pas être vide";
  passwordError.value = "Le champ ne doit pas être vide";
}

const emailError = ref("Le champ ne doit pas être vide");
const passwordError = ref("Le champ ne doit pas être vide");
async function VerifLogin() {
  resetErrors();

  if (!form.value.email) {
    errors.value.email = true;
  }
  if (!form.value.password) {
    errors.value.password = true;
  }
  if (errors.value.email || errors.value.password) {
    return;
  }
  if (!emailRegex.test(form.value.email)) {
    errors.value.email = true;
    emailError.value = "Veuillez rentrez un email valide";
    return;
  }

  const res = await UserServices.Login(form.value.email, form.value.password);

  if (res.message == "Connexion réussie") {
    // Rediriger vers la page précédente
    router.back();
  } else {
    // Gérer les erreurs de validation
    if (res.message == "Identifiants invalides") {
      errors.value.email = true;
      errors.value.password = true;
      emailError.value = "Email ou mot de passe incorrect";
      passwordError.value = "Email ou mot de passe incorrect";
    }
  }
}
</script>
<template>
  <div class="relative min-h-screen w-full flex items-center justify-center bg-center bg-cover" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <button @click="router.back()" class="absolute top-6 left-6 flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
        <span class="text-xl font-semibold">Retour</span>
    </button>

    <div class="bg-white rounded-2xl shadow-2xl p-6 pt-2 w-80">
      <p class="text-gray-800 font-bold flex justify-center mb-4">Connexion</p>

      <p class="text-gray-800 font-bold flex justify-start">Email :</p>
      <input v-model="form.email" type="text" :class="[ 'bg-gray-300 rounded-md p-1 w-full border-2', errors.email ? 'border-red-600 mb-1' : 'mb-4 border-transparent', ]" />
      <p v-if="errors.email" class="text-red-600 text-[11px] leading-none font-bold mb-4" > {{ emailError }} </p>

      <p class="text-gray-800 font-bold flex justify-start">Mot de passe :</p>
      <input v-model="form.password" type="password" :class="['bg-gray-300 rounded-md p-1 w-full border-2', errors.password ? 'border-red-600 mb-1' : 'mb-4 border-transparent', ]"/>
      <p v-if="errors.password" class="text-red-600 text-xs leading-none font-bold mb-4" > {{ passwordError }} </p>

      <div class="flex justify-center mt-4">
        <button @click="VerifLogin()" class="bg-[#64067C] text-white rounded-md px-4 py-2 hover:bg-[#850451] transition-colors" >
          Se connecter
        </button>
      </div>

      <button class="font-bold pt-4 hover:text-gray-600" @click="router.push('/registration')" >
        Pas de compte ? S'inscrire
      </button>
    </div>
  </div>
</template>