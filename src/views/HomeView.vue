
<template>
  <main>
      <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            et dolor mollis, congue augue non, venenatis elit. Nunc justo eros,
            suscipit ac aliquet imperdiet, venenatis et sapien. Duis sed magna
            pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full" src="/assets/img/introduction-music.png" />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" 
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
          >
          <!-- v-icon.right.yellow="'headphones-alt'" -->
          <span class="card-title">Songs</span>
          <!-- Icon -->
          <!-- <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i> -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <SongItem v-for="song in songs" :key="song.docId"
            :song="song"
          />
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import {
  db,
  collection,
  getDocs,
  limit,
  query,
  startAfter,
  orderBy,
} from '@/includes/firebase.js';
import SongItem from '@/components/SongItem.vue';
import IconSecondary from '@/directives/icon-secondary';

export default {
  name: 'HomeView',
  components: {
    SongItem
  },
  directives: {
    'icon-secondary': IconSecondary,
  },
  data() {
    return {
      songs: [],
      maxPerPage: 10,
      pendingRequest: false,
      lastVisible: null,
    }
  },
  methods: {
    async getSongs() {
      if (this.pendingRequest) {
        return;
      }
      this.pendingRequest = true;
      let querySnapshot;

      if (this.songs.length) {
        const queryCollection = query(collection(db, "songs"),
          orderBy("modifiedName"),
          startAfter(this.lastVisible),
          limit(this.maxPerPage));
        querySnapshot = await getDocs(queryCollection);
        this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      } else {
        const queryCollection = query(
          collection(db, "songs"), 
          orderBy('modifiedName'),
          limit(this.maxPerPage)
        );
        querySnapshot = await getDocs(queryCollection);
        this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      }
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        this.songs.push({
          docId: doc.id,
          ...doc.data(),
        });
      });
      this.pendingRequest = false;
    },
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow = Math.round(scrollTop) + innerHeight >= offsetHeight;

      if (bottomOfWindow) {
        // console.log('bottomOfWindow');
        this.getSongs();
      }
    },
  },
  async created() {
    await this.getSongs();

    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>