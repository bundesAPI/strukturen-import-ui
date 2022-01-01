<template>
  <OrgchartRenderer :data="data"></OrgchartRenderer>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import OrgchartRenderer from "./OrgchartRenderer";

export default {
  name: "OrgchartResult",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    VueJsonPretty,
    OrgchartRenderer,
  },
  props: ["json"],

  watch: {
    json: function (val) {
      this.data = val;
    },
  },

  data() {
    return {
      data: null,
    };
  },
};
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
</style>
