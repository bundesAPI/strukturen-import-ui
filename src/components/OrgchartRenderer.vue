<template>
  <div ref="svgElementContainer"></div>
</template>

<script>
import { OrgChart } from "d3-org-chart";

export default {
  name: "OrgchartRenderer",
  props: ["data"],
  data() {
    return {
      chartReference: null,
    };
  },
  watch: {
    data(value) {
      console.log("update data");
      this.renderChart(this.prepareData(value));
    },
  },
  mounted() {},
  methods: {
    prepareData(data) {
      let lst = [];
      // add top parent element
      lst.push({
        id: "-1",
        organisation: { shortName: "Top Node", name: "Ignore me" },
        parentId: null,
      });
      for (let i in data) {
        lst.push({
          id: data[i].organisation.id,
          organisation: data[i].organisation,
          parentId:
            data[i].organisation.parentId.val == null
              ? "-1"
              : data[i].organisation.parentId.val,
        });
      }
      return lst;
    },
    renderChart(data) {
      if (!this.chartReference) {
        this.chartReference = new OrgChart();
      }
      this.chartReference
        .container(this.$refs.svgElementContainer) // node or css selector
        .data(data)
        // eslint-disable-next-line no-unused-vars
        .nodeHeight((d) => 120)
        .onNodeClick((d) => console.log(d + " node clicked"))

        // eslint-disable-next-line no-unused-vars
        .nodeContent(function (d, i, arr, state) {
          const color = "#FFFFFF";
          console.log(d);
          return `
            <div style="font-family: 'Inter', sans-serif;background-color:${color}; position:absolute;margin-top:-1px; margin-left:-1px;width:${d.width}px;height:${d.height}px;border-radius:10px;border: 1px solid #E4E2E9">

              <div style="color:#08011E;position:absolute;right:20px;top:17px;font-size:10px;"><i class="fas fa-ellipsis-h"></i></div>

              <div style="font-size:15px;color:#08011E;margin-left:20px;margin-top:32px">${
                d.data.organisation.shortName
                  ? d.data.organisation.shortName
                  : d.data.organisation.name
              }</span></div>
              <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;"> ${
                d.data.organisation.shortName ? d.data.organisation.name : ""
              } </div>


           </div>
  `;
        })
        .render();
      this.chartReference.expandAll();
    },
  },
};
</script>
