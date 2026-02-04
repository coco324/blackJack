<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import EvaluationService from "../Services/EvaluationService";

const router = useRouter();

const frequence = ref("");
const clarte = ref("");
const note = ref(5);
const commentaire = ref("");
const error = ref("");

function resetForm() {
  frequence.value = "";
  clarte.value = "";
  note.value = 5;
  commentaire.value = "";
  error.value = "";
}

async function submitEvaluation() {
  error.value = "";
  if (!frequence.value || !clarte.value || !note.value) {
    error.value = "Veuillez remplir tous les champs";
    return;
  }

  if (Number(note.value) < 4 && (!commentaire.value || commentaire.value.trim() === "")) {
    error.value = "Un commentaire est requis si la note est inférieure à 4";
    return;
  }

  const res = await EvaluationService.CreateEvaluation(clarte.value, frequence.value, note.value, commentaire.value);
  if (res && res.id) {
    alert("Merci pour votre retour !");
    resetForm();
    router.push('/');
  } else {
    error.value = res?.error || res?.message || "Erreur lors de l'enregistrement";
  }
}
</script>

<template>
  <div>
    <h2>Évaluer nous</h2>

    <div>
      <p>Fréquence de jeu :</p>
      <label><input type="radio" v-model="frequence" value="regulier" /> Régulier</label>
      <label><input type="radio" v-model="frequence" value="ponctuel" /> Ponctuel</label>
      <label><input type="radio" v-model="frequence" value="rarement" /> Rarement</label>
    </div>

    <div>
      <p>Clarté des règles :</p>
      <label><input type="radio" v-model="clarte" value="tres_claire" /> Très claire</label>
      <label><input type="radio" v-model="clarte" value="moyen_claire" /> Moyen claire</label>
      <label><input type="radio" v-model="clarte" value="peu_claire" /> Peu claire</label>
    </div>

    <div>
      <p>Note :</p>
      <select v-model.number="note">
        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>

    <div>
      <p>Commentaire :</p>
      <textarea v-model="commentaire" rows="4"></textarea>
    </div>

    <p v-if="error">{{ error }}</p>

    <div>
      <button @click="submitEvaluation">Valider</button>
    </div>
  </div>
</template>
