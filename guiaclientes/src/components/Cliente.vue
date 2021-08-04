<template>
  <div :class="{'cliente': !isPremium, 'cliente-premium': isPremium}">
      <h4>{{ cliente.nome }}</h4>
    <hr />
    <p>{{ cliente.email | processEmail}}</p>
    <br>
    <p v-if="showAge">Idade: {{cliente.idade}}</p>
    <p v-else>Idade Escondida</p>
    <button @click="changeColor">Mudar cor</button>
    <button @click="emitDeleteEvent">Deletar</button>
    <h4>ID Especial: {{ idEspecial }}</h4>
  </div>
</template>

<script>
export default {
  data() {
    return {   
      isPremium: false
    }
  },
  props: {     
      cliente: Object,
      showAge: Boolean
  },
  methods: {
      changeColor: function(){
          this.isPremium = !this.isPremium
      },
      emitDeleteEvent: function(){
          this.$emit('deleteme', {idClient: this.cliente.id, component: this})
      } 
  },
  filters: {
      processEmail: function(value){
          return value.toUpperCase()
      }
  },
  computed: {
      idEspecial: function(){
          return (this.cliente.email + this.cliente.nome + this.cliente.id).toUpperCase()
      }
  }
}
</script>

<style scoped>
    .cliente{
        background-color: #ece5e3;
        max-width: 600px;
        padding: 4px;
        margin: 5px 5px;        
    }

    .cliente-premium{
        background-color: black;
        color: yellow;
        max-width: 600px;
        padding: 4px;
        margin: 5px 5px;        
    }
</style>