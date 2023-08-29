<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
          :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
          @drag.prevent.stop=""
          @dragstart.prevent.stop=""
          @dragend.prevent.stop="is_dragover = false"
          @dragover.prevent.stop="is_dragover = true"
          @dragenter.prevent.stop="is_dragover = true"
          @dragleave.prevent.stop="is_dragover = false"
          @drop.prevent.stop="upload($event)"
        >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)">
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.textClass">
          <i :class="upload.icon"></i>
          {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.currentProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  storage, 
  ref, 
  uploadBytesResumable, 
  auth,
  getDownloadURL,
  doc,
  setDoc,
  db,
  collection,
  getDoc,
}  from '@/includes/firebase.js';

export default {
  name: 'TheUpload',
  data() {
    return {
      is_dragover: false,
      uploads: [],
    }
  },
  props: {
    addSong: {
      type: Function,
      required: true,
    }
  },
  methods: {
    upload($event) {
      this.is_dragover = false;
      console.log($event);

      const files = $event.dataTransfer 
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];
      files.forEach((file) => {
        console.log('forEach',file);
        if (file.type !== 'audio/mpeg') {
          return;
        }
        console.log('upload',file);
        const storageRef = ref(storage); //"vue-music-3af38.appspot.com"
        const songsRef = ref(storageRef, `songs/${file.name}`); //"vue-music-3af38.appspot.com/songs/example.mp3"
        const uploadTask = uploadBytesResumable(songsRef, file);

        const uploadIndex = this.uploads.push({
          task: uploadTask,
          currentProgress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          textClass: '',
        }) - 1;

        // console.log('uploadTask', uploadTask);
        uploadTask.on('state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].currentProgress = progress;
            // console.log('Upload is ' + progress + '% done');
            // switch (snapshot.state) {
            //   case 'paused':
            //     console.log('Upload is paused');
            //     break;
            //   case 'running':
            //     console.log('Upload is running');
            //     break;
            // }
          }, 
          (error) => {
            this.uploads[uploadIndex].variant = 'bg-red-400';
            this.uploads[uploadIndex].icon = 'fas fa-times';
            this.uploads[uploadIndex].textClass = 'text-red-400';
            console.log('uploadTask error: ', error);
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            // switch (error.code) {
            //   case 'storage/unauthorized':
            //     // User doesn't have permission to access the object
            //     break;
            //   case 'storage/canceled':
            //     // User canceled the upload
            //     break;

            //   // ...

            //   case 'storage/unknown':
            //     // Unknown error occurred, inspect error.serverResponse
            //     break;
            // }
          }, 
          async () => {
            console.log('auth', auth);
            const song = {
              uid: auth.currentUser.uid,
              displayName: auth.currentUser.displayName,
              originalName: uploadTask.snapshot.ref.name,
              modifiedName: uploadTask.snapshot.ref.name,
              genre: '',
              commentCount: 0,
            };

            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              song.url = downloadURL;
            });

            const newSongsRef = doc(collection(db, "songs"));
            await setDoc(newSongsRef, song);
            const docSnap = await getDoc(newSongsRef);
            // console.log('docSnap', docSnap, docSnap.data());
            this.addSong(docSnap);

            this.uploads[uploadIndex].variant = 'bg-green-400';
            this.uploads[uploadIndex].icon = 'fas fa-check';
            this.uploads[uploadIndex].textClass = 'text-green-400';
            // Upload completed successfully, now we can get the download URL
            // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //   console.log('File available at', downloadURL);
            // });
          }
        );
      }); 
    },
    cancelUploads() {
      this.uploads.forEach((upload) => {
        upload.task.cancel();
      });
    },
  },
  beforeUnmount() {
    this.cancelUploads();
  },
}
</script>