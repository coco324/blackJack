<script setup>

import backgroundImage from '../assets/ImageBackgoundHome.png'
import AdminTable from '../components/AdminTable.vue'
import { useRouter } from 'vue-router'
import { ref,onMounted } from 'vue'
import UserServices from '../Services/UserServices'

const router = useRouter()
const Users = ref([]);

onMounted(() => {
    GetAllUsers();
});

async function GetAllUsers() {

    const res = await UserServices.GetAllUsers();
    if (res) {
        Users.value = res;
    }

}
</script>
<template>
<div class="min-h-screen bg-cover bg-center p-8" :style="{ backgroundImage: `url(${backgroundImage})` }">
	<button @click="router.push('/')" class="px-4 py-2 rounded-lg bg-gray-800 text-white font-semibold hover:bg-gray-700">Accueil</button>
    <button @click="router.push('/admin/evaluations')" class="px-4 py-2"> administration evaluation</button>
    <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-6">Administration</h1>
        <AdminTable :players="Users"></AdminTable>
    </div>
    
</div>

</template>