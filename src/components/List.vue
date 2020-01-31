<template>
  <div v-if="getGames">
    <div v-if="getGames.player != null">
      <div>Username: {{getGames.player.username}}</div>
    </div>
    <button v-on:click="gameCreate">Create Game</button>
    <router-link :to="'/Login'">
      <button>Login</button>
    </router-link>
    <div v-for="(game, i) in getGames.games" :key="i" class="flex-list">
      <div>
        <div>Game: {{game.id}}</div>
        <div>
          <div>Date:{{game.date}}</div>
        </div>
        <div v-for="(gameplayer, i) in game.gameplayers" :key="i">
          <div>{{gameplayer.player.username}}</div>
          <div v-if="getGames.player != null">
            <router-link
              v-if="gameplayer.player.id == getGames.player.id"
              :to="`/Game/${gameplayer.id}`"
            >
              <button>Enter</button>
            </router-link>
            <div
              v-else-if="game.gameplayers.length == 1  && gameplayer.player.id !== getGames.player.id"
            >
              <button v-on:click="gameJoin(game.id)">Join</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["actGames", "actCreate", "actJoin"]),
    gameCreate() {
      this.actCreate();
      window.location.reload();
    },
    gameJoin(id) {
      this.actJoin(id);
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
.table1 {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
.flex-list {
  display: flex;
  justify-content: space-evenly;
}
</style>
