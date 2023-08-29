<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <TheUpload ref="upload" :addSong="addSong"/>
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <CompositionItem v-for="(song, idx) in songs" :key="song.docId"
              :song="song"
              :updateSong="updateSong"
              :index="idx"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import TheUpload from '@/components/TheUpload.vue';
import CompositionItem from '@/components/CompositionItem.vue';
import {
  collection,
  auth,
  query,
  where,
  getDocs,
  db,
} from '@/includes/firebase.js';

export default {
  name: 'ManageView',
  components: {
    TheUpload,
    CompositionItem,
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    }
  },
  methods: {
    updateSong(idx, values) {
      this.songs[idx].modifiedName = values.modifiedName;
      this.songs[idx].genre = values.genre;
    },
    removeSong(idx) {
      this.songs.splice(idx, 1);
    },
    addSong(doc) {
      const song = {
        ...doc.data(),
        docID: doc.id,
      };
      this.songs.push(song);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  async created() {
    const queryCollection = query(
      collection(db, "songs"), 
      where('uid', '==', auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(queryCollection);
    querySnapshot.forEach(this.addSong);
  },
  // beforeRouteLeave (to, from, next) {
  //    this.$refs.upload.cancelUploads();
  //    next();
  // },
  beforeRouteLeave (to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
      next(leave);
    }
  }
}
</script>