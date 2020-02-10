<template>
  <div v-if="getGameView.length !=0">
    <router-link :to="'/'">
      <button>Back to main page</button>
    </router-link>
    <div>
      <div>
        <div>{{getGameView.Game.gameplayers[0].player.username}}</div>
        <span>VS</span>
        <div
          v-if="getGameView.Game.gameplayers.length > 1"
        >{{getGameView.Game.gameplayers[1].player.username}}</div>
        <div v-else>Waiting for opponent...</div>
      </div>
    </div>
    <div class="flexJustify">
      <div v-for="(type, i) in this.shipsToSend" :key="i" :id="type.type + 'sink'">{{type.type}}</div>
    </div>
    <h4>My Ships</h4>

    <div>
      <button @click="sendShips">Send Ships</button>
    </div>
    <div class="flexJustify">
      <div
        :class="shipOrientations['Carrier'] ? 'carrierImg' : 'verCarrierImg'"
        id="Carrier"
        :draggable="true"
        @dragstart="dragStart"
        @dragover.stop
        data-ship-length="5"
        data-ship-type="Carrier"
        @click="turnShip($event, 'Carrier')"
      >Carrier</div>
      <div
        :class="shipOrientations['Destroyer'] ? 'destroyerImg' : 'verDestroyerImg'"
        id="Destroyer"
        :draggable="true"
        @dragstart="dragStart"
        @dragover.stop
        data-ship-length="3"
        data-ship-type="Destroyer"
        @click="turnShip($event, 'Destroyer')"
      >Destroyer</div>

      <div
        id="Submarine"
        :class="shipOrientations['Submarine'] ? 'submarineImg' : 'verSubmarineImg'"
        :draggable="true"
        @dragstart="dragStart"
        @dragover.stop
        data-ship-length="3"
        data-ship-type="Submarine"
        @click="turnShip($event, 'Submarine')"
      >Submarine</div>

      <div
        :class="shipOrientations['PatrolBoat'] ? 'patrolBoatImg' : 'verPatrolBoatImg'"
        :draggable="true"
        id="PatrolBoat"
        @dragstart="dragStart"
        @dragover.stop
        data-ship-length="2"
        data-ship-type="PatrolBoat"
        @click="turnShip($event, 'PatrolBoat')"
      >Patrol Boat</div>

      <div
        :class="shipOrientations['Battleship'] ? 'battleshipImg' : 'verBattleshipImg'"
        id="Battleship"
        :draggable="true"
        @dragstart="dragStart"
        @dragover.stop
        data-ship-length="4"
        data-ship-type="Battleship"
        @click="turnShip($event, 'Battleship')"
      >Battleship</div>
    </div>
    <div>
      <div class="inline-block">
        <div class="flex-grid">
          <div v-for="num in rows" :key="num" class="grid-colum">{{num}}</div>
        </div>
        <div
          v-for="(char ) in cols"
          :key="char"
          class="flex-grid"
          @dragover.prevent
          @drop.prevent="drop"
          :id="id"
        >
          <div v-for="(num, index) in rows" :key="char+num" class="grid-row" :id="char+num">
            <span v-if="index == 0">{{char}}</span>
          </div>
        </div>
      </div>

      <div>
        <h4>Shots</h4>
        <button @click="sendSalvos">Shot!</button>
        <div class="flex-grid">
          <div v-for="num in rows" :key="num" class="grid-colum">{{num}}</div>
        </div>
        <div v-for="character in cols" :key="character" class="flex-grid">
          <div
            v-for="number in rows"
            :key="character+number"
            class="grid-row"
            :id="character + number +'s'"
            @click="putSalvos(character + number)"
          >
            <span>{{character + number}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
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
      counter: 0,
      myLocations: [],
      opponentLoc: [],
      myShots: [],
      rows: ["", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      cols: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      salvosToSend: [],
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
      ],
      //make all variables from drop function to general
      shipOrientations: {
        Carrier: true,
        Destroyer: true,
        PatrolBoat: true,
        Submarine: true,
        Battleship: true
      }
    };
  },
  watch: {
    getGameView() {
      setTimeout(() => {
        //my ships locations
        for (let i = 0; i < this.getGameView.Ship.length; i++) {
          let shipLocation = this.getGameView.Ship[i].Locations;
          let shipType = this.getGameView.Ship[i].Type;

          for (let j = 0; j < shipLocation.length; j++) {
            document
              .getElementById(shipLocation[j]) //this location is equal to the num+char id
              .classList.add(shipType.replace(/\s/g, "")); //
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
              document.getElementById(sunk + "sink").classList.add("crossOut");
            }
          }
        }
      }, 0);
    }
  },
  methods: {
    ...mapActions(["actShips", "actSalvos"]),
    sendShips() {
      return this.$store.dispatch("actShips", {
        gpId: this.gpId,
        ships: this.shipsToSend
      });
    },

    sendSalvos() {
      return this.$store.dispatch("actSalvos", {
        gpId: this.gpId,
        salvos: this.salvosToSend
      });
    },

    //drag and drop
    dragStart(e) {
      console.log("dragstart");
      let target = e.target;
      e.dataTransfer.setData("ship_id", target.id);

      this.counter = 0;
    },
    drop(e) {
      console.log("drop");

      let grid = e.target;
      let shipId = e.dataTransfer.getData("ship_id"); //Carrier, Destroyer...
      let ship = document.getElementById(shipId);

      // this.shipsToSend.forEach(ship => {
      //   if (ship.type == shipId) {
      //     ship.location = [];
      //   }
      // });
      if (this.checkFree(shipId, grid)) {
        this.shipConditions(shipId, grid);
      } else {
        console.log("can't drop here");
      }
    },
    turnShip(event, name) {
      this.counter = 1;
      let grid = event.target.offsetParent;
      let gridId = event.target.offsetParent.id; //A5
      let shipId = event.target.id; //CARRIER
      let ship = document.getElementById(shipId);
      let shipLen = ship.dataset.shipLength;

      let num = Number(gridId.substring(1));
      let char = gridId.substring(0, 1);

      console.log("draw");
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
          console.log("can't turn here");
        }
      } else {
        console.log("can't turn around here");
      }
    },
    shipLocation(shipId, grid) {
      console.log("location");

      let ship = document.getElementById(shipId);

      let char = grid.id.substring(0, 1); //this is A from A10
      let num = Number(grid.id.substring(1)); //this is 10 from A10

      let newShipLoc = [];

      if (this.shipOrientations[ship.dataset.shipType]) {
        console.log("orientation horizontal");
        for (let i = 0; i < ship.dataset.shipLength; i++) {
          newShipLoc.push(char + (num + i));
        }
      } else {
        console.log("orientation vertical");
        for (let i = 0; i < ship.dataset.shipLength; i++) {
          newShipLoc.push(String.fromCharCode(char.charCodeAt(0) + i) + num);
        }
      }

      this.shipsToSend.forEach(sendShip => {
        if (sendShip.type == ship.dataset.shipType) {
          sendShip.location = newShipLoc;
        }
      });
    },
    shipConditions(shipId, grid) {
      console.log("conditions");

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
        console.log("can't place the ship there fucking cheater");
      }
    },
    checkFree(shipId, grid) {
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
              console.log("can't place");
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
              console.log("can't place");
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
          console.log("can't shot where you shotted!");
        } else {
          if (this.salvosToSend.includes(cell)) {
            document.getElementById(cell + "s").classList.remove("shotsDone");
            this.salvosToSend.splice(this.salvosToSend.indexOf(cell), 1);
          } else {
            if (this.salvosToSend.length < 5) {
              document.getElementById(cell + "s").classList.add("shotsDone");
              this.salvosToSend.push(cell);
            } else {
              console.log("can't put anymore ships");
            }
          }
        }
      } else {
        console.log("can't shoot outside of the grid");
      }
    }
  },
  computed: {
    ...mapGetters(["getGameView", "getShips"]),
    changepos() {
      return this.shipOrientations;
    }
  },
  created() {}
};
</script>

