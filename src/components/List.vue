<template>
  <div>
    <div v-if="getGames" class="bckImg">
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
      <v-container>
        <div class="scrollBox">
          <v-tabs color="rgba(34, 49, 63, 1)">
            <v-tab class="width">Game table</v-tab>
            <v-tab class="width">Scoreboard</v-tab>
            <v-tab-item dark>
              <v-simple-table fixed-header class="opacity" height="621.5px">
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
                          <v-btn>Enter</v-btn>
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
            </v-tab-item>
            <v-tab-item>
              <Ladderboard></Ladderboard>
            </v-tab-item>
          </v-tabs>
        </div>
      </v-container>
    </div>
    <div v-else class="bckImgLoad changeColor">
      <v-progress-circular :size="100" color="white" :width="7" indeterminate></v-progress-circular>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Ladderboard from "../views/Ladderboard";

export default {
  components: {
    Ladderboard
  },
  data() {
    return {};
  },
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
    }
  },
  watch: {},
  computed: {
    ...mapGetters(["getGames"])
  },
  created() {
    this.actGames();
    setInterval(() => {
      this.actGames();
    }, 15000);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap");
.height100 {
  height: 100%;
}
a {
  text-decoration: none;
}
.bckImgLoad {
  background-image: url("https://s2.best-wallpaper.net/wallpaper/3840x2160/1703/Sea-wave-foam_3840x2160.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  height: 100%;
  display: flex;
  justify-content: center;
  padding-top: 300px;
}
.changeColor {
  color: white;
  animation: changecolor 2s ease infinite;
}
@keyframes changecolor {
  0% {
    color: white;
  }
  25% {
    color: rgb(125, 125, 243);
  }
  50% {
    color: rgb(65, 78, 87);
  }
  100% {
    color: black;
  }
}
/* .bckImg {
  background-image: url("https://s2.best-wallpaper.net/wallpaper/3840x2160/1703/Sea-wave-foam_3840x2160.jpg");
  background-size: cover;
  background-repeat: no-repeat;
} */

.opacity {
  opacity: 0.9;
}
.opacity:hover {
  opacity: 1;
}
.width {
  max-width: 100% !important;
  width: 50%;
}
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
p,
tr {
  text-align: center;
}

.heightClass {
  height: 56px;
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
</style>
