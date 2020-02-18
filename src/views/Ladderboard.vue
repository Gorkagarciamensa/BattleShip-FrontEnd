<template>
  <div>
    <v-simple-table fixed-header height="621.5px">
      <tr>
        <th>
          <p>Player</p>
        </th>
        <th>
          <p>Win</p>
        </th>
        <th>
          <p>Loses</p>
        </th>
        <th>
          <p>Tie</p>
        </th>
        <th>
          <p>Total Score</p>
        </th>
      </tr>
      <tr v-for="(player, i) in getLadderboard" :key="i">
        <td id="playerBoard">{{player.name}}</td>
        <td>{{player.win}}</td>
        <td>{{player.lose}}</td>
        <td>{{player.tie}}</td>
        <td>{{player.points}}</td>
      </tr>
    </v-simple-table>
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
    setInterval(() => {
      this.actLadderboard();
    }, 15000);
  }
};
</script>

<style scoped>
td,
th {
  border: 1px solid #dddddd;
  padding: 8px;
}

tr:nth-child(odd) {
  background-color: #dddddd;
}
td,
tr {
  text-align: center;
}
.marginTable {
  margin: 0px 130px;
}

.opacity {
  opacity: 0.9;
}
.opacity:hover {
  opacity: 1;
}
</style>