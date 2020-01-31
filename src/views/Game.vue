<template>
  <div>
    <Grid :gpId="id"></Grid>
    <div></div>
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

  methods: {
    ...mapActions(["actGameView"])
  },
  computed: {
    ...mapGetters(["getGameView"])
  },
  created() {
    this.actGameView(this.id);
  }
};
</script>

<style>
</style>