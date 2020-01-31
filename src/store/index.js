import Vue from "vue";
import Vuex from "vuex";
import router from "../router/index.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    games: null,
    gameView: [],
    ladderBoard: []
  },
  mutations: {
    get_games: (state, payload) => (state.games = payload),
    get_gameView: (state, payload) => (state.gameView = payload),
    get_board: (state, payload) => (state.ladderBoard = payload)
  },
  actions: {
    //games
    actGames(context) {
      fetch("/api/games", {
        credentials: "include",
        method: "GET"
      })
        .then(resp => {
          console.log(resp);
          if (resp.ok) {
            return resp.json();
          }
          throw new Error("bad request");
        })
        .then(data => {
          context.commit("get_games", data);

          console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //gameview
    actGameView(context, id) {
      fetch("/api/game_view/" + id, {
        credentials: "include",
        method: "GET"
      })
        .then(resp => {
          console.log(resp);

          return resp.json();
        })
        .then(data => {
          if (data.Error) {
            console.log(data);
          } else {
            context.commit("get_gameView", data);

            console.log(data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //ladderboard
    actLadderboard(context) {
      fetch("/api/ladderBoard", {
        credentials: "include",
        method: "GET"
      })
        .then(resp => {
          console.log(resp);
          if (resp.ok) {
            return resp.json();
          }
          throw new Error("bad request");
        })
        .then(data => {
          context.commit("get_board", data);
          console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //login and logout
    actLogin({ commit }, payload) {
      fetch("/app/login", {
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: getBody({ name: payload.userName, pwd: payload.password })
      })
        .then(function(data) {
          console.log("Request success: ", data);
          if (data.status == 200) {
            router.push("/");
          }
        })
        .catch(function(error) {
          console.log("Request failure: ", error);
        });
      function getBody(json) {
        var body = [];
        for (var key in json) {
          var encKey = encodeURIComponent(key);
          var encVal = encodeURIComponent(json[key]);
          body.push(encKey + "=" + encVal);
        }
        return body.join("&");
      }
    },
    actLogout() {
      fetch("/app/logout", {
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
      })
        .then(function(data) {
          console.log("logout successful: ", data);
        })
        .catch(error => {
          console.log("fail: ", error);
        });
    },
    //register
    actRegister({ commit, dispatch }, payload) {
      fetch("/api/register", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(payload)
      })
        .then(newData => {
          console.log("data sent: ", JSON.stringify(newData));
          return newData.json();
        })
        .then(data => {
          if (data.Error) {
            console.log("register failed ", data);
          } else {
            console.log("register successful ", data);
            dispatch("actLogin", payload);
          }
        })
        .catch(error => {
          console.log("Request failure: ", error);
        });
    },
    //create new game
    actCreate() {
      fetch("/api/games", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
        // body: JSON.stringify(payload)
      })
        .then(newData => {
          console.log("data sent: ", JSON.stringify(newData));
          return newData.json();
        })
        .then(data => {
          if (data.Error) {
            console.log("error ", data);
          } else {
            console.log("created: ", data);
          }
        })
        .catch(error => {
          console.log("Request failure: ", error);
        });
    },
    //join game
    actJoin({ commit }, id) {
      console.log(id);

      fetch("/api/game/" + id + "/players", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      })
        .then(newData => {
          console.log("data sent: ", JSON.stringify(newData));
          return newData.json();
        })
        .then(data => {
          if (data.Error) {
            //data.Error references the backend
            console.log("error ", data);
          } else {
            console.log("created: ", data);
            router.push(`/Game/${data.gpid}`);
          }
        })
        .catch(error => {
          console.log("Request failure: ", error);
        });
    },
    //fetch to list of ships
    actShips({ commit, dispatch }, { gpId, ships }) {
      fetch("/api/games/players/" + gpId + "/ships", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(ships)
      })
        .then(newData => {
          console.log("data sent: ", JSON.stringify(newData));
          return newData.json();
        })
        .then(data => {
          if (data.Error) {
            //data.Error references the backend
            console.log("error ", data);
          } else {
            console.log("created: ", data);
            dispatch("actGameView", gpId);
          }
        })
        .catch(error => {
          console.log("Request failure: ", error);
        });
    }
  },
  modules: {},
  getters: {
    getGames: state => state.games,
    getGameView: state => state.gameView,
    getBoard: state => state.ladderBoard
  }
});
