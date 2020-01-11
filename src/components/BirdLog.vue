<template>
  <div>
    <div class="block">
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="Pick a date">
      </el-date-picker>
    </div>
    <div :id="bird.name" class="birdLog" v-for="bird in birds" :key="bird.id">
      <h3>
        <el-avatar :src="bird.picture" fit="fill"></el-avatar>
        {{ bird.name }}
      </h3>
      <el-table
        :data="filterByDate(bird.log)"
        :default-sort = "{prop: 'time', order: 'descending'}"
        :max-height="250"
        stripe
        style="width: 100%">
        <el-table-column
          prop="time"
          sortable
          :formatter="formatTime"
          label="Date"
          width="180">
        </el-table-column>
        <el-table-column
          label="Name"
          width="180">
          {{ bird.name }}
        </el-table-column>
        <el-table-column
          prop="event"
          label="Event">
        </el-table-column>
        <el-table-column
          prop="reason"
          label="Reason">
        </el-table-column>
        <el-table-column
          prop="user"
          label="User">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'

dayjs.extend(dayOfYear)

export default {
  name: 'BirdLog',
  computed: {
    birds() {
      return this.$store.getters.birdList.filter(b => b.log.length > 0)
    },
  },
  data() {
    return {
      date: dayjs().format('YYYY-M-DD')
    }
  },
  methods: {
    formatTime(row, col, val) {
      return dayjs(val).format('MMM D, YYYY h:mma')

    },
    filterByDate(log) {
      return log.filter(e => dayjs(e.time).dayOfYear() === dayjs(this.date).dayOfYear())
    },
    getLink(str) {
      return `#${str}`
    }
  },
}
</script>

<style scoped>
.block {
  padding-top: 20px;
  padding-bottom: 20px;
}
.el-avatar {
  vertical-align: middle !important;
}
.birdLog {
  margin-bottom: 40px !important;
}
</style>
