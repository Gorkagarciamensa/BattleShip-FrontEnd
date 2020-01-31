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
    <h4>My Ships</h4>

    <div>
      <button @click="sendShips">Send Ships</button>
    </div>
    <div>
      <div v-if="shipOrientations['Carrier']">
        <img
          id="Carrier"
          @dragstart="dragStart"
          @dragover.stop
          data-ship-length="5"
          data-ship-type="Carrier"
          src="../assets/carrier.png"
          class="horImg"
          @click="drawShip($event, 'Carrier')"
        />
      </div>
      <div v-else>
        <img
          src="../assets/carrier_ver.png"
          id="CarrierVer"
          @dragstart="dragStart"
          @dragover.stop
          data-ship-length="5"
          data-ship-type="Carrier"
          class="verImg"
          @click="drawShip($event, 'Carrier')"
        />
      </div>
      <div v-if="shipOrientations['Destroyer']">
        <img
          id="Destroyer"
          @dragstart="dragStart"
          @dragover.stop
          data-ship-length="3"
          data-ship-type="Destroyer"
          src="../assets/carrier.png"
          class="horImg"
          @click="drawShip($event, 'Destroyer')"
        />
      </div>
      <div v-else>
        <img
          id="DestroyerVer"
          @dragstart="dragStart"
          @dragover.stop
          data-ship-length="3"
          data-ship-type="Destroyer"
          src="../assets/carrier_ver.png"
          class="verImg"
          @click="drawShip($event, 'Destroyer')"
        />
      </div>
      <div v-if="shipOrientations['Submarine']">
        <img
          id="Submarine"
          @dragstart="dragStart"
          @dragover.stop
          data-ship-length="3"
          data-ship-type="Submarine"
          src="../assets/carrier.png"
          class="horImg"
          @click="drawShip($event, 'Submarine')"
        />
      </div>
      <div v-else>
        <img
          id="SubmarineVer"
          @dragstart="dragStart"
          @dragover.stop
          data-ship-length="3"
          data-ship-type="Submarine"
          src="../assets/carrier_ver.png"
          class="verImg"
          @click="drawShip($event, 'Submarine')"
        />
      </div>
      <div v-if="shipOrientations['PatrolBoat']">
        <img
          id="PatrolBoat"
          @dragstart="dragStart"
          @dragover.stop
          data-ship-length="2"
          data-ship-type="PatrolBoat"
          src="../assets/carrier.png"
          class="horImg"
          @click="drawShip($event, 'PatrolBoat')"
        />
      </div>
      <div v-else>
        <img
          id="PatrolBoatVer"
          @dragstart="dragStart"
          @dragover.stop
          data-ship-length="2"
          data-ship-type="PatrolBoat"
          src="../assets/carrier_ver.png"
          class="verImg"
          @click="drawShip($event, 'PatrolBoat')"
        />
      </div>
      <div v-if="shipOrientations['Battleship']">
        <img
          id="Battleship"
          @dragstart="dragStart"
          @dragover.stop
          data-ship-length="4"
          data-ship-type="Battleship"
          src="../assets/carrier.png"
          class="horImg"
          @click="drawShip($event, 'Battleship')"
        />
      </div>
      <div v-else>
        <img
          id="BattleshipVer"
          @dragstart="dragStart"
          @dragover.stop
          data-ship-length="4"
          data-ship-type="Battleship"
          src="../assets/carrier_ver.png"
          class="verImg"
          @click="drawShip($event, 'Battleship')"
        />
      </div>
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
import Drop from "./Drop";

export default {
  //submarine is 3
  //destroyer is 3
  //battleship is 4
  //patrol boat is 2
  //carrier is 5
  props: ["gpId", "id"],
  components: {
    Drop
  },
  data() {
    return {
      counter: null,
      myLocations: [],
      opponentLoc: [],
      rows: ["", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      cols: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
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
      dataTarget: [],
      dataShipId: [],
      dataShip: [],
      dataRegEx: [],
      dataNumRegex: [],
      dataLetRegex: [],
      dataNewShipLoc: [],

      removeColorCells: [],
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

        //my shots
        for (let i = 0; i < this.getGameView.mySalvo.length; i++) {
          let mySalvo = this.getGameView.mySalvo[i].Location;

          for (let j = 0; j < mySalvo.length; j++) {
            document.getElementById(mySalvo[j] + "s").classList.add("myShots");
          }
        }
        //opponent shots
        for (let k = 0; k < this.getGameView.length; k++) {
          let oppSalvo = this.getGameView.oppSalvo[k].Location;

          for (let j = 0; j < oppSalvo.length; j++) {
            document.getElementById(oppSalvo[j]).style.background = "pink";
            this.opponentLoc.push(oppSalvo[j]);
          }
        }

        //hits by opponent
        for (let i = 0; i < this.myLocations.length; i++) {
          for (let j = 0; j < this.opponentLoc.length; j++) {
            if (this.myLocations[i] == this.opponentLoc[j]) {
              document.getElementById(this.opponentLoc[j]).style.background =
                "black";
            }
          }
        }
      }, 0);
    }
  },
  methods: {
    ...mapActions(["actShips"]),
    sendShips() {
      return this.$store.dispatch("actShips", {
        gpId: this.gpId,
        ships: this.shipsToSend
      });
    },

    //drag and drop
    dragStart(e) {
      console.log("dragstart");

      let target = e.target;
      this.counter = 0;
      e.dataTransfer.setData("ship_id", target.id);
    },
    drop(e) {
      console.log("drop");

      let ship_id = e.dataTransfer.getData("ship_id"); //we transfer the data to the drop event
      console.log("ship_id: ", ship_id);

      this.dataShip = document.getElementById(ship_id);
      console.log("dataShip", this.dataShip);

      this.dataTarget = e.target;
      console.log("dataTarget", this.dataTarget);

      console.log("dataTarget ID", this.dataTarget.id);

      let regexStr = this.dataTarget.id;
      console.log("regexStr:", regexStr);
      this.dataRegEx = regexStr;

      let numRegex = Number(regexStr[1]);
      console.log("numRegex:", numRegex);

      let letRegex = regexStr[0];
      console.log("letRegex", letRegex);

      //assign values to the general variables
      this.dataShipId = ship_id;
      console.log("dataShipId:", this.dataShipId);

      this.dataNumRegex = numRegex;
      console.log("dataNumRegex", this.dataNumRegex);

      this.dataLetRegex = letRegex;
      console.log("dataLetRegex", this.dataLetRegex);

      this.conditionFunction();
    },

    conditionFunction() {
      console.log("condition function", this.dataTarget);
      console.log("cond id", this.dataTarget.id);
      console.log("cond length", this.dataTarget.id.length);

      if (
        (this.checkFree(this.dataShip) &&
        this.dataTarget.id.length != 1 && //horizontal
          Number(this.dataShip.dataset.shipLength) + this.dataNumRegex < 12 &&
          this.shipOrientations[this.dataShip.dataset.shipType]) ||
        (this.checkFree(this.dataShip) &&
        this.dataTarget.id.length != 1 && //vertical
          Number(this.dataShip.dataset.shipLength) +
            this.dataLetRegex.charCodeAt(0) <
            76 &&
          !this.shipOrientations[this.dataShip.dataset.shipType])
      ) {
        this.dataShip.style.position = "absolute";
        this.dataShip.style.display = "block";
        this.dataTarget.appendChild(this.dataShip);

        this.orientationShip();
      } else {
        console.log("drop(e) not allowed");
      }
    },
    checkFree(ship) {
      console.log("check");

      let sepuede = true;

      if (this.shipOrientations[ship.dataset.shipType]) {
        console.log("horizontal(checkfree)", this.counter);
        for (let i = this.counter; i < ship.dataset.shipLength; i++) {
          if (
            document.getElementById(
              this.dataRegEx[0] + (Number(this.dataRegEx[1]) + i)
            ).classList.length > 1
          ) {
            console.log("sorry can't put a ship");
            sepuede = false;
          }
        }
      } else {
        console.log("vertical(checkfree)", this.counter);

        for (let i = this.counter; i < ship.dataset.shipLength; i++) {
          if (
            document.getElementById(
              String.fromCharCode(this.dataRegEx[0].charCodeAt(0) + i) +
                this.dataRegEx[1]
            ).classList.length > 1
          ) {
            console.log("sorry can't put a ship");
            sepuede = false;
          }
        }
      }
      return sepuede;
    },
    //orientation (vertical/horizontal)
    orientationShip(event) {
      console.log("orientation");

      let newShipLocations = [];

      this.dataNewShipLoc = newShipLocations;
      console.log(this.dataNewShipLoc);

      let ship = this.dataShip;
      console.log(ship);

      this.removeShips();
      console.log("orientation letter", this.dataLetRegex);
      console.log("orientation num", this.dataNumRegex);
      console.log(this.dataRegEx);
      let regEx = this.dataRegEx;
      let letReg = this.dataRegEx.match(/[a-z]+|[^a-z]+/gi);
      console.log(letReg[1]);

      //horizontal

      if (this.shipOrientations[ship.dataset.shipType]) {
        if (Number(ship.dataset.shipLength) + this.dataNumRegex < 12) {
          for (let i = 0; i < ship.dataset.shipLength; i++) {
            newShipLocations.push(this.dataLetRegex + (this.dataNumRegex + i));

            document
              .getElementById(this.dataLetRegex + (this.dataNumRegex + i))
              .classList.add(ship.dataset.shipType);
          }
        } else {
          console.log("can't place a ship there!");
        }

        //Vertical position
      } else {
        if (
          Number(ship.dataset.shipLength) + this.dataLetRegex.charCodeAt(0) <
          76
        ) {
          for (let i = 0; i < ship.dataset.shipLength; i++) {
            console.log("en el for num", this.dataNumRegex);
            console.log(
              "en el for letra",
              String.fromCharCode(this.dataLetRegex.charCodeAt(0) + i)
            );

            newShipLocations.push(this.dataLetRegex.charCodeAt(0) + i);
            console.log("locations", newShipLocations);
            document
              .getElementById(
                String.fromCharCode(this.dataLetRegex.charCodeAt(0) + i) +
                  Number(letReg[1])
              )
              .classList.add(ship.dataset.shipType);
          }
        } else {
          console.log("can't place a ship vertically there!");
        }
      }
      this.shipsToSend.forEach(shipToSend => {
        if (shipToSend.type == ship.dataset.shipType) {
          shipToSend.location = newShipLocations;
        }
      });
    },

    drawShip(event, ship) {
      this.counter = 1;
      //this function happens when the ship is changed from vertical to horizontal
      console.log("draw");
      console.log("ship", this.dataNumRegex);
      let regEx = this.dataRegEx;
      let letReg = this.dataRegEx.match(/[a-z]+|[^a-z]+/gi);
      this.dataTarget = event.target.offsetParent;
      console.log(letReg[1]);
      console.log(Number(this.dataShip.dataset.shipLength));
      console.log(Number(this.dataShip.dataset.shipLength) + letReg[1]);
      console.log(event.target.offsetParent.id);

      if (
        (Number(this.dataShip.dataset.shipLength) + Number(letReg[1]) < 12 &&
          !this.shipOrientations[this.dataShip.dataset.shipType]) ||
        (this.dataTarget.id.length != 1 &&
          Number(this.dataShip.dataset.shipLength) +
            this.dataLetRegex.charCodeAt(0) <
            76 &&
          this.shipOrientations[this.dataShip.dataset.shipType])
      ) {
        console.log(letReg[1]);

        this.shipOrientations[ship] = !this.shipOrientations[ship];
        this.dataShip = document.getElementById(event.target.id);
        console.log("barco", this.dataShip);
        console.log("event", event.target.id);
        console.log("ship Ver or Hor", this.dataShip.id);
        this.dataShipId = this.dataShip.id;
        this.dataLetRegex = event.target.offsetParent.id.split("")[0];
        console.log("event padre", event.target.offsetParent.id);
        this.dataTarget = event.target.offsetParent;
        console.log(this.dataTarget);

        this.dataRegEx = event.target.offsetParent.id;
        this.dataNumRegex = Number(
          event.target.offsetParent.id.match(/[a-z]+|[^a-z]+/gi)[1]
        );

        if (this.checkFree(this.dataShip)) {
          this.conditionFunction();
        } else {
          this.shipOrientations[ship] = !this.shipOrientations[ship];
          console.log("can't turn around here!******");
        }
      } else {
        console.log("can't turn around here! orientation");
      }
    },
    removeShips() {
      //when changing a place from the grid to another, the background color is removed
      let ship = this.dataShip;

      let shipColorCells = Array.from(
        document.getElementsByClassName(ship.dataset.shipType)
      );
      this.removeColorCells = shipColorCells;
      for (let i = 0; i < shipColorCells.length; i++) {
        shipColorCells[i].classList.remove(ship.dataset.shipType);
      }
    },

    putSalvos(cell) {
      document.getElementById(cell + "s").style.background = "cyan";
    }
  },
  computed: {
    ...mapGetters(["getGameView", "getShips"])
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
  text-align: center;
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
.myShots {
  background: rgb(0, 0, 0, 0.5);
}
.horImg {
  width: 124px;
  height: 38px;
  z-index: 1;
}
.verImg {
  top: 0;
  z-index: 1;
  height: 100px;
  width: 42px;
}
</style>