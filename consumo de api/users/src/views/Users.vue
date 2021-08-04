<template>
  <div>
    <h1>Painel Administrativo</h1>

    <table class="table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Cargo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role | processRole }}</td>
          <td>
            <router-link :to='{name: "UserEdit", params: {id: user.id}}'>
              <button class="button is-success" style="margin-right: 5px">
                Editar
              </button>
            </router-link>
            <button class="button is-danger" @click="showModalDelete(user.id)">Deletar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div  :class="{modal: true, 'is-active': showModal }">
      <div class="modal-background"></div>
      <div class="modal-content">
        
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">Você quer realmente deletar esse usuário?</p>
            <button class="card-header-icon" aria-label="more options">
              <span class="icon">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </header>
         
          <footer class="card-footer">
            <a href="#" class="card-footer-item" @click="hideModal">Cancelar</a>
            <a href="#" class="card-footer-item" @click="deleteUser">Sim, quero deletar</a>            
          </footer>
        </div>

      </div>
      <button class="modal-close is-large" aria-label="close" @click="hideModal"></button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  created() {
    const req = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    axios
      .get("http://localhost:8686/user", req)
      .then((res) => {
        this.users = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  data() {
    return {
      users: [],
      showModal: false,
      deleteUserId: -1
    };
  },
  methods: {
    hideModal(){
      this.showModal = false
    },
    showModalDelete(id){
      this.deleteUserId = id
      this.showModal = true
    },
    deleteUser(){
      const req = {
      headers: {
         Authorization: "Bearer " + localStorage.getItem("token"),
       },
      }
      axios.delete('http://localhost:8686/user/'+ this.deleteUserId, req )
        .then(res => {
          console.log(res)
          this.showModal = false
          this.users = this.users.filter(u => u.id != this.deleteUserId)
        })
        .catch(err => {
          console.log(err)
          this.showModal = false
        })
    }
  },
  filters: {
    processRole: function (value) {
      if (value == 0) {
        return "Usuário comum";
      } else if (value == 1) {
        return "Administrador";
      }
    },
  },
};
</script>

<style scoped>
</style>