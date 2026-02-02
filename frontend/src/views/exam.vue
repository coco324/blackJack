<script setup>
import backgroundImage from '../assets/ImageBackgoundHome.png'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import UserServices from '../Services/UserServices'

const examData = ref([])

onMounted(async () => {
    await loadExamData()
})

async function loadExamData() {
    const data = await UserServices.GetExamData()
    if (data && !data.error) {
        examData.value = data
    }
}
</script>

<template>
<div class="min-h-screen bg-cover bg-center p-8" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-6">Page Exam</h1>
        <div class="bg-[#062c2c]/70 rounded-lg p-6">
            <p class="text-white">Contenu de la page exam</p>
        </div>
    </div>
</div>
</template>
