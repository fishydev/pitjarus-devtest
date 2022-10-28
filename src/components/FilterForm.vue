<script setup lang="ts">
import { onMounted, ref, toRaw } from "vue";
import { getAreas } from "../api";
import type { Area } from "../types";
const emit = defineEmits(["filterData"]);
const areaOptions = ref<Area[]>([]);
const formValue = ref({
  areas: undefined,
  fromDate: undefined,
  toDate: undefined,
});

const dateDisabled = (ts: number) => {
  return formValue.value.fromDate ? ts <= formValue.value.fromDate : false;
};

const submitFilter = () => {
  emit("filterData", toRaw(formValue.value));
};

onMounted(async () => {
  areaOptions.value = await getAreas();
});
</script>

<template>
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
      <n-button @click="submitFilter">Apply</n-button>
    </n-form-item>
  </n-form>
</template>
