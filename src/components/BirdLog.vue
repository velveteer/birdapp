<template>
  <div>
    <div class="block">
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="Pick a date">
      </el-date-picker>
      <el-button type="primary" icon="el-icon-download" @click="saveLogs">Export</el-button>
      <!-- <el-button>Add Manual Log Entry</el-button> -->
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
          sortable
          prop="time"
          label="Date"
          v-slot="sp">
          <div v-if="editMode[sp.row.id]">
            <el-time-picker
              v-model="editData[sp.row.id].time"
              :clearable="false"
              size="small"
              :default-value="editData[sp.row.id].time"
              :picker-options="{
                format: 'h:mma'
              }"
              @change="updateLog(sp.row)"
              placeholder="Edit time">
            </el-time-picker>
          </div>
          <div v-else>
            {{ formatTime(sp.row.time) }}
          </div>
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
        <el-table-column v-slot="sp"
          label="Actions">
          <el-button size="small"
                     :type="getEditButtonType(sp.row)"
                     icon="el-icon-edit"
                     @click="editLog(sp.row)">
          </el-button>
          <el-button size="small"
                     :type="getDeleteButtonType(sp.row)"
                     icon="el-icon-delete"
                     @click="deleteLog(sp.row)">
          </el-button>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'

export default {
  name: 'BirdLog',
  computed: {
    birds() {
      return this.$store.state.birds
    },
    log() {
      return this.$store.getters.sortedLog
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
      date: dayjs().format('YYYY-M-DD'),
      primed: {},
      timeouts: {},
      editMode: {},
      editData: {},
    }
  },
  methods: {
    deleteLog(row) {
      if (this.primed[row.id] === 2) {
        this.$store.dispatch('deleteLogEntry', row)
        this.$delete(this.primed, row.id)
      } else {
        this.$set(this.primed, row.id, (this.primed[row.id] || 0) + 1)
        clearTimeout(this.timeouts[row.id])
        this.timeouts[row.id] = setTimeout(() => {
          this.$delete(this.primed, row.id)
          this.$delete(this.timeouts, row.id)
        }, 4000)
      }
    },
    editLog(row) {
      if (this.editMode[row.id]) {
        this.$delete(this.editMode, row.id)
        this.$delete(this.editData, row.id)
      } else {
        this.$set(this.editData, row.id, {})
        this.$set(this.editData[row.id], 'time', row.time)
        this.$set(this.editMode, row.id, true)
      }
    },
    updateLog(row) {
      const update = {
        time: dayjs(this.editData[row.id].time).format()
      }
      this.$store.dispatch('updateLogEntry', { id: row.id, update })
      this.$delete(this.editMode, row.id)
      this.$delete(this.editData, row.id)
    },
    formatTime(time) {
      return dayjs(time).format('h:mma')

    },
    filterLogsByBird(bird) {
      return this.filteredLogs.filter(e => {
        return e.bird === bird.id
      })
    },
    getDeleteButtonType(row) {
      if (this.primed[row.id] === 2) {
        return 'danger'
      }
      if (this.primed[row.id] === 1) {
        return 'warning'
      }
      return
    },
    getEditButtonType(row) {
      if (this.editMode[row.id]) {
        return 'primary'
      }
      return
    },
    saveLogs() {
      const txt = this.birds.map(b => {
        const birdLogs = this.filterLogsByBird(b)
        if (birdLogs.length) {
          return [
            b.name,
            '=====================',
            birdLogs.map(e => {
              let itxt = `${dayjs(e.time).format('h:mma')} -- ${e.event}.`
              if (e.reason) {
                itxt = `${itxt} ${e.reason}.`
              }
              if (e.user) {
                itxt = `${itxt} Employee: ${e.user}.`
              }
              return itxt
            }).filter(e => e).join('\n')
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

<style>
.block {
  padding-top: 20px;
  padding-bottom: 20px;
}
.block > .el-input {
  margin-right: 20px;
}
.el-avatar {
  vertical-align: middle !important;
}
.birdLog {
  margin-bottom: 40px !important;
}
.el-table .cell {
  word-break: keep-all !important;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: auto !important;
}
</style>
