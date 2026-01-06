import {defineStore} from 'pinia';
import { ref, type Ref } from "vue";
import { user } from '../models/user';
import UserServices from '../Services/UserServices';

export const UserStore = defineStore('user', () => {

  const user: Ref<user | null> = ref(null);
  const isLogin: Ref<boolean> = ref(false);

  async function initUser(){
    const res = await UserServices.CheckAuth()
    if(res){
      user.value = res
      isLogin.value = true
    } else {
      user.value = null
      isLogin.value = false
    }
  }

  return {
    user,
    isLogin,
    initUser
  };

  
})