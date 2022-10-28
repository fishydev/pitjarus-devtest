<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { getAreas, getBarScore, getTableScore } from "./api";

import FilterForm from "./components/FilterForm.vue";
import BarChart from "./components/barChart";
import TableComponent from "./components/TableComponent.vue";

import type { Area, BarScore, TableScore, FilterQuery } from "./types";

const areaOptions = ref<Area[]>([]);

const barChartData = ref<BarScore[]>();
const tableData = ref<TableScore[]>();
const barChartDataLoaded = ref(false);

const barLabels = computed(() =>
  barChartData.value
    ? barChartData.value.map((data) => {
        return data.areaName;
      })
    : []
);

const barValues = computed(() =>
  barChartData.value
    ? barChartData.value.map((data) => {
        return data.percentage;
      })
    : []
);

const tableHeads = computed(() => {
  if (tableData.value) {
    let heads = ["Label"];
    heads.push(
      ...tableData.value[0].compliance.map((comply) => {
        return comply.area_name;
      })
    );
    return heads;
  } else return [];
});

const tableRows = computed(() =>
  tableData.value
    ? tableData.value.map((data) => {
        let row = [data.brand_name];
        row.push(
          ...data.compliance.map((comply) => {
            return `${comply.percentage}%`;
          })
        );

        return row;
      })
    : []
);

const filterHandler = (query: FilterQuery) => {
  filterData(query);
};

const filterData = async (data: FilterQuery) => {
  barChartDataLoaded.value = false;
  const { areas, from, to } = data;
  barChartData.value = await getBarScore(areas, from, to);
  barChartDataLoaded.value = true;

  tableData.value = await getTableScore(areas, from, to);
};

onMounted(async () => {
  areaOptions.value = await getAreas();
  await filterData({ areas: undefined, from: undefined, to: undefined });
});
</script>

<template>
  <main>
    <FilterForm @filter-data="filterHandler" />
    <BarChart
      :labels="barLabels"
      :values="barValues"
      v-if="barChartDataLoaded"
    />
    <TableComponent :heads="tableHeads" :rows="tableRows" />
  </main>
</template>

<style>
.area-input {
  flex-grow: 1;
}

.table-score {
  margin-top: 40px;
}
</style>
