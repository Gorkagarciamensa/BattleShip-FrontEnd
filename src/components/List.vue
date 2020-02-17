<template>
  <div>
    <div v-if="getGames">
      <header class="heightClass">
        <div class="heightClass">
          <div class="heightClass">
            <v-bottom-navigation grow>
              <div v-if="getGames.player != null" class="flexClass">
                <v-btn @click="logout" height="100%">
                  <span>Logout</span>
                  <v-icon>mdi-history</v-icon>
                </v-btn>

                <h4 class="flexColumn">Welcome, {{ getGames.player.username }}!</h4>

                <v-btn v-on:click="gameCreate" height="100%">
                  <p>Create Game</p>
                  <v-icon>fas fa-plus-circle</v-icon>
                </v-btn>
              </div>
              <v-bottom-navigation v-else>
                <div class="aWidth">
                  <router-link :to="'/Login'">
                    <v-btn height="100%">
                      <p>Login</p>
                      <v-icon>fas fa-ship</v-icon>
                    </v-btn>
                  </router-link>

                  <router-link :to="'/Register'">
                    <v-btn height="100%">
                      <p>Register</p>
                      <v-icon>fas fa-anchor</v-icon>
                    </v-btn>
                  </router-link>
                </div>
              </v-bottom-navigation>
            </v-bottom-navigation>
          </div>
        </div>
      </header>

      <v-simple-table fixed-header class="marginTable">
        <thead>
          <tr>
            <th>Game</th>
            <th>Date of creation</th>
            <th colspan="2">Match</th>
            <th v-if="getGames.player != null">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(game, i) in getGames.games" :key="i">
            <td>
              <p>{{ i + 1 }}</p>
            </td>
            <td>
              <p>{{ game.date }}</p>
            </td>

            <td v-for="(gameplayer, i) in game.gameplayers" :key="i">
              <h5>{{ gameplayer.player.username }}</h5>
            </td>

            <td v-if="game.gameplayers.length == 1">
              <h5>Waiting for opponent</h5>
            </td>
            <td v-if="getGames.player != null">
              <h5 v-for="(gameplayer, i) in game.gameplayers" :key="i">
                <router-link
                  v-if="gameplayer.player.id == getGames.player.id"
                  :to="`/Game/${gameplayer.id}`"
                >
                  <v-btn @click="reloadPage">Enter</v-btn>
                </router-link>
                <h5
                  v-else-if="
                    game.gameplayers.length == 1 &&
                      gameplayer.player.id !== getGames.player.id
                  "
                  class="join"
                >
                  <v-btn @click="gameJoin(game.id)">Join</v-btn>
                </h5>
              </h5>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["actGames", "actCreate", "actJoin", "actLogout"]),
    gameCreate() {
      this.actCreate();
    },
    gameJoin(id) {
      this.actJoin(id);
    },
    logout() {
      this.actLogout();
      location.reload();
    },
    reloadPage() {
      setTimeout(() => {
        location.reload();
      }, 150);
    }
  },
  watch: {},
  computed: {
    ...mapGetters(["getGames"])
  },
  created() {
    this.actGames();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
td,
th {
  border: 1px solid #dddddd;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
.flex-list {
  display: flex;
  justify-content: space-evenly;
}
.join {
  text-align: center;
}
h5,
p {
  text-align: center;
}

.heightClass {
  height: 100px;
}
.flexClass {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}
.flexColumn {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.aWidth {
  width: inherit;
  display: flex;
  justify-content: space-evenly;
}
.marginTable {
  margin: 0px 130px;
}
</style>
