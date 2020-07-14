<template>
  <page-layout>
    <template #header>
      <van-dropdown-menu class="van-hairline--bottom">
        <van-dropdown-item
          v-model="selectedOption"
          :options="options"
        />
      </van-dropdown-menu>
    </template>
    <template #body>
      <van-collapse
        v-model="activeCharts"
      >
        <van-collapse-item
          title="意见与建议总览统计图"
          name="1"
        >
          <canvas ref="chart1" />
        </van-collapse-item>
        <van-collapse-item
          title="意见处理统计图"
          name="2"
        >
          <canvas ref="chart2" />
        </van-collapse-item>
        <van-collapse-item
          title="建议处理统计图"
          name="3"
        >
          <canvas ref="chart3" />
        </van-collapse-item>
      </van-collapse>
    </template>
  </page-layout>
</template>

<script>
import Chart from 'chart.js';

export default {
  data() {
    return {
      options: [
        { text: '本周', value: '本周' },
        { text: '本月', value: '本月' },
        { text: '本季度', value: '本季度' },
        { text: '本年', value: '本年' },
      ],
      selectedOption: '本周',
      activeCharts: ['1', '2', '3'],
      charts: [],
    };
  },
  mounted() {
    console.log(this.$refs.chart);
    const chart1 = new Chart(this.$refs.chart1, {
      type: 'pie',
      data: {
        labels: ['意见', '建议'],
        datasets: [{
          backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 205, 86, 1)', 'rgba(127, 255, 212, 1)'],
          borderWidth: 1,
          data: [5, 10],
        }],
      },
      options: {
        legend: {
          position: 'bottom',
        },
      },
    });
    this.charts.push(chart1);
    const chart2 = new Chart(this.$refs.chart2, {
      type: 'pie',
      data: {
        labels: ['意见', '建议'],
        datasets: [{
          backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 205, 86, 1)', 'rgba(127, 255, 212, 1)'],
          borderWidth: 1,
          data: [5, 10],
        }],
      },
      options: {
        legend: {
          position: 'bottom',
        },
      },
    });
    this.charts.push(chart2);
    const chart3 = new Chart(this.$refs.chart3, {
      type: 'pie',
      data: {
        labels: ['意见', '建议'],
        datasets: [{
          backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 205, 86, 1)', 'rgba(127, 255, 212, 1)'],
          borderWidth: 1,
          data: [5, 11],
        }],
      },
      options: {
        legend: {
          position: 'bottom',
        },
      },
    });
    this.charts.push(chart3);
  },
};
</script>
