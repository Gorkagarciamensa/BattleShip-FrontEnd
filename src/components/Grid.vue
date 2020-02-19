<template>
  <v-app>
    <div v-if="getGameView && getGames" class="wholeHeight bckImg">
      <v-toolbar dense class="text-center">
        <v-btn icon>
          <router-link :to="'/'">
            <v-icon>fas fa-arrow-alt-circle-left</v-icon>
          </router-link>
        </v-btn>

        <v-toolbar-title>
          <div class="widthTitle">
            <h4 class="text-capitalize white--text">{{getGameView.State.Logic}}</h4>
          </div>
          <div class="widthTitle2">
            <h4>Turn: {{getGameView.mySalvo.length}}</h4>
          </div>
        </v-toolbar-title>
      </v-toolbar>

      <v-bottom-navigation height="27px" class="navBck">
        <div class="flexWidth">
          <div class="flexPad">
            <div class="youVsOpp">
              <div class="white--text">
                <h4>{{ getGames.player.username }} (You)</h4>
              </div>
              <div>
                <h4>VS</h4>
              </div>
              <div
                v-if="getGameView.Game.gameplayers.length > 1 && getGames.player.username != getGameView.Game.gameplayers[0].player.username"
              >
                <h4>{{ getGameView.Game.gameplayers[0].player.username }}</h4>
              </div>
              <div
                v-else-if="getGameView.Game.gameplayers.length > 1 && getGames.player.username != getGameView.Game.gameplayers[1].player.username"
              >
                <h4>{{ getGameView.Game.gameplayers[1].player.username }}</h4>
              </div>
              <div v-else>
                <h4>Waiting for opponent...</h4>
              </div>
            </div>
          </div>
        </div>
      </v-bottom-navigation>
      <v-dialog v-model="dialogDrop" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text class="text-center px-1">Can't drop outside of the grid</v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogTurn" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text class="text-center px-1">Can't turn here</v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogTurnOnShip" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text class="text-center px-1">Jesus, do you want to collapse?</v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogSalvo" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text class="text-center px-1">Can't shoot more than five times, greedy</v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogSalvoGrid" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text class="text-center px-1">Where are you aiming? You can't shoot there!</v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDrag" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text class="text-center px-1">Can't drag after you sent the ships</v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDropOnShip" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text class="text-center px-1">Are you crazy? Wanna collapse them ships?</v-card-text>
        </v-card>
      </v-dialog>
      <!------------------------------my grid---------------------------------------------------->

      <div class="gridFlex">
        <div class="flexJustify" v-if="getGameView.Ship.length == 0">
          <!--ships-->
          <div class="flexShips">
            <h3 v-if="shipTypes.length < 1" class="white--text">Drag your ships into the GRID!</h3>
            <div
              :class="shipOrientations['Carrier'] ? 'carrierImg' : 'verCarrierImg'"
              id="Carrier"
              :draggable="true"
              @dragstart="dragStart"
              @dragover.stop
              data-ship-length="5"
              data-ship-type="Carrier"
              class="visibility"
              @click="turnShip($event, 'Carrier')"
            ></div>
            <div
              :class="
          shipOrientations['Destroyer'] ? 'destroyerImg' : 'verDestroyerImg'
        "
              id="Destroyer"
              :draggable="true"
              @dragstart="dragStart"
              @dragover.stop
              data-ship-length="3"
              data-ship-type="Destroyer"
              class="visibility"
              @click="turnShip($event, 'Destroyer')"
            ></div>

            <div
              id="Submarine"
              :class="
          shipOrientations['Submarine'] ? 'submarineImg' : 'verSubmarineImg'
        "
              :draggable="true"
              @dragstart="dragStart"
              @dragover.stop
              data-ship-length="3"
              data-ship-type="Submarine"
              class="visibility"
              @click="turnShip($event, 'Submarine')"
            ></div>

            <div
              :class="
          shipOrientations['PatrolBoat'] ? 'patrolBoatImg' : 'verPatrolBoatImg'
        "
              :draggable="true"
              id="PatrolBoat"
              @dragstart="dragStart"
              @dragover.stop
              data-ship-length="2"
              data-ship-type="PatrolBoat"
              class="visibility"
              @click="turnShip($event, 'PatrolBoat')"
            ></div>

            <div
              :class="
          shipOrientations['Battleship'] ? 'battleshipImg' : 'verBattleshipImg'
        "
              id="Battleship"
              :draggable="true"
              @dragstart="dragStart"
              @dragover.stop
              data-ship-length="4"
              data-ship-type="Battleship"
              class="visibility"
              @click="turnShip($event, 'Battleship')"
            ></div>
          </div>
        </div>
        <div
          class="inline-block"
          :class="this.myLocations.length == 0 ? 'borderGridGlow': 'borderGrid' "
        >
          <div class="flex-grid">
            <div v-for="num in rows" :key="num" class="grid-colum">{{ num }}</div>
          </div>
          <div
            v-for="char in cols"
            :key="char"
            class="flex-grid"
            @dragover.prevent
            @drop.prevent="drop"
            :id="id"
          >
            <div v-for="(num, index) in rows" :key="char + num" class="grid-row" :id="char + num">
              <span v-if="index == 0">{{ char }}</span>
            </div>
          </div>
        </div>
        <div class="flexType opacitySunk">
          <div v-for="(type, i) in this.shipsToSend" :key="i" :id="type.type + 'sink'"></div>
        </div>
        <!-----------------------------enemy's grid------------------------------------------------>
        <div>
          <div class="flex-grid">
            <div v-for="num in rows" :key="num" class="grid-colum">{{ num }}</div>
          </div>
          <div v-for="character in cols" :key="character" class="flex-grid">
            <div
              v-for="(number, i) in rows"
              :key="i"
              class="grid-row"
              :id="character + number + 's'"
              @click="putSalvos(character + number)"
            >
              <span v-if="i == 0">{{character}}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="logicText"
        v-if="(getGameView.State.Logic == 'DEFEAT') || (getGameView.State.Logic == 'VICTORY') || (getGameView.State.Logic == 'DRAW') "
      >
        <div :class="getGameView.State.Logic">{{getGameView.State.Logic}}</div>
      </div>
      <div v-else>
        <div v-if="this.myLocations.length == 0" class="flexBtn">
          <button @click="sendShips">
            <p
              :class="shipTypes.length == 5 ? 'btnSend' : ''"
              v-if="shipTypes.length == 5"
            >Send Ships</p>
          </button>
        </div>
        <div v-else class="flexBtn">
          <button @click="sendSalvos">
            <p
              :class="salvosToSend.length == 5 ? 'btnSend' : 'btnSend1'"
              v-if="salvosToSend.length == 5"
            >Shot!</p>
          </button>
        </div>
      </div>
    </div>

    <div v-else></div>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  //submarine is 3
  //destroyer is 3
  //battleship is 4
  //patrol boat is 2
  //carrier is 5
  props: ["gpId", "id"],
  components: {},
  data() {
    return {
      fetching: null,
      dialogDropOnShip: false,
      dialogDrop: false,
      dialogTurn: false,
      dialogTurnOnShip: false,
      dialogSalvo: false,
      dialogSalvoGrid: false,
      dialogDrag: false,
      counter: 0,
      myLocations: [],
      opponentLoc: [],
      myShots: [],
      rows: ["", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], //makes the grid
      cols: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      salvosToSend: [],
      game: null,
      shipsToSend: [
        {
          type: "Destroyer",
          location: []
        },
        {
          type: "PatrolBoat",
          location: []
        },
        {
          type: "Submarine",
          location: []
        },
        {
          type: "Carrier",
          location: []
        },
        {
          type: "Battleship",
          location: []
        }
      ], //receives the loc and sends the ships to the backend

      shipOrientations: {
        Carrier: true,
        Destroyer: true,
        PatrolBoat: true,
        Submarine: true,
        Battleship: true
      }, //determines horizontal (true) or vertical (false)
      shipTypes: [] //this stores the ship types, only for css reasons
    };
  },
  watch: {
    dialogDrop(val) {
      if (!val) return;

      setTimeout(() => (this.dialogDrop = false), 1000);
    },
    dialogTurn(val) {
      if (!val) return;
      setTimeout(() => (this.dialogTurn = false), 1000);
    },
    dialogTurnOnShip(val) {
      if (!val) return;
      setTimeout(() => (this.dialogTurnOnShip = false), 1000);
    },
    dialogSalvo(val) {
      if (!val) return;
      setTimeout(() => (this.dialogSalvo = false), 1000);
    },
    dialogSalvoGrid(val) {
      if (!val) return;
      setTimeout(() => (this.dialogSalvoGrid = false), 1500);
    },
    dialogDrag(val) {
      if (!val) return;

      setTimeout(() => (this.dialogDrag = false), 2000);
    },
    dialogDropOnShip(val) {
      if (!val) return;

      setTimeout(() => (this.dialogDropOnShip = false), 2000);
    },

    getGameView() {
      let stateLogic = this.getGameView.State.Logic;

      if (
        stateLogic == "VICTORY" ||
        stateLogic == "DEFEAT" ||
        stateLogic == "DRAW"
      ) {
        clearInterval(this.fetching);
        this.finished = true;
      }

      setTimeout(() => {
        //my ships locations
        this.myLocations = [];

        for (let i = 0; i < this.getGameView.Ship.length; i++) {
          let shipLocation = this.getGameView.Ship[i].Locations;
          let shipType = this.getGameView.Ship[i].Type;

          for (let j = 0; j < shipLocation.length; j++) {
            document
              .getElementById(shipLocation[j]) //this location is equal to the num+char id
              .classList.add(shipType.replace(/\s/g, ""));
            this.myLocations.push(shipLocation[j]);
          }
        }

        //my shots && hits done

        for (let i = 0; i < this.getGameView.mySalvo.length; i++) {
          let mySalvo = this.getGameView.mySalvo[i].Location;

          for (let j = 0; j < mySalvo.length; j++) {
            document.getElementById(mySalvo[j] + "s").classList.add("myShots");
          }

          for (let j = 0; j < this.getGameView.hits.length; j++) {
            let counter = 1 + j;

            let hits = this.getGameView.hits[j][counter];

            hits.forEach(hit => {
              document.getElementById(hit + "s").classList.add("hits");

              //for each hit done, add that class
            });
          }
        }
        //opponent shots
        if (this.getGameView.oppSalvo != null) {
          for (let k = 0; k < this.getGameView.oppSalvo.length; k++) {
            let oppSalvo = this.getGameView.oppSalvo[k].Location;

            for (let j = 0; j < oppSalvo.length; j++) {
              document.getElementById(oppSalvo[j]).classList.add("oppShots");
              this.opponentLoc.push(oppSalvo[j]);
            }
          }

          //hits by opponent
          for (let i = 0; i < this.myLocations.length; i++) {
            for (let j = 0; j < this.opponentLoc.length; j++) {
              if (this.myLocations[i] == this.opponentLoc[j]) {
                document
                  .getElementById(this.opponentLoc[j])
                  .classList.add("hits");
              }
            }
          }

          //cross out ship name if the ship is sunk

          for (let i = 0; i < this.getGameView.sunkShips.sunk.length; i++) {
            let sunk = this.getGameView.sunkShips.sunk[i].replace(/\s/g, "");

            let keys = Object.keys(this.shipOrientations);
            for (let j = 0; j < keys.length; j++) {
              let ships = keys[j];

              if (sunk == ships) {
                document
                  .getElementById(sunk + "sink")
                  .classList.add(sunk + "Broken");
              }
            }
          }
        }
      }, 0);
    }
  },
  methods: {
    ...mapActions(["actShips", "actSalvos", "actGames", "actGameView"]),
    sendShips() {
      this.$store.dispatch("actShips", {
        gpId: this.gpId,
        ships: this.shipsToSend
      });
      this.shipTypes = [];
    },

    sendSalvos() {
      this.$store.dispatch("actSalvos", {
        gpId: this.gpId,
        salvos: this.salvosToSend
      });
      this.salvosToSend.forEach(salvo => {
        document.getElementById(salvo + "s").classList.remove("shotsDone");
      });
      this.salvosToSend = [];
    },

    //drag and drop
    dragStart(e) {
      if (this.myLocations.length == 0) {
        let target = e.target;
        document.getElementById(target.id).classList.remove("visibility");

        e.dataTransfer.setData("ship_id", target.id);
        this.counter = 0;
      } else {
        this.dialogDrag = true;
      }
    },
    drop(e) {
      let grid = e.target;
      let shipId = e.dataTransfer.getData("ship_id"); //Carrier, Destroyer...
      let ship = document.getElementById(shipId);
      document.getElementById(shipId).classList.add("visibility");
      let prevLoc = [];
      this.shipsToSend.forEach(shipSend => {
        if (shipSend.type == shipId) {
          prevLoc = shipSend.location;
          shipSend.location = [];
        }
      });

      if (this.checkFree(shipId, grid)) {
        this.shipConditions(shipId, grid);
      } else {
        this.shipsToSend.find(
          shipSend => shipSend.type == shipId
        ).location = prevLoc;
        this.dialogDropOnShip = true;
      }
    },
    turnShip(event, name) {
      //turning ship
      this.counter = 1;
      let grid = event.target.offsetParent;

      let gridId = event.target.offsetParent.id; //A5
      let shipId = event.target.id; //CARRIER
      let ship = document.getElementById(shipId);
      let shipLen = ship.dataset.shipLength;

      let num = Number(gridId.substring(1));
      let char = gridId.substring(0, 1);

      if (
        (Number(shipLen) + num < 12 && !this.shipOrientations[name]) ||
        (Number(shipLen) + char.charCodeAt(0) < 76 &&
          this.shipOrientations[name])
      ) {
        this.shipOrientations[name] = !this.shipOrientations[name];
        if (this.checkFree(shipId, grid)) {
          this.shipConditions(shipId, grid);
        } else {
          this.shipOrientations[name] = !this.shipOrientations[name];
          this.dialogTurnOnShip = true;
        }
      } else {
        this.dialogTurn = true;
      }
    },
    shipLocation(shipId, grid) {
      //location of the ships

      let ship = document.getElementById(shipId);

      let char = grid.id.substring(0, 1); //this is A from A10
      let num = Number(grid.id.substring(1)); //this is 10 from A10
      let newShipLoc = [];

      if (this.shipOrientations[ship.dataset.shipType]) {
        //horizontal
        for (let i = 0; i < ship.dataset.shipLength; i++) {
          newShipLoc.push(char + (num + i));
        }
      } else {
        //vertical
        for (let i = 0; i < ship.dataset.shipLength; i++) {
          newShipLoc.push(String.fromCharCode(char.charCodeAt(0) + i) + num);
        }
      }
      if (!this.shipTypes.includes(shipId)) {
        this.shipTypes.push(ship.dataset.shipType);
      }

      this.shipsToSend.forEach(sendShip => {
        if (sendShip.type == ship.dataset.shipType) {
          sendShip.location = newShipLoc;
        }
      });
    },
    shipConditions(shipId, grid) {
      //conditions (can't go out of grid)

      let ship = document.getElementById(shipId);
      let shipLen = ship.dataset.shipLength;
      let shipType = ship.dataset.shipType;
      let char = grid.id.substring(0, 1); //this is A from A10
      let num = Number(grid.id.substring(1)); //this is 10 from A10

      if (
        Number(shipLen) + num < 12 &&
        num != 0 &&
        this.shipOrientations[shipType]
      ) {
        ship.style.position = "absolute";
        ship.style.display = "block";
        grid.appendChild(ship);
        this.shipLocation(shipId, grid);
      } else if (
        Number(shipLen) + char.charCodeAt(0) < 76 && //
        num != 0 && //number is diff than 0 (this is for the lone letter in the grid, a.k.a A, B...)
        !this.shipOrientations[shipType] //vertical
      ) {
        ship.style.position = "absolute";
        ship.style.display = "block";
        grid.appendChild(ship);
        this.shipLocation(shipId, grid);
      } else {
        this.dialogDrop = true;
      }
    },
    checkFree(shipId, grid) {
      //check if there's another ship already positioned
      let ship = document.getElementById(shipId);
      let typeShip = ship.dataset.shipType;
      let shipLen = ship.dataset.shipLength;
      let char = grid.id.substring(0, 1); //this is A from A10
      let num = Number(grid.id.substring(1)); //this is 10 from A10
      let equalizer = true;

      for (let i = this.counter; i < shipLen; i++) {
        if (this.shipOrientations[typeShip]) {
          this.shipsToSend.forEach(shipSend => {
            if (shipSend.location.includes(char + (num + i))) {
              equalizer = false;
            }
          });
        } else {
          this.shipsToSend.forEach(shipSend => {
            if (
              shipSend.location.includes(
                String.fromCharCode(char.charCodeAt(0) + i) + num
              )
            ) {
              equalizer = false;
            }
          });
        }
      }

      return equalizer;
    },

    putSalvos(cell) {
      if (document.getElementById(cell + "s").id.length > 2) {
        if (document.getElementById(cell + "s").classList.contains("myShots")) {
        } else {
          if (this.salvosToSend.includes(cell)) {
            document.getElementById(cell + "s").classList.remove("shotsDone");
            this.salvosToSend.splice(this.salvosToSend.indexOf(cell), 1);
          } else {
            if (this.salvosToSend.length < 5) {
              document.getElementById(cell + "s").classList.add("shotsDone");
              this.salvosToSend.push(cell);
            } else {
              this.dialogSalvo = true;
            }
          }
        }
      } else {
        this.dialogSalvoGrid = true;
      }
    }
  },
  computed: {
    ...mapGetters(["getGameView", "getShips", "getGames"])
  },
  created() {
    this.actGames();
    this.actGameView(this.gpId);
    this.fetching = setInterval(() => {
      this.actGameView(this.gpId);
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.fetching);
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap");
.height,
.wholeHeight {
  height: 100%;
}
.bckImg {
  background-image: url("https://s2.best-wallpaper.net/wallpaper/3840x2160/1703/Sea-wave-foam_3840x2160.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}
h4 {
  font-family: "Press Start 2P", cursive;
}
/*v-toolbar*/
a {
  text-decoration: none;
}
.v-toolbar__title {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}
.widthTitle {
  width: 57%;
  text-align: end;
}
.widthTitle2 {
  width: 50%;
  text-align: end;
}
.theme--light.v-toolbar.v-sheet {
  background: linear-gradient(-45deg, #abc9e9, #4c6a97, #182a42, #01010c);
  animation: gradient 2s ease infinite;
}
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.navBck {
  background: linear-gradient(-34deg, #abc9e9, #4c6a97, #182a42, #01010c);
  border: 0.5px solid black;
  border-right: none;
  border-left: none;
}
.flexWidth,
.flexPad {
  display: flex;
  width: inherit;
}
.iconFlex {
  width: 10%;
  display: flex;
  justify-content: center;
}
.youVsOpp {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
}
.flexState {
  width: 40%;
  display: flex;
}
.stateGame {
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-transform: capitalize;
}
/*alert*/
.v-dialog > .v-card > .v-card__text {
  padding: 10px 0px !important;
}
/*ships*/
.flexShips {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

/*grid*/

.inline-block {
  display: inline-block;
}
.borderGrid {
  border: 2px solid grey;
}
.borderGridGlow {
  border: 2px solid black;
  animation: glowing 1300ms infinite;
}
@keyframes glowing {
  0% {
    border-color: black;
    box-shadow: 0 0 5px black;
  }
  50% {
    border-color: grey;
    box-shadow: 0 0 20px grey;
  }
  100% {
    border-color: black;
    box-shadow: 0 0 5px black;
  }
}
.flex-grid {
  display: flex;
}
.flexType {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.flexJustify,
.gridFlex {
  display: flex;
  justify-content: space-evenly;
}
.gridFlex {
  padding-top: 30px;
}
.grid-colum {
  display: inline-grid;
  background-color: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.8);
  padding: 10px;
  font-size: 15px;
  text-align: center;
  width: 40px;
  height: 40px;
}

.grid-row {
  display: inline-grid;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.8);
  padding: 7px;

  width: 40px;
  position: relative;
}
/*paint background color of the grid*/
.Destroyer,
.PatrolBoat,
.Submarine,
.Carrier,
.Battleship {
  background: green;
}

.shotsDone {
  background: cyan;
}
.myShots {
  background: rgb(0, 0, 0, 0.5);
}
.oppShots {
  background: rgb(0, 0, 0, 0.5);
}
.oppHits {
  background: rgb(255, 29, 161);
}
.hits {
  background: purple;
}
.crossOut {
  text-decoration: line-through;
}
.sunkShip {
  background: black;
}
/*images of the ships*/
.opacitySunk {
  background-color: #ffffff6b;

  border: 2px solid grey;
}
.carrierImg {
  width: 198px;
  height: 38px;
  background-image: url("../assets/carrierHor.png");
}
.verCarrierImg {
  height: 227px;
  width: 38px;
  background-image: url("../assets/carrierVer.png");

  top: 0;
}
.CarrierBroken {
  width: 190px;
  height: 38px;
  background-image: url("../assets/carrierBroken.png");
}
.destroyerImg {
  width: 118px;
  height: 39px;
  background-image: url("../assets/destroyerHor.png");
  /* background-color: gray; */
}
.verDestroyerImg {
  width: 38px;
  height: 120px;
  background-image: url("../assets/destroyerVer.png");
  /* background-color: gray; */
  top: 0;
}
.DestroyerBroken {
  width: 75%;
  height: 39px;
  background-image: url("../assets/destroyerBroken.png");
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.submarineImg {
  width: 118px;
  height: 39px;
  background-image: url("../assets/submarineHor.png");
  /* background-color: yellow; */
}
.verSubmarineImg {
  height: 120px;
  width: 38px;
  background-image: url("../assets/submarineVer.png");
  /* background-color: yellow; */
  top: 0;
}
.SubmarineBroken {
  width: 118px;
  height: 39px;
  background-image: url("../assets/submarineBroken.png");
  margin-left: auto;
  margin-right: auto;
}
.patrolBoatImg {
  width: 78px;
  height: 40px;
  background-image: url("../assets/patrolBoatHor.png");
  /* background-color: orange; */
}
.verPatrolBoatImg {
  height: 80px;
  width: 38px;
  background-image: url("../assets/patrolBoatVer.png");
  /* background-color: orange; */
  top: 0;
}
.PatrolBoatBroken {
  width: 78px;
  height: 40px;
  background-image: url("../assets/patrolBoatBroken.png");
  margin-left: auto;
  margin-right: auto;
}
.battleshipImg {
  width: 158px;
  height: 40px;
  background-image: url("../assets/battleshipHor.png");
  /* background-color: cyan; */
}
.verBattleshipImg {
  height: 160px;
  width: 38px;
  background-image: url("../assets/battleshipVer.png");
  /* background-color: cyan; */
  top: 0;
}
.BattleshipBroken {
  width: 158px;
  height: 40px;
  background-image: url("../assets/battleshipBroken.png");
  margin-left: auto;
  margin-right: auto;
}

/*transform to z-index when draggingand dropping*/
.visibility {
  z-index: 1;
}
/*sendship and salvos*/
.flexBtn {
  display: flex;
  justify-content: center;
  height: 26.5%;
}
.btnSend1 {
  margin: 0 auto;
  width: 150px;
  padding: 20px;
  background: tomato;
  border-radius: 15px;
}
.btnSend {
  margin: 0 auto;
  width: 150px;
  padding: 20px;
  background: tomato;
  animation: mymove 0.75s infinite;
  border-radius: 15px;
}

@keyframes mymove {
  0% {
    transform: scale(1, 1) translate(0px, 0px);
  }

  30% {
    transform: scale(1, 0.9) translate(0px, 5px);
  }

  75% {
    transform: scale(1, 1.1) translate(0px, -10px);
  }

  100% {
    transform: scale(1, 1) translate(0px, 0px);
  }
}
.logicText {
  text-align: center;
  padding-top: 40px;
  position: relative;
}
.VICTORY {
  color: green;
  font-size: 90px;
  animation: victory 1s ease-in-out;
  position: absolute;
  top: 0;
  left: 31%;
  font-family: "Press Start 2P", cursive;
}
.DEFEAT {
  color: red;
  font-size: 90px;
  animation: defeat 1s ease-in-out;
  position: absolute;
  top: 0;
  left: 33%;
  font-family: "Press Start 2P", cursive;
}
.DRAW {
  color: rgb(255, 215, 0);
  font-size: 90px;
  animation: draw 1s ease-in-out;
  position: absolute;
  top: 0;
  left: 39%;
  font-family: "Press Start 2P", cursive;
}

@keyframes victory {
  0% {
    left: 0;
  }
  20% {
    left: 45%;
  }
  40% {
    left: 20%;
  }
  60% {
    left: 35%;
  }
  80% {
    left: 25%;
  }

  100% {
    left: 31%;
  }
}
@keyframes defeat {
  0% {
    left: 0;
  }
  20% {
    left: 45%;
  }
  40% {
    left: 20%;
  }
  60% {
    left: 35%;
  }
  80% {
    left: 25%;
  }

  100% {
    left: 33%;
  }
}
@keyframes draw {
  0% {
    left: 0;
  }
  20% {
    left: 50%;
  }
  40% {
    left: 30%;
  }
  60% {
    left: 45%;
  }
  80% {
    left: 35%;
  }

  100% {
    left: 39%;
  }
}
</style>
