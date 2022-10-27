<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { getAreas, getBarScore, getTableScore } from "./api";

import BarChart from "./components/barChart";

import type { Area, BarScore, TableScore } from "./types";

const areaOptions = ref<Area[]>([]);
const formValue = ref({
  areas: undefined,
  fromDate: undefined,
  toDate: undefined,
});

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

const tableAreas = computed(() =>
  tableData.value
    ? tableData.value[0].compliance.map((comply) => {
        return comply.area_name;
      })
    : []
);

const dateDisabled = (ts: number) => {
  return formValue.value.fromDate ? ts <= formValue.value.fromDate : false;
};

const filterData = async () => {
  console.log(
    formValue.value.areas,
    formValue.value.fromDate,
    formValue.value.toDate
  );
  barChartDataLoaded.value = false;
  barChartData.value = await getBarScore(
    formValue.value.areas,
    formValue.value.fromDate,
    formValue.value.toDate
  );
  barChartDataLoaded.value = true;

  tableData.value = await getTableScore(
    formValue.value.areas,
    formValue.value.fromDate,
    formValue.value.toDate
  );
};

onMounted(async () => {
  areaOptions.value = await getAreas();

  await filterData();
});
</script>

<template>
  <main>
    <n-form :model="formValue" inline>
      <n-form-item class="area-input">
        <n-select
          v-model:value="formValue.areas"
          multiple
          :options="areaOptions"
          label-field="area_name"
          value-field="area_id"
          path="areas"
          placeholder="Select Area"
        />
      </n-form-item>
      <n-form-item>
        <n-date-picker
          v-model:value="formValue.fromDate"
          type="date"
          path="fromDate"
          placeholder="From Date"
        />
      </n-form-item>
      <n-form-item>
        <n-date-picker
          v-model:value="formValue.toDate"
          type="date"
          :disabled="!formValue.fromDate"
          :is-date-disabled="dateDisabled"
          path="toDate"
          placeholder="To Date"
        />
      </n-form-item>
      <n-form-item>
        <n-button @click="filterData">Apply</n-button>
      </n-form-item>
    </n-form>
    <BarChart
      :labels="barLabels"
      :values="barValues"
      v-if="barChartDataLoaded"
    />
    <n-table class="table-score">
      <thead>
        <th>Brand</th>
        <th v-for="(area, index) in tableAreas" :key="index">{{ area }}</th>
      </thead>
      <tbody>
        <tr v-for="data in tableData" :key="data.brand_id">
          <td>{{ data.brand_name }}</td>
          <td v-for="comply in data.compliance" :key="comply.area_id">
            {{ comply.percentage }}
          </td>
        </tr>
      </tbody>
    </n-table>
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
