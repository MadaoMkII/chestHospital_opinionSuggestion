<template>
  <page-layout>
    <template #header>
      <van-dropdown-menu
        class="van-hairline--bottom"
      >
        <van-dropdown-item
          @change="updateCharts"
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
      chartData: [],
    };
  },
  async mounted() {
    this.chartData = await this.fetchStatisticData({ period: this.selectedOption });
    const chart1 = new Chart(this.$refs.chart1, {
      type: 'pie',
      data: {
        labels: this.chartData.char1Data.labels,
        datasets: [{
          backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 205, 86, 1)', 'rgba(127, 255, 212, 1)'],
          borderWidth: 1,
          data: this.chartData.char1Data.datasets,
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
        labels: this.chartData.char2Data.labels,
        datasets: [{
          backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 205, 86, 1)', 'rgba(127, 255, 212, 1)'],
          borderWidth: 1,
          data: this.chartData.char2Data.datasets,
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
        labels: this.chartData.char3Data.labels,
        datasets: [{
          backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 205, 86, 1)', 'rgba(127, 255, 212, 1)'],
          borderWidth: 1,
          data: this.chartData.char3Data.datasets,
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
  methods: {
    async fetchStatisticData(params) {
      const response = await this.$axios.get('/api/opinionSuggestion/getOpinionSuggestionCharts', {
        params,
      });
      return response.data.data;
    },
    async updateCharts() {
      this.chartData = await this.fetchStatisticData({ period: this.selectedOption });
      this.charts[0].data.labels = this.chartData.char1Data.labels;
      this.charts[0].data.datasets[0].data = this.chartData.char1Data.datasets;
      this.charts[0].update();

      this.charts[1].data.labels = this.chartData.char2Data.labels;
      this.charts[1].data.datasets[0].data = this.chartData.char2Data.datasets;
      this.charts[1].update();

      this.charts[2].data.labels = this.chartData.char3Data.labels;
      this.charts[2].data.datasets[0].data = this.chartData.char3Data.datasets;
      this.charts[2].update();
    },
  },
};
</script>
