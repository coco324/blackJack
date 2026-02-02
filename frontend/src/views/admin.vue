<script setup>
import backgroundImage from '../assets/ImageBackgoundHome.png'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import UserServices from '../Services/UserServices'

const router = useRouter()
const users = ref([])
const editingId = ref(null)
const newSolde = ref(0)

onMounted(async () => {
    await loadUsers()
})

async function loadUsers() {
    const res = await UserServices.GetAllUsers()
    if (res && !res.error) {
        users.value = res
    }
}

function startEdit(user) {
    editingId.value = user.id
    newSolde.value = user.solde
}

async function saveEdit(userId) {
    await UserServices.UpdateUserSolde(userId, newSolde.value)
    editingId.value = null
    await loadUsers()
}

function cancelEdit() {
    editingId.value = null
}

async function deleteUser(userId) {
    const user = users.value.find(u => u.id === userId)
    
    if (confirm('Supprimer cet utilisateur ?')) {
        await UserServices.DeleteUser(userId)
        await loadUsers()
    }
}
</script>

<template>
<div class="min-h-screen bg-cover bg-center p-8" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <button @click="router.push('/')" class="mb-4 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700">
        Retour
    </button>
    
    <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-6">Administration</h1>
        
        <div class="bg-[#062c2c]/70 rounded-lg p-4">
            <table class="w-full text-white">
                <thead>
                    <tr class="border-b border-white/20">
                        <th class="text-left p-3">ID</th>
                        <th class="text-left p-3">Nom</th>
                        <th class="text-left p-3">Email</th>
                        <th class="text-right p-3">Solde</th>
                        <th class="text-center p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id" class="border-b border-white/10 hover:bg-white/5">
                        <td class="p-3">{{ user.id }}</td>
                        <td class="p-3">{{ user.username }}</td>
                        <td class="p-3">{{ user.mail }}</td>
                        <td class="p-3 text-right">
                            <span v-if="editingId !== user.id">{{ user.solde }}€</span>
                            <input 
                                v-else 
                                v-model.number="newSolde" 
                                type="number" 
                                class="w-24 px-2 py-1 bg-gray-700 rounded"
                            />
                        </td>
                        <td class="p-3">
                            <div class="flex gap-2 justify-center">
                                <template v-if="editingId === user.id">
                                    <button @click="saveEdit(user.id)" class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                                        Sauver
                                    </button>
                                    <button @click="cancelEdit()" class="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm">
                                        Annuler
                                    </button>
                                </template>
                                <template v-else>
                                    <button @click="startEdit(user)" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                                        Modifier
                                    </button>
                                    <button 
                                        @click="deleteUser(user.id)" 
                                        :disabled="user.isAdmin"
                                        :class="user.isAdmin ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'"
                                        class="px-3 py-1 rounded text-sm"
                                    >
                                        Supprimer
                                    </button>
                                </template>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>