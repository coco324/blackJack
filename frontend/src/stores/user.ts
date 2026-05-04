import {defineStore} from 'pinia';
import { ref, type Ref, computed } from "vue";
import { user as UserType } from '../models/user';
import UserServices from '../Services/UserServices';

export const UserStore = defineStore('user', () => {

  const user: Ref<UserType | null> = ref(null);
  const isLogin: Ref<boolean> = ref(false);
  const isAdmin = computed(() => !!user.value && !!(user.value as any).isAdmin);

  async function initUser(){
    const res = await UserServices.CheckAuth()
    if(res.isConnected){
      user.value = new UserType(res.user.id, res.user.mail, res.user.username, res.user.solde, res.user.isAdmin)
      isLogin.value = true
    } else {
      user.value = null
      isLogin.value = false
    }
  }

  function reset() {
    user.value = null;
    isLogin.value = false;
  }

  return {
    user,
    isLogin,
    isAdmin,
    initUser,
    reset
  };

  
})