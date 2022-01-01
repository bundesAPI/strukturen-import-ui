<template>
  <v-app>
    <v-stepper v-model="e1">
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" :step="1">
          Assign Parents
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" :step="2">
          Review NER
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :step="3"> Review Result </v-stepper-step>
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
          <OrgchartAnnotationEditor
            ref="orgchart_annotation_editor"
            :orgchart_id="$route.params.id"
            :dataset="dataset"
            :parents="parents"
            @annotationDone="annotationDone"
          ></OrgchartAnnotationEditor>
          <br />
        </v-stepper-content>

        <v-stepper-content :step="3">
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

export default {
  name: "App",

  components: {
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
    annotationDone: function (orgs) {
      this.json = orgs;
      this.e1 = 3;
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
    json: null,
    snackbar: false,
    snackText: null,
    snackTimeout: 2000,
  }),
};
</script>
