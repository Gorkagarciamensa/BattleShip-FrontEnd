<template>
  <div>
    Login Page
    <form id="login-form" onsubmit="return false">
      <input type="text" value="username" v-model="name" />

      <input type="text" value="password" v-model="pwd" />

      <button @click="loginIn">Login</button>
    </form>
    <form id="logout-form" onsubmit="return false" v-if="this.logOut">
      <button @click="logOut">Logout</button>
    </form>
    <router-link :to="'/#'">
      <button>Back to main page</button>
    </router-link>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      name: "",
      pwd: ""
    };
  },
  methods: {
    ...mapActions(["actLogin", "actLogout"]),
    loginIn() {
      this.actLogin({
        userName: this.name,
        password: this.pwd
      });

      //   return this.$store.dispatch("actLogin", {
      //     name: this.name,
      //     pwd: this.pwd
      //   });
    },
    logOut() {
      this.actLogout();
      (this.name = ""), (this.pwd = "");
    }
  },
  created() {}
};
</script>

<style></style>
