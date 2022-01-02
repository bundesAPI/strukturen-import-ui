<template>
  <div v-if="this.$props.dataset.length > 0">
    <v-progress-linear
      :value="this.idx / (this.$props.dataset.length / 100)"
    ></v-progress-linear>

    <br />
    <v-row no-gutters>
      <v-col cols="12" sm="6">
        <img width="400" v-if="previewImage" :src="previewImage" />
        <br />
        <br />
        <h4>Text</h4>
        <span style="white-space: pre">{{
          this.$props.dataset[this.idx].text
        }}</span>
        <br />
        <h4>Colors</h4>
        <div
          v-bind:key="c"
          v-for="c in this.$props.dataset[this.idx].colors"
          :style="{
            width: '30px',
            display: 'inline-block',
            height: '30px',
            border: '1px solid #000',
            'background-color': `rgb(${c[0]}, ${c[1]}, ${c[2]})`,
          }"
        ></div>

        <br /><br />
      </v-col>
      <v-col cols="12" sm="6">
        <div class="text-center" v-if="isLoading">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <v-form v-model="valid" v-if="!isLoading">
          <v-jsf
            v-model="model"
            :options="{ editMode: 'inline', context: this }"
            :schema="schema"
          />
        </v-form>
      </v-col>
      <v-btn @click="previousItem()">previous </v-btn>
      <v-btn color="primary" @click="nextItem()"> next </v-btn>
    </v-row>
  </div>
</template>

<script>
import "@koumoul/vjsf/lib/VJsf.css";
import "@koumoul/vjsf/lib/deps/third-party.js";
import VJsf from "@koumoul/vjsf";
import "@koumoul/vjsf/dist/main.css";
import "regenerator-runtime/runtime";
import { v4 as uuidv4 } from "uuid";

export default {
  props: ["dataset", "parents", "orgchart_id"],
  components: { VJsf },
  name: "OrgchartAnnotationEditor",
  watch: {
    idx: function () {
      this.loadData();
    },
    dataset: function () {
      this.loadData();
    },
    annotations: function (val) {
      this.model = { organisations: val.parsed };
    },
  },
  methods: {
    loadData() {
      this.previewImage = `${
        process.env.VUE_APP_ORGCHART_ML
      }/orgchart-image/?orgchart_id=${
        this.$props.orgchart_id
      }&page=0&position=${this.$props.dataset[this.idx].position.join(
        "&position="
      )}`;

      if (this.idx in this.results) {
        this.model = this.results[this.idx]["parsed"];
        this.annotations = this.results[this.idx]["annotations"];
      } else {
        this.isLoading = true;
        this.axios
          .get(
            `${
              process.env.VUE_APP_ORGCHART_ML
            }/analyze-orgchart-entry/?text=${encodeURI(
              this.$props.dataset[this.idx].text
            )}`
          )
          .then((response) => this.loadAnnotationsDone(response["data"]));
      }
    },
    storeCurrentItem() {
      this.results[this.idx] = {};
      this.results[this.idx]["parsed"] = this.model["organisations"];
      this.results[this.idx]["annotations"] = this.annotations;
      this.annotations = [];
      this.model = null;
    },
    nextItem() {
      this.storeCurrentItem();
      if (this.idx + 1 < this.$props.dataset.length) {
        this.idx = this.idx + 1;
      } else {
        this.postProcessAnnotations();
      }
    },
    postProcessAnnotations() {
      var orgs = [];
      for (let o in this.results) {
        for (let e in this.results[o]["parsed"]) {
          orgs.push({
            organisation: this.results[o]["parsed"][e],
            source: this.$props.dataset[o],
          });
        }
      }
      console.log(orgs);
      this.$emit("annotationDone", orgs);
    },
    previousItem() {
      this.storeCurrentItem();
      if (this.idx - 1 > -1) {
        this.idx = this.idx - 1;
      } else {
        this.$emit("back");
      }
    },
    loadAnnotationsDone(response) {
      // add the element id to the first element in our list
      response["parsed"][0]["id"] = this.dataset[this.idx]["id"];
      // give each other element a new uuid and assign each of them the common parent id
      for (let i in response["parsed"]) {
        if (!("id" in response["parsed"][i])) {
          response["parsed"][i]["id"] = uuidv4();
        }
        // assign parent id
        if (this.dataset[this.idx]["id"] in this.$props.parents) {
          console.log(this.$props.parents[this.dataset[this.idx]["id"]]);
          response["parsed"][i]["parentId"] = {
            val: this.$props.parents[this.dataset[this.idx]["id"]],
          };
        } else {
          // if there is no parent, assign null.
          response["parsed"][i]["parentId"] = { val: null, label: "No Parent" };
        }
      }
      this.annotations = response;
      this.isLoading = false;
    },
  },
  computed: {
    allParents() {
      let parents = [];
      let parent_keys = [];

      for (let i in this.model["organisations"]) {
        if (!(this.model.organisations[i]["id"] in parent_keys)) {
          parents.push({
            val: this.model["organisations"][i]["id"],
            label: this.model["organisations"][i]["name"],
          });
          parent_keys.push(this.model["organisations"][i]["id"]);
        }
      }
      for (let i in this.dataset) {
        if (!(this.dataset[i]["id"] in parent_keys)) {
          parents.push({
            val: this.dataset[i]["id"],
            label: this.dataset[i]["text"],
          });
          parent_keys.push(this.dataset[i]["id"]);
        }
      }
      return parents;
    },
  },
  data() {
    return {
      schema: {
        type: "object",
        title: "Organisations",
        properties: {
          organisations: {
            type: "array",
            title: "Organisation",
            items: {
              type: "object",
              properties: {
                shortName: {
                  type: "string",
                  title: "short name",
                },
                name: {
                  type: "string",
                  title: "name",
                  "x-display": "textarea",
                },
                dialCodes: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                people: {
                  type: "array",
                  items: {
                    title: "Person",
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      position: { type: "string" },
                    },
                    required: ["name"],
                  },
                },
                id: {
                  type: "string",
                  title: "ID",
                  readOnly: true,
                },
                parentId: {
                  type: "object",
                  title: "Parent Element",
                  "x-fromData": "context.allParents",
                  "x-itemKey": "val",
                  "x-itemTitle": "label",
                },
                required: ["name"],
              },
            },
          },
        },
      },
      idx: 0,
      previewImage: null,
      annotations: null,
      valid: null,
      model: null,
      isLoading: false,
      results: {},
    };
  },
};
</script>

<style scoped></style>
