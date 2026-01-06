<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../Services/UserServices";
import backgroundImage from '../assets/ImageBackgoundHome.png'

const router = useRouter();
const emailErrorMessage = ref("Le champ ne doit pas être vide");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1. Un objet réactif pour les données du formulaire
const form = ref({
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
});

// 2. Un objet pour gérer l'état des erreurs
const errors = ref({
  email: false,
  username: false,
  password: false,
  confirmPassword: false,
});

function resetErrors() {
  errors.value.email = false;
  errors.value.username = false;
  errors.value.password = false;
  errors.value.confirmPassword = false;
}

async function VerifLogin() {
  // Réinitialisation des erreurs
  resetErrors();
  emailErrorMessage.value = "Le champ ne doit pas être vide"; // Reset du message par défaut

  // Validations

  if (!form.value.email) errors.value.email = true;
  else if (!emailRegex.test(form.value.email)) {
    errors.value.email = true;
    emailErrorMessage.value = "Veuillez rentrez un email valide";
    return;
  }
  if (!form.value.username) errors.value.username = true;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
  if (!regex.test(form.value.password)) errors.value.password = true;
  if (form.value.confirmPassword !== form.value.password)
    errors.value.confirmPassword = true;

  try {
    const res = await UserServices.CreateUser(
      form.value.email,
      form.value.password,
      form.value.username
    );
    if (res.user) {
      router.push("/"); // Redirection après succès
    }
    if (res.message == "Un compte est déjà associé à ce mail") {
      errors.value.email = true;
      emailErrorMessage.value = "Un compte est déjà associé à ce mail";
    }
  } catch (err) {
    console.error("Erreur", err);
  }
}
</script>
<template>
  <div class="relative min-h-screen w-full flex items-center justify-center bg-center bg-cover" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <button @click="router.back()" class="absolute top-6 left-6 flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
      <span class="text-xl font-semibold">Retour</span>
    </button>

    <div class="bg-white rounded-2xl shadow-2xl p-6 pt-2 w-80">
      <p class="text-gray-800 font-bold flex justify-center mb-4">
        Inscription
      </p>

      <p class="text-gray-800 font-bold flex justify-start">Email :</p>
      <input v-model="form.email" type="text" :class="['bg-gray-300 rounded-md p-1 w-full border-2',errors.email ? 'border-red-600 mb-1' : 'mb-4 border-transparent', ]" />
      <p v-if="errors.email" class="text-red-600 text-[11px] leading-none font-bold mb-4"  > {{ emailErrorMessage }} </p>

      <p class="text-gray-800 font-bold flex justify-start"> Nom d'utilisateur : </p>
      <input v-model="form.username"  type="text" :class="[  'bg-gray-300 rounded-md p-1 w-full border-2',  errors.username ? 'border-red-600 mb-1' : 'mb-4 border-transparent', ]"/>
      <p v-if="errors.username" class="text-red-600 text-[11px] leading-none font-bold mb-4"> Le champ ne doit pas être vide</p>

      <p class="text-gray-800 font-bold flex justify-start">Mot de passe :</p>
      <input v-model="form.password" type="password" :class="[ 'bg-gray-300 rounded-md p-1 w-full border-2', errors.password ? 'border-red-600 mb-1' : 'mb-4 border-transparent', ]" />
      <p v-if="errors.password" class="text-red-600 text-xs leading-none font-bold mb-4" > Ne respecte pas les critères de sécurité </p>

      <p class="text-gray-800 font-bold flex justify-start">  Confirmer le mot de passe : </p>
      <input v-model="form.confirmPassword" type="password" :class="[  'bg-gray-300 rounded-md p-1 w-full border-2', errors.confirmPassword   ? 'border-red-600 mb-1' : 'mb-4 border-transparent', ]" />
      <p v-if="errors.confirmPassword" class="text-red-600 text-[11px] leading-none font-bold mb-4" > Les mots de passe ne correspondent pas</p>

      <div class="flex justify-center mt-4">
        <button @click="VerifLogin" class="bg-yellow-600 text-white rounded-md px-4 py-2 hover:bg-yellow-700 transition-colors" >  S'inscrire </button>
      </div>
    </div>
  </div>
</template>