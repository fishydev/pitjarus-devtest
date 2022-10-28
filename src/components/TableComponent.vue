<script setup lang="ts">
defineProps<{
  heads: string[];
  rows: string[][];
}>();
</script>

<template>
  <main>
    <n-table class="table-score">
      <thead>
        <th v-for="(label, index) in heads" :key="index">{{ label }}</th>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="index">
          <td v-for="(data, index) in row" :key="index">
            {{ data }}
          </td>
        </tr>
      </tbody>
    </n-table>
  </main>
</template>
