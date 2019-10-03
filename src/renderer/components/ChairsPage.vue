<template>
  <div ref="wrapper" style="height: 100%;width:100%">
    <v-layout align-center>
      <v-spacer></v-spacer>
      <v-btn color="red darken-2" dark small @click="refresh">
        <v-icon>refresh</v-icon>
        <span>초기화</span>
      </v-btn>
    </v-layout>
    <v-layout align-center align-content-center fill-height>
      <v-flex>
        <v-card style="height:100%;width:100%">
          <v-tabs v-model="active" color="white" slider-color="pink">
            <v-tab v-for="room in rooms" :key="room.key" ripple active-class="teal darken-3 white--text">{{ room.title }}</v-tab>
            <v-tab-item v-for="room in rooms" :key="room.key">
              <v-card-text>
                <v-layout align-content-center>
                <v-spacer></v-spacer>
                <v-flex style="border: 2px dotted rgba(100, 100 ,100, .7);border-radius:5px;">
                  <v-layout v-for="( row, rIdx ) in room.chairs" :key="`table-${active}-row-${rIdx}`" justify-center>
                    <div  class="text-xs-center chair"
                          :class="{ teal: col.value > 0 && !col.seated, aisle: col.value === 0, exit: col.value === -1, pink: col.seated }" 
                          :style="{ width: `${boxWidth}px`, height: `${boxWidth}px`, margin: `${Math.round(boxWidth / 20)}px`}"
                          v-for="(col, cIdx) in row" 
                          @click="setChair(col)"
                          :key="`table-${active}-row-${rIdx}-col-${cIdx}`">
                      <span :style="{ fontSize: `${Math.max(boxWidth / 3, 20)}px` }">
                        {{ col.value > 0 ? col.value : '' }}
                      </span>
                    </div>
                  </v-layout>
                </v-flex>
                <v-spacer></v-spacer>
                </v-layout>
              </v-card-text>
            </v-tab-item>
          </v-tabs>
          <v-card-actions>
            <div class="legend">
              <div :style="{ width: `${boxWidth / 1.5}px`, height: `${boxWidth / 1.5}px`, margin: `${Math.round(boxWidth / 20)}px`}" class="teal legend"></div>
              <h3>공석({{vacantChairs}})</h3>
            </div>
            <div class="legend">
              <div :style="{ width: `${boxWidth / 1.5}px`, height: `${boxWidth / 1.5}px`, margin: `${Math.round(boxWidth / 20)}px`}" class="pink legend"></div>
              <h3>사용중({{seatedChairs}})</h3>
            </div>
            <div class="legend">
              <div :style="{ width: `${boxWidth / 1.5}px`, height: `${boxWidth / 1.5}px`, margin: `${Math.round(boxWidth / 20)}px`}" class="black legend"></div>
              <h3>출입구</h3>
            </div>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>


    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-toolbar card color="primary" dense dark>
          <v-toolbar-title>
            확인 안내
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="text-xs-center py-5">
          <h3>
            {{ (activeRoom || {}).title }} 의 {{ selectedChair.value }}번 자리를 {{ !selectedChair.seated ? '입석' : '공석' }} 처리 하시겠습니까?
          </h3>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small flat color="red" @click="dialog = false">취소</v-btn>
          <v-btn small color="primary" @click="checkChair">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import rooms from '../assets/rooms.json'
export default {
  name: 'chairs-page',
  data() {
    return {
      active: 0,
      dialog: false,
      selectedChairOrigin: null,
      rooms: rooms.map(room => ({ ...room, chairs: this.chairsToData(room.chairs) })),
      boxWidth: 60,
    };
  },
  mounted() {
    this.setBoxSize()
  },
  computed: {
    activeRoom() {
      return this.rooms[this.active]
    },
    selectedChair() {
      return this.selectedChairOrigin ? this.selectedChairOrigin : {}
    },
    vacantChairs() {
      if (this.activeRoom) {
        return this.activeRoom.chairs
          .reduce((cnt, row) => cnt + row.reduce((a, b) => a + (b.value > 0 && !b.seated), 0), 0)
      }
      return 0
    },
    seatedChairs() {
      if (this.activeRoom) {
        return this.activeRoom.chairs
          .reduce((cnt, row) => cnt + row.reduce((a, b) => a + (b.value > 0 && b.seated), 0), 0)
      }
      return 0
    },
  },
  methods: {
    chairsToData(chairs) {
      return chairs.map(d => d.map(c => ({ value: c, seated: false })))
    },
    setChair(chair) {
      this.selectedChairOrigin = chair
      this.dialog = true
    },
    checkChair() {
      this.selectedChairOrigin.seated = !this.selectedChairOrigin.seated
      this.dialog = false
    },
    setBoxSize() {
      let width = Math.min(this.$el.offsetWidth, this.$el.offsetHeight) / 1.5
      width /= this.activeRoom.chairs.length
      this.boxWidth = width
    },
    refresh() {
      this.rooms.forEach((room) => {
        room.chairs.forEach((row) => {
          row.forEach((col) => {
            col.seated = false
          })
        })
      })
    },
  },
  beforeMount() {
    window.addEventListener('resize', this.setBoxSize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setBoxSize)
  },
};
</script>

<style lang="scss">
  .chair {
    align-items:center;
    justify-content: center;
    display:flex;
    position: relative;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      &::before {
        content: '';
        width: 100%;
        height: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
        background-color: rgba(200, 200, 200, .5);
      }
    }

    &.aisle {
      cursor: default;
      background-color: transparent!important;
      pointer-events: none;
      &::before,
      &::after {
        display: none;
      }
    }

    &.exit {
      pointer-events: none;
      background-color: black!important;
      border: 0;
    }

    span {
      color: white;
      z-index: 20;
    }
  }

  .legend {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 15px;

    div {
      border-radius: 3px;
    }
  }
</style>
