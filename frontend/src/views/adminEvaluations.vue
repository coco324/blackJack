<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import EvaluationService from '../Services/EvaluationService';

const evaluations = ref([] as any[]);
const error = ref('');
const justifications = reactive({} as Record<number, string>);

async function load() {
  error.value = '';
  const res = await EvaluationService.GetEvaluations();
  if (res?.error) {
    error.value = res.error || 'Erreur';
  } else {
    evaluations.value = res;

  }
}

async function acceptEvaluation(id: number) {
  const justification = justifications[id] || '';
  const res = await EvaluationService.UpdateEvaluationStatus(id, 'validee', justification);
  if (res?.error) {
    error.value = res.error;
  } else {
    justifications[id] = '';
    await load();
  }
}

async function refuseEvaluation(id: number) {
  const justification = justifications[id] || '';
  const res = await EvaluationService.UpdateEvaluationStatus(id, 'refusee', justification);
  if (res?.error) {
    error.value = res.error;
  } else {
    justifications[id] = '';
    await load();
  }
}

onMounted(load);
</script>

<template>
  <div>
    <h2>Évaluations</h2>
    <p v-if="error">{{ error }}</p>
    <table v-if="evaluations.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Utilisateur</th>
          <th>Date</th>
          <th>Clarté</th>
          <th>Fréquence</th>
          <th>Note</th>
          <th>Commentaire</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in evaluations" :key="e.id">
          <td>{{ e.id }}</td>
          <td>{{ e.username || e.id_user }}</td>
          <td>{{ e.dateEnvoie }}</td>
          <td>{{ e.clarte }}</td>
          <td>{{ e.frequence }}</td>
          <td>{{ e.note }}</td>
          <td>{{ e.commentaire }}</td>
          <td>{{ e.statut }}</td>
            <td>
              <button v-if="e.statut == 'en_attente'" @click="acceptEvaluation(e.id)" class="mr-2">Accepter</button>
              <button v-if="e.statut == 'en_attente'" @click="refuseEvaluation(e.id)">Refuser</button>
            </td>
            <td>
              <textarea v-if="e.statut == 'en_attente'" v-model="justifications[e.id]" rows="2" placeholder="Justification " ></textarea>
            </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
