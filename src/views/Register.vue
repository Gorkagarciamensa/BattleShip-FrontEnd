<template>
  <div>
    <div>Register</div>
    <form action onsubmit="return false">
      <label for="email">
        Email
        <input type="text" v-model="email" />
      </label>
      <label for="username">
        Username
        <input type="text" v-model="userName" />
      </label>
      <label for="password">
        Password
        <input type="text" v-model="password" />
      </label>
      <button @click="register">Register</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      userName: "",
      email: "",
      password: ""
    };
  },
  methods: {
    ...mapActions(["actRegister"]),
    register() {
      this.actRegister({
        userName: this.userName,
        email: this.email,
        password: this.password
      });
    }
  }
};
</script>

<style>
</style>