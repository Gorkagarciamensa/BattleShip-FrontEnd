<template>
  <v-app>
    <div class="bckImg">
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card ref="form">
            <v-card-text>
              <v-text-field
                label="Email"
                required
                placeholder="Email"
                v-model="email"
                :rules="emailRules"
              ></v-text-field>
              <v-text-field
                label="Name"
                placeholder="Name"
                required
                v-model="userName"
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
                  Already have an account?
                  <router-link :to="'/login'">Log in</router-link>
                </h5>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                @click="register"
                v-if="(this.userName != '') && (this.email != '') && (this.pwd != '')"
              >Register</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      userName: "",
      email: "",
      pwd: "",
      nameRules: [v => !!v || "Name is required"],
      passwordRules: [v => !!v || "Password is required"],
      emailRules: [v => !!v || "Email is required"]
    };
  },
  methods: {
    ...mapActions(["actRegister"]),
    register() {
      this.actRegister({
        userName: this.userName,
        email: this.email,
        password: this.pwd
      });
    }
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