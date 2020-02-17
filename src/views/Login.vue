<template>
  <div>
    <v-app>
      <v-form v-model="valid">
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="Username"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="pwd"
                :rules="passwordRules"
                label="Password"
                required
                type="password"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn @click="loginIn" v-if="getGames.player == null"
                >Login</v-btn
              >
              <v-btn @click="logOut" v-else>Logout</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form> </v-app
    >Login Page
    <form
      id="login-form"
      onsubmit="return false"
      v-if="getGames.player == null"
    >
      <input type="text" value="username" v-model="name" />

      <input type="text" value="password" v-model="pwd" />

      <button @click="loginIn">Login</button>
    </form>
    <form id="logout-form" onsubmit="return false" v-else>
      <button @click="logOut">Logout</button>
    </form>
    <router-link :to="'/#'">
      <button>Back to main page</button>
    </router-link>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      valid: false,
      name: "",
      pwd: "",
      nameRules: [v => !!v || "Name is required"],
      passwordRules: [v => !!v || "Password is required"]
    };
  },
  methods: {
    ...mapActions(["actLogin", "actLogout", "actGames"]),
    loginIn() {
      this.actLogin({
        userName: this.name,
        password: this.pwd
      });
    },
    logOut() {
      this.actLogout();
      (this.name = ""), (this.pwd = "");
    }
  },
  computed: {
    ...mapGetters(["getGames"])
  },

  created() {}
};
</script>

<style></style>
