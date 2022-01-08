<template>
  <div>
    <v-col cols="12" sm="12">
      <v-form v-model="valid">
        <v-jsf
          v-model="model"
          :options="{ editMode: 'inline', context: this }"
          :schema="schema"
        />
      </v-form>
      <v-btn color="primary" @click="done()">Continue </v-btn>
    </v-col>
  </div>
</template>

<script>
import * as AUTH from "../auth";

export default {
  name: "OrgchartParserConfiguration",
  props: ["id"],
  computed: {
    allLocations() {
      let locations = [];
      let locList =
        this.orgChart.orgChartUrl.organisationEntity.locations.edges;
      for (let l in locList) {
        locations.push({
          val: locList[l].node.id,
          label: ` ${locList[l].node.city} - ${locList[l].node.name}, ${locList[l].node.street}`,
        });
      }
      return locations;
    },
    allColors() {
      let colors = {};
      let source = JSON.parse(this.orgChart["rawSource"]);
      for (let i in source) {
        for (let c in source[i].source.colors) {
          if (!(source[i].source.colors[c] in colors)) {
            colors[source[i].source.colors[c]] = 1;
          } else {
            colors[source[i].source.colors[c]] += 1;
          }
        }
      }
      var sortableColors = [];
      for (let i in colors) {
        sortableColors.push([i, colors[i]]);
      }

      sortableColors
        .sort(function (a, b) {
          return a[1] - b[1];
        })
        .reverse();
      sortableColors = sortableColors.slice(0, 50);
      console.log(sortableColors);
      let sortedColors = [];
      for (let s in sortableColors) {
        sortedColors.push({
          label: `${sortableColors[s][1]} (rgb(${sortableColors[s][0]}))`,
          val: sortableColors[s][0],
          svg:
            '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-map-marker" width="24" height="24" viewBox="0 0 24 24"> <rect width="24" height="24" style="fill:rgb(' +
            sortableColors[s][0] +
            ')" /></svg>',
        });
      }
      console.log(sortedColors);
      return sortedColors;
    },
  },
  methods: {
    done() {
      this.$emit("configurationDone", this.model);
    },
  },
  data() {
    return {
      valid: null,
      model: null,
      schema: {
        type: "object",
        title: "Select a mapping type",
        description: "Address Mapping",
        oneOf: [
          {
            title: "No Mapping",
            properties: {
              locationMapping: {
                type: "string",
                const: "none",
              },
            },
          },
          {
            title: "Default Mapping",
            properties: {
              locationMapping: {
                type: "string",
                const: "defaultAddressMapping",
              },
              location: {
                type: "object",
                title: "Location",
                "x-fromData": "context.allLocations",
                "x-itemKey": "val",
                "x-itemTitle": "label",
              },
            },
          },
          {
            title: "Color-based Mapping",
            properties: {
              locationMapping: {
                type: "string",
                const: "colorBasedMapping",
              },
              mappings: {
                type: "array",
                title: "Mapping",
                items: {
                  type: "object",
                  properties: {
                    location: {
                      type: "object",
                      title: "Location",
                      "x-fromData": "context.allLocations",
                      "x-itemKey": "val",
                      "x-itemTitle": "label",
                    },
                    color: {
                      type: "object",
                      title: "Color",
                      "x-fromData": "context.allColors",
                      "x-itemKey": "val",
                      "x-itemTitle": "label",
                      "x-itemIcon": "svg",
                    },
                    required: ["location", "color"],
                  },
                },
              },
            },
          },
        ],
      },
    };
  },
  apollo: {
    orgChart: {
      query() {
        return require("../graphql/orgChart.gql");
      },
      skip() {
        return AUTH.isLoggedIn() === false;
      },
      variables() {
        return {
          id: this.$props.id,
        };
      },
    },
  },
};
</script>

<style scoped></style>
