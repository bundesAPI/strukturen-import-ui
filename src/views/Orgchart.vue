<template>
  <v-app>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" :step="1">
          Assign Parents
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" :step="2">
          Configure Parsing
        </v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 3" :step="3">
          Review NER
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :step="4"> Review Result </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content :step="1">
          <v-btn color="primary" @click="parentAssignmentDone()"
            >Continue
          </v-btn>
          <v-main>
            <OrgchartEditor
              ref="orgchart_editor"
              :id="$route.params.id"
            ></OrgchartEditor>
          </v-main>
        </v-stepper-content>
        <v-stepper-content :step="2">
          <v-main>
            <OrgchartParserConfiguration
              @configurationDone="configurationDone"
              :id="$route.params.id"
            ></OrgchartParserConfiguration>
          </v-main>
        </v-stepper-content>

        <v-stepper-content :step="3">
          <OrgchartAnnotationEditor
            ref="orgchart_annotation_editor"
            :orgchart_id="$route.params.id"
            :dataset="dataset"
            :parents="parents"
            :config="config"
            @annotationDone="annotationDone"
          ></OrgchartAnnotationEditor>
          <br />
        </v-stepper-content>

        <v-stepper-content :step="4">
          <v-btn color="primary" @click="saveOrgChart()">Save</v-btn>

          <OrgchartResult :json="json"></OrgchartResult>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-snackbar v-model="snackbar" :timeout="snackTimeout">
      {{ snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import OrgchartEditor from "./../components/OrgchartEditor";
import OrgchartAnnotationEditor from "../components/OrgchartAnnotationEditor";
import OrgchartResult from "../components/OrgchartResult";
import OrgchartParserConfiguration from "../components/OrgchartParserConfiguration";

export default {
  name: "App",

  components: {
    OrgchartParserConfiguration,
    OrgchartResult,
    OrgchartEditor,
    OrgchartAnnotationEditor,
  },

  methods: {
    parentAssignmentDone: function () {
      this.dataset = this.$refs.orgchart_editor.dataset;
      this.parents = this.$refs.orgchart_editor.parents;
      this.e1 = 2;
    },

    configurationDone: function (config) {
      console.log(config);
      this.config = config;
      this.e1 = 3;
    },

    annotationDone: function (orgs) {
      this.json = orgs;
      this.e1 = 4;
    },

    saveOrgChart() {
      this.$apollo
        .mutate({
          // Query
          mutation: require("../graphql/importOrgChart.gql"),
          // Parameters
          variables: {
            orgchartId: this.$route.params.id,
            rawJson: JSON.stringify(this.json),
          },
        }) // eslint-disable-next-line no-unused-vars
        .then((data) => {
          this.snackText = "Orgchart saved";
          this.snackbar = true;
          this.$router.push({ name: "blog" });
        })
        .catch((error) => {
          this.snackText = "An error occured while saving the orgchart" + error;
          this.snackbar = true;
        });
    },
  },

  data: () => ({
    e1: 1,
    dataset: [],
    parents: [],
    config: {},
    json: null,
    snackbar: false,
    snackText: null,
    snackTimeout: 2000,
  }),
};
</script>