<style scoped>
.inline-block {
  display: inline-block;
}
.flex-grid {
  display: flex;
}
.flexJustify {
  display: flex;
  justify-content: space-evenly;
}
.grid-colum {
  display: inline-grid;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.8);
  padding: 10px;
  font-size: 15px;
  text-align: center;
  width: 20px;
  height: 20px;
}

.grid-row {
  display: inline-grid;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.8);
  padding: 10px;

  width: 20px;
  position: relative;
}
.Destroyer {
  background: chocolate;
}
.PatrolBoat {
  background: red;
}
.Submarine {
  background: yellow;
}
.Carrier {
  background: green;
}
.Battleship {
  background: brown;
}
.shotsDone {
  background: cyan;
}
.myShots {
  background: rgb(0, 0, 0, 0.5);
}
.oppShots {
  background: rgb(126, 243, 126);
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
.carrierImg {
  width: 208px;
  height: 38px;
  z-index: 1;
  background-color: green;
}
.verCarrierImg {
  z-index: 1;
  height: 200px;
  width: 40.5px;
  background-color: green;
  top: 0;
}
.destroyerImg {
  width: 124px;
  height: 38px;
  z-index: 1;
  background-color: gray;
}
.verDestroyerImg {
  z-index: 1;
  height: 120px;
  width: 40.5px;
  background-color: gray;
  top: 0;
}
.submarineImg {
  width: 124px;
  height: 38px;
  z-index: 1;
  background-color: yellow;
}
.verSubmarineImg {
  z-index: 1;
  height: 120px;
  width: 40.5px;
  background-color: yellow;
  top: 0;
}
.patrolBoatImg {
  width: 82px;
  height: 38px;
  z-index: 1;
  background-color: orange;
}
.verPatrolBoatImg {
  z-index: 1;
  height: 80px;
  width: 40.5px;
  background-color: orange;
  top: 0;
}
.battleshipImg {
  width: 166px;
  height: 38px;
  z-index: 1;
  background-color: cyan;
}
.verBattleshipImg {
  z-index: 1;
  height: 160px;
  width: 40.5px;
  background-color: cyan;
  top: 0;
}
</style>