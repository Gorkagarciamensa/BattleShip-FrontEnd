<template>
  <div class="height">
    <div v-if="getGameView" class="height">
      <Grid :gpId="id"></Grid>
    </div>
    <div v-else class="bckImgLoad changeColor">
      <v-progress-circular :size="100" color="white" :width="7" indeterminate></v-progress-circular>
    </div>
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
      // let stateLogic = this.getGameView.State.Logic;
      // console.log(stateLogic);
      // if (
      //   stateLogic == "VICTORY" ||
      //   stateLogic == "DEFEAT" ||
      //   stateLogic == "DRAW"
      // ) {
      //   clearInterval(this.fetching);
      //   this.finished = true;
      // }
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
    // this.fetching = setInterval(() => {
    //   this.actGameView(this.id);
    // }, 5000);
  }
  // beforeDestroy() {
  //   clearInterval(this.fetching);
  // }
};
</script>

<style scoped>
.height {
  height: inherit;
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
</style>
