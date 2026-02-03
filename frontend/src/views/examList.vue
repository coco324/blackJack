<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import backgroundImage from '../assets/ImageBackgoundHome.png';
import ExamServices from '../Services/ExamServices';

const router = useRouter();
const exams = ref<any[]>([]);

onMounted(async () => {
  const response = await ExamServices.GetAllExams();
  if (response.exams) {
    exams.value = response.exams;
  }
});
</script>

<template>
  <div class="min-h-screen bg-cover bg-center p-8" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <button @click="router.back()" class="px-4 py-2 rounded-lg bg-gray-800 text-white mb-6">Retour</button>

    <div class="bg-[#083042] border-2 border-[#806210] rounded-2xl overflow-hidden max-w-4xl mx-auto">
      <table class="w-full">
        <thead class="bg-[#062626]">
          <tr>
            <th class="px-6 py-3 text-left text-yellow-400 font-bold">ID</th>
            <th class="px-6 py-3 text-left text-yellow-400 font-bold">Champ 1</th>
            <th class="px-6 py-3 text-left text-yellow-400 font-bold">Champ 2</th>
            <th class="px-6 py-3 text-left text-yellow-400 font-bold">Champ 3</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exam in exams" :key="exam.id" class="border-t border-gray-700">
            <td class="px-6 py-3 text-white">{{ exam.id }}</td>
            <td class="px-6 py-3 text-white">{{ exam.champ1 }}</td>
            <td class="px-6 py-3 text-white">{{ exam.champ2 }}</td>
            <td class="px-6 py-3 text-white">{{ exam.champ3 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
