<template>
  <v-container fluid>
      <v-form>
          <v-file-input 
          label="Selecione as legendas" 
          multiple 
          chips 
          v-model="files"
          prepend-icon="mdi-message-text"
          outlined
          append-outer-icon="mdi-send"
          @click:append-outer="processSubtitles"/>             
      </v-form>
      <div class="pills">          
          <Pill v-for="word in groupedWords" :key="word.name"
           :name="word.name" :amount="word.amount"/>
      </div>
  </v-container>
</template>

<script>

import Pill from './Pill.vue'
import {ipcRenderer} from 'electron'

export default {
    components: {Pill},
    data: function () {
        return {
            files: [],
            groupedWords: []
        }
    },
    methods: {
        processSubtitles(){
            const paths = this.files.map(f => f.path)
            ipcRenderer.send('process-subtitles', paths)
            ipcRenderer.on('process-subtitles', (event, resp) => {
                this.groupedWords = resp
            })
        }
    }
}
</script>
    
<style>
.pills {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
</style>