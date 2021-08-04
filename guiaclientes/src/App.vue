<template>
  <div id="app">

    <div class="buttons">
  <button class="button is-info">Info</button>
  <button class="button is-success">Success</button>
  <button class="button is-warning">Warning</button>
  <button class="button is-danger">Danger</button>
</div>

    <h3>Cadastro:</h3>
    <small id="nomeErro" v-show="deuErro">Nome inválido</small><br />
    <input type="text" placeholder="nome" v-model="nomeField" /><br />
    <input type="text" placeholder="email" v-model="emailField" /><br />
    <input type="number" placeholder="idade" v-model="idadeField" /><br />
    <button @click="addClients">Cadastrar</button>
    <hr />

    <div v-for="(cliente, index) in orderClients" :key="cliente.id">
      <h2>{{ index + 1 }}</h2>
      <Cliente :cliente="cliente" @deleteme="deleteClient($event)" />
      <hr />
    </div>
    <!-- <hr>
    <Produto/> -->
  </div>
</template>

<script>
import Cliente from "./components/Cliente.vue";
//import Produto from './components/Produto.vue'
import _ from "lodash";

export default {
  name: "App",
  data() {
    return {
      deuErro: false,
      nomeField: "",
      emailField: "",
      idadeField: 0,
      clientes: [
        {
          id: 3,
          nome: "Carlos",
          idade: 13,
          email: "c@c.com",
        },
        {
          id: 1,
          nome: "Teste",
          idade: 21,
          email: "fsdafdsa@fdafa.com",
        },
        {
          id: 2,
          nome: "Amanda",
          idade: 43,
          email: "f@f.com",
        },
      ],
    };
  },
  components: {
    Cliente,
    //Produto
  },
  methods: {
    addClients: function () {
      if (
        this.nomeField == "" ||
        this.nomeField == " " ||
        this.nomeField.length < 3
      ) {
        this.deuErro = true;
      } else {
        this.clientes.push({
          nome: this.nomeField,
          email: this.emailField,
          idade: this.idadeField,
          id: Date.now(),
        });
        this.nomeField = "";
        this.emailField = "";
        this.idadeField = 0;
        this.deuErro = false;
      }
    },
    deleteClient: function ($event) {
      const id = $event.idClient;

      const newArray = this.clientes.filter((cliente) => cliente.id != id);
      this.clientes = newArray;
    },
  },
  computed: {
    orderClients: function () {
      return _.orderBy(this.clientes, ["nome"], ["asc"]);
    },
  },
};
</script>

<style>
#nomeErro {
  color: red;
}
</style>
