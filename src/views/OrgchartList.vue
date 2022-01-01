<template>
  <v-simple-table>
    <thead>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-left">Status</th>
        <th class="text-left">Created at</th>
      </tr>
    </thead>
    <tbody v-if="allOrgCharts">
      <tr v-for="item in allOrgCharts.edges" :key="item.node.id">
        <td>
          <router-link :to="{ name: 'Orgchart', params: { id: item.node.id } }">
            {{ item.node.orgChartUrl.organisationEntity.name }}</router-link
          >
        </td>
        <td>{{ item.node.status }}</td>
        <td>{{ item.node.createdAt }}</td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
import * as AUTH from "../auth";

export default {
  name: "OrgchartList",

  apollo: {
    allOrgCharts: {
      query() {
        return require("../graphql/listOrgCharts.gql");
      },
      skip() {
        return AUTH.isLoggedIn() === false;
      },
    },
  },
};
</script>

<style scoped></style>
