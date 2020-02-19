import Vue from "vue";
import Vuex from "vuex";
import router from "../router/index.js";
const url = "https://arcane-spire-49060.herokuapp.com";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    games: null,
    gameView: null,
    ladderBoard: [],
    gameViewError: "",
    errorMsg: null
  },
  mutations: {
    get_games: (state, payload) => (state.games = payload),
    get_gameView: (state, payload) => (state.gameView = payload),
    get_gameViewError: (state, payload) => (state.gameViewError = payload),
    get_board: (state, payload) => (state.ladderBoard = payload),
    get_errorMsg: (state, payload) => (state.errorMsg = payload)
  },
  actions: {
    //games
    actGames(context) {
      fetch(url + "/api/games", {
        credentials: "include",
        method: "GET"
      })
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          }
          throw new Error("bad request");
        })
        .then(data => {
          context.commit("get_games", data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //gameview
    actGameView(context, id) {
      fetch(url + "/api/game_view/" + id, {
        credentials: "include",
        method: "GET"
      })
        .then(resp => {
          return resp.json();
        })
        .then(data => {
          if (data.Error) {
            console.log(data.Error);
          } else {
            context.commit("get_gameView", data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //ladderboard
    actLadderboard(context) {
      fetch(url + "/api/ladderBoard", {
        credentials: "include",
        method: "GET"
      })
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          }
          throw new Error("bad request");
        })
        .then(data => {
          context.commit("get_board", data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //login and logout
    actLogin({ commit }, payload) {
      fetch(url + "/app/login", {
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: getBody({ name: payload.userName, pwd: payload.password })
      })
        .then(function(data) {
          if (data.status == 200) {
            router.push("/");
          } else {
            commit("get_errorMsg", data.ok);
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
      fetch(url + "/app/logout", {
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
      fetch(url + "/api/register", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(payload)
      })
        .then(newData => {
          return newData.json();
        })
        .then(data => {
          if (data.Error) {
            console.log("register failed ", data);
          } else {
            dispatch("actLogin", payload);
          }
        })
        .catch(error => {
          console.log("Request failure: ", error);
        });
    },
    //create new game
    actCreate() {
      fetch(url + "/api/games", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
        // body: JSON.stringify(payload)
      })
        .then(newData => {
          return newData.json();
        })
        .then(data => {
          if (data.Error) {
            console.log("error ", data);
          } else {
            router.push("/Game/" + data.gpid);
          }
        })
        .catch(error => {
          console.log("Request failure: ", error);
        });
    },
    //join game
    actJoin({ commit }, id) {
      fetch(url + "/api/game/" + id + "/players", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      })
        .then(newData => {
          return newData.json();
        })
        .then(data => {
          if (data.Error) {
            //data.Error references the backend
            console.log("error ", data);
          } else {
            router.push(`/Game/${data.gpid}`);
          }
        })
        .catch(error => {
          console.log("Request failure: ", error);
        });
    },
    //fetch to list of ships
    actShips({ commit, dispatch }, { gpId, ships }) {
      fetch(url + "/api/games/players/" + gpId + "/ships", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(ships)
      })
        .then(newData => {
          return newData.json();
        })
        .then(data => {
          if (data.Error) {
            //data.Error references the backend
            console.log("error ", data);
          } else {
            dispatch("actGameView", gpId);
          }
        })
        .catch(error => {
          console.log("Request failure: ", error);
        });
    },
    actSalvos({ commit, dispatch }, { gpId, salvos }) {
      fetch(url + "/api/games/players/" + gpId + "/salvos", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(salvos)
      })
        .then(newData => {
          return newData.json();
        })
        .then(data => {
          if (data.Error) {
            //data.Error references the backend
            console.log("error ", data);
          } else {
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
    getBoard: state => state.ladderBoard,
    getErrorMsg: state => state.errorMsg
  }
});
