<template>
  <div>
    <div class="block">
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="Pick a date">
      </el-date-picker>
      <el-button type="primary" icon="el-icon-download" @click="saveLogs">Export</el-button>
    </div>
    <el-divider></el-divider>
    <div :id="bird.name" class="birdLog" v-for="bird in birds" :key="bird.id">
      <h3>
        <el-avatar :src="bird.picture" fit="fill"></el-avatar>
        {{ bird.name }}
      </h3>
      <el-table
        :data="filterLogsByBird(bird)"
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
import { saveAs } from 'file-saver'

const groupEntriesByEvent = logs => {
  const pairs = []
  logs.forEach((entry, idx) => {
    if (entry.event === 'Sign Out') {
      pairs.push({ signOut: entry, signIn: logs[idx+1]})
    }
  })
  return pairs
}

export default {
  name: 'BirdLog',
  computed: {
    birdMap() {
      return this.$store.state.birds
    },
    birds() {
      return this.$store.getters.birdList
    },
    log() {
      return this.$store.state.log
    },
    filteredLogs() {
      return this.log.filter(e => {
        const entryTime = dayjs(e.time)
        const selectedTime = dayjs(this.date)
        return entryTime.format('YYYYMMDD') === selectedTime.format('YYYYMMDD')
      })
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
    filterLogsByBird(bird) {
      return this.filteredLogs.filter(e => {
        return e.bird === bird.id
      })
    },
    saveLogs() {
      const txt = this.birds.map(b => {
        const birdLogs = this.filterLogsByBird(b)
        if (birdLogs.length) {
          return [
            b.name,
            '============',
            groupEntriesByEvent(birdLogs).map(e => {
              const itxt = `Signed out ${dayjs(e.signOut.time).format('h:ma')} - ${dayjs(e.signIn.time).format('h:ma')}. Reason: ${e.signOut.reason}.`
              if (e.signOut.user) {
                return `${itxt} Employee: ${e.signOut.user}.`
              }
              return itxt
            }).join('\n')
          ].join('\n')
        }
      })
      .filter(l => l)
      .join('\n\n')
      const blob = new Blob([txt], {type: "text/plain;charset=utf-8"})
      saveAs(blob, `${dayjs(this.date).format('MMM D YYYY')} - Bird Activity.txt`)
    },
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
