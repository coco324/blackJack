<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import backgroundImage from '../assets/ImageBackgoundHome.png';
import ExamServices from '../Services/ExamServices';

const router = useRouter();

// Valeurs récupérées depuis les zones de texte
const value1 = ref("");
const value2 = ref("");
const value3 = ref("");

// Messages de retour
const successMessage = ref("");
const errorMessage = ref("");

// Fonction appelée lors du clic sur le bouton de validation
async function Submit() {
  // Réinitialiser les messages
  successMessage.value = "";
  errorMessage.value = "";

  // Vérifier que les champs ne sont pas vides
  if (!value1.value || !value2.value || !value3.value) {
    errorMessage.value = "Tous les champs sont obligatoires";
    return;
  }

  try {
    // Appel au service pour insérer en base
    const response = await ExamServices.InsertExam(
      value1.value,
      value2.value,
      value3.value
    );

    if (response.error) {
      errorMessage.value = response.error;
    } else {
      successMessage.value = "Données insérées avec succès !";
      console.log("Insertion réussie:", response);
      
    }
  } catch (error) {
    errorMessage.value = "Erreur lors de l'insertion";
    console.error(error);
  }
}

// Fonction pour réinitialiser les champs
function Reset() {
  value1.value = "";
  value2.value = "";
  value3.value = "";
  successMessage.value = "";
  errorMessage.value = "";
}
</script>

<template>
  <div class="relative min-h-screen w-full flex items-center justify-center bg-center bg-cover" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <!-- Bouton retour -->
    <button @click="router.back()" class="absolute top-6 left-6 flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
      <span class="text-xl font-semibold">Retour</span>
    </button>

    <!-- Formulaire principal -->
    <div class="bg-[#083042] border-2 border-[#806210] rounded-2xl shadow-2xl p-8 w-96">
      <h2 class="text-yellow-400 font-bold text-2xl text-center mb-6">Formulaire</h2>

      <!-- Zone de texte 1 -->
      <div class="mb-4">
        <label class="text-white font-bold mb-2 block">Champ 1 :</label>
        <input 
          v-model="value1" 
          type="text" 
          placeholder="Entrez une valeur"
          class="bg-gray-700 text-white rounded-lg p-3 w-full border-2 border-gray-600 focus:border-yellow-500 focus:outline-none"
        />
      </div>

      <!-- Zone de texte 2 -->
      <div class="mb-4">
        <label class="text-white font-bold mb-2 block">Champ 2 :</label>
        <input 
          v-model="value2" 
          type="text" 
          placeholder="Entrez une valeur"
          class="bg-gray-700 text-white rounded-lg p-3 w-full border-2 border-gray-600 focus:border-yellow-500 focus:outline-none"
        />
      </div>

      <!-- Zone de texte 3 -->
      <div class="mb-6">
        <label class="text-white font-bold mb-2 block">Champ 3 :</label>
        <input 
          v-model="value3" 
          type="text" 
          placeholder="Entrez une valeur"
          class="bg-gray-700 text-white rounded-lg p-3 w-full border-2 border-gray-600 focus:border-yellow-500 focus:outline-none"
        />
      </div>

      <!-- Messages de retour -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-600 text-white rounded-lg text-center font-bold">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-600 text-white rounded-lg text-center font-bold">
        {{ errorMessage }}
      </div>

      <!-- Boutons d'action -->
      <div class="flex gap-4">
        <button 
          @click="Submit" 
          class="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg px-6 py-3 hover:from-yellow-600 hover:to-yellow-700 active:from-yellow-700 active:to-yellow-800 transition-all"
        >
          Valider
        </button>
        
        <button 
          @click="Reset" 
          class="flex-1 bg-gray-700 text-white font-bold rounded-lg px-6 py-3 hover:bg-gray-600 active:bg-gray-500 border-2 border-gray-600 transition-all"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  </div>
</template>
