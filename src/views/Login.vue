<template>
  <div v-if="getGames">
    <v-app>
      <div class="bckImg">
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <v-card ref="form">
              <v-card-text>
                <v-text-field
                  label="Name"
                  placeholder="Name"
                  required
                  v-model="name"
                  :rules="nameRules"
                ></v-text-field>
                <v-text-field
                  label="Password"
                  required
                  placeholder="Password"
                  v-model="pwd"
                  :rules="passwordRules"
                  type="password"
                ></v-text-field>
              </v-card-text>
              <v-divider class="mt-12"></v-divider>
              <v-card-actions>
                <router-link :to="'/'">
                  <v-icon>fas fa-arrow-alt-circle-left</v-icon>
                </router-link>
                <v-spacer></v-spacer>
                <div>
                  <h5>
                    Don't have an account?
                    <router-link :to="'/Register'">Register</router-link>
                  </h5>
                </div>
                <v-spacer></v-spacer>

                <v-btn @click="loginIn" v-if="getGames.player == null">Login</v-btn>
                <v-btn @click="logOut" v-else>Logout</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-app>
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
      passwordRules: [v => !!v || "Password is required"],
      dialogCantLogin: false
    };
  },
  watch: {
    dialogDrop(val) {
      if (!val) return;

      setTimeout(() => (this.dialogCantLogin = false), 2000);
    }
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
    ...mapGetters(["getGames", "getErrorMsg"])
  },

  created() {
    this.actGames();
  }
};
</script>

<style scoped>
.bckImg {
  background-image: url("https://i.pinimg.com/originals/81/8f/d8/818fd868de4ce53e00376c796f6aa8dd.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  height: 100%;
}
.row {
  justify-content: center;
  padding-top: 15%;
}
a {
  text-decoration: none;
  padding-left: 20px;
  color: #6767e6;
}
a:hover {
  color: #33ec43;
}
</style>
