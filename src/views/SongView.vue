<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="newSong(song)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8" v-if="song">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(1, 'currency') }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title" v-if="song">
            {{ $tc("songView.commentCount", song.commentCount, { 
                count: song.commentCount 
              }) 
            }}
          </span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div class="test-white text-center font-bold p-4 mb-4" v-if="comment_show_alert"
            :class="comment_alert_variant"
            >
            {{ comment_alert_message }}
          </div>
          <vee-form :validation-schema="schema" v-if="userLoggedIn"
            @submit="addComment"
            >
            <vee-field as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment"/>
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li class="p-6 bg-gray-50 border border-gray-200" 
        v-for="comment in sortedComments"
        :key="comment.docId"
        >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>
        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import {
  db,
  doc,
  getDoc,
  auth,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from '@/includes/firebase.js';
import { mapState, mapActions } from 'pinia';
import useUserStore from '@/stores/user';
import usePlayerStore from '@/stores/player';

export default {
  name: 'SongView',
  data() {
    return {
      song: null,
      schema: {
        comment: 'required|min:3',
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait...',
      comments: [],
      sort: '1',
    };
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }

        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  methods: {
    ...mapActions(usePlayerStore, [
      'newSong'
    ]),
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = 'bg-blue-500';
      this.comment_alert_message = 'Please wait...';

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      }

      await addDoc(collection(db, "comments"), comment);

      this.song.commentCount += 1;
      const updateRef = doc(db, "songs", this.$route.params.id);
      await updateDoc(updateRef, {
        commentCount: this.song.commentCount
      });
      this.getComments();

      this.comment_in_submission = false;
      // this.comment_show_alert = false;
      this.comment_alert_variant = 'bg-green-500';
      this.comment_alert_message = 'Success...';

      resetForm();
    },
    async getComments() {
      const queryCollection = query(
        collection(db, "comments"), 
        where('sid', '==', this.$route.params.id)
      );
      const querySnapshot = await getDocs(queryCollection);

      this.comments = [];

      querySnapshot.forEach((doc) => {
        this.comments.push({
          docId: doc.id,
          ...doc.data(),
        });
      });
    },
  },
  watch: {
    sort (newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({
        query: {
          sort: newVal,
        }
      });
    }
  },
  async created() {
    const docRef = doc(db, "songs", this.$route.params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      this.$router.push({ name: 'home' });
      return;
    }

    const { sort } = this.$route.query;

    this.sort = sort === '1' || sort === '2' ? sort : '1';

    this.song = docSnap.data();
    this.getComments();
  },
}
</script>
