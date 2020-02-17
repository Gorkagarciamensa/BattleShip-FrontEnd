<template>
  <div class="height">
    <div v-if="getGameView" class="height">
      <Grid :gpId="id"></Grid>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import Grid from "../components/Grid";

import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    Grid
  },
  props: ["id"],
  data() {
    return {
      fetching: null
    };
  },
  methods: {
    ...mapActions(["actGameView"])
  },
  watch: {
    getGameView() {
      let stateLogic = this.getGameView.State.Logic;
      console.log(stateLogic);

      if (
        stateLogic == "VICTORY" ||
        stateLogic == "DEFEAT" ||
        stateLogic == "DRAW"
      ) {
        clearInterval(this.fetching);
      }

      // if (stateLogic == "wait for opponent player to join") {
      //   console.log("wait for opp");
      // } else {
      //   clearInterval(this.fetching);
      //   if (stateLogic == "place the ships") {
      //     this.fetching = setInterval(() => {
      //       this.actGameView(this.id);
      //     }, 3000);
      //   } else {
      //     if (stateLogic == "wait for opponent ships") {
      //       this.fetching = setInterval(() => {
      //         this.actGameView(this.id);
      //       }, 3000);
      //     } else {
      //       clearInterval(this.fetching);
      //       if (
      //         stateLogic == "you can now shoot" ||
      //         stateLogic == "wait for opponent to shoot"
      //       ) {
      //         this.fetching = setInterval(() => {
      //           this.actGameView(this.id);
      //         }, 3000);
      //       } else if (
      //         stateLogic == "VICTORY" ||
      //         stateLogic == "DEFEAT" ||
      //         stateLogic == "DRAW"
      //       ) {
      //         clearInterval(this.fetching);
      //       }
      //     }
      //   }
      // }
    }
  },
  computed: {
    ...mapGetters(["getGameView"])
  },
  created() {
    this.actGameView(this.id);
    this.fetching = setInterval(() => {
      this.actGameView(this.id);
    }, 5000);
  }
};
</script>

<style scoped>
.height {
  height: inherit;
}
</style>
