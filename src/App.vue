<template>
  <!-- Header -->
  <AppHeader/>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </Transition>
  </RouterView>
  <AppPlayer />
  <AppAuth/>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import AppAuth from '@/components/AppAuth.vue';
import AppPlayer from '@/components/AppPlayer.vue';

import { mapWritableState } from 'pinia';
import useUserStore from '@/stores/user';
import { auth, onAuthStateChanged } from '@/includes/firebase';

export default {
  name: "App",
  components: {
    AppHeader,
    AppAuth,
    AppPlayer
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn']),
  },
  created() {
    // if (auth.currentUser) {
    //   this.userLoggedIn = true;
    // }
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userLoggedIn = true;
      }
    });
  }
}
</script>

<style>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s linear;
}
.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>