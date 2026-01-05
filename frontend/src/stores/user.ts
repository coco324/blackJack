import {defineStore} from 'pinia';
import { ref } from 'vue'

export const UserStore = defineStore('user', () => {

  const profile = ref({
    username: 'coco',
    email: 'coco@c.com',
    isLoggedIn: false
  })

  return { profile }
})