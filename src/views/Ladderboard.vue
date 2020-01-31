<template>
  <div>
    <table>
      <tr>
        <th>Player</th>
        <th>Win</th>
        <th>Loses</th>
        <th>Tie</th>
        <th>Total Score</th>
      </tr>
      <tr v-for="(player, i) in getLadderboard" :key="i">
        <td id="playerBoard">{{player.name}}</td>
        <td>{{player.win}}</td>
        <td>{{player.lose}}</td>
        <td>{{player.tie}}</td>
        <td>{{player.points}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  watch: {},
  methods: {
    ...mapActions(["actLadderboard"])
  },
  computed: {
    ...mapGetters(["getBoard"]),
    getLadderboard() {
      let ladderboard = [];
      this.getBoard.forEach(player => {
        let playerScore = {
          name: player.Player.username,
          win: 0,
          lose: 0,
          tie: 0,
          points: 0
        };
        player.Score.forEach(score => {
          switch (score) {
            case 0.0:
              playerScore.lose += 1;
              break;
            case 0.5:
              playerScore.tie += 1;
              playerScore.points += score;
              break;
            case 1.0:
              playerScore.win += 1;
              playerScore.points += score;
              break;
            default:
              break;
          }
        });
        ladderboard.push(playerScore);
        console.log(ladderboard);
      });

      return ladderboard.sort((a, b) => {
        if (a.points < b.points) {
          return 1;
        } else if (a.points > b.points) {
          return -1;
        } else if (a.points == b.points) {
          return a.win + a.lose + a.tie < b.win + a.lose + b.tie;
        }
      });
    }
  },
  created() {
    this.actLadderboard();
  }
};
</script>

<style>
</style>