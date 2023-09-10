<template>
  <li class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <RouterLink  class="font-bold block text-gray-600"
        :to="{ name: 'song', params: { id: song.docId } }"
        >
        {{ song.modifiedName }}
      </RouterLink>
      <span class="text-gray-500 text-sm">
        {{ song.displayName }}
      </span>
    </div>

    <div class="text-gray-600 text-lg">
      <RouterLink custom 
        :to="{ name: 'song', params: { id: song.docId }, hash: '#comments' }"
        v-slot="{ navigate }"
        >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.commentCount }}
        </span>
      </RouterLink>
    </div>
  </li>
</template>

<script>
export default {
  name: 'SongItem',
  props: {
    song: {
      type: Object,
    }
  }
}
</script>