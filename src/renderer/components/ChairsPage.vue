<template>
  <div ref="wrapper">
    <v-layout align-center>
      <v-spacer></v-spacer>
      <v-btn color="red darken-2" dark @click="refresh">
        <v-icon>refresh</v-icon>
        <span>초기화</span>
      </v-btn>
    </v-layout>
    <v-layout class="my-4">
      <v-spacer></v-spacer>
      <v-flex>
        <v-card>
          <v-tabs v-model="active" color="white" slider-color="pink">
            <v-tab v-for="(tab, n) in tabs" :key="n" ripple active-class="teal darken-3 white--text">{{ tabsText[n] }}</v-tab>
            <v-tab-item v-for="(tab, n) in tabs" :key="n">
              <v-card-text>
                <v-layout v-for="( row, rIdx ) in chairs[tabs[active]]" :key="`table-${active}-row-${rIdx}`">
                  <div  class="text-xs-center chair"
                        :class="{ teal: col.value > 0 && !col.seated, aisle: col.value === 0, exit: col.value === -1, pink: col.seated }" 
                        :style="{ width: `${boxWidth}px`, height: `${boxWidth}px`, margin: `${Math.round(boxWidth / 20)}px`}"
                        v-for="(col, cIdx) in row" 
                        @click="setChair(col)"
                        :key="`table-${active}-row-${rIdx}-col-${cIdx}`">
                    <span :style="{ fontSize: `${boxWidth / 3}px` }">
                      {{ col.value > 0 ? col.value : '' }}
                    </span>
                  </div>
                </v-layout>
              </v-card-text>
            </v-tab-item>
          </v-tabs>
          <v-card-actions>
            <div class="legend">
              <div :style="{ width: `${boxWidth / 2.5}px`, height: `${boxWidth / 2.5}px`, margin: `${Math.round(boxWidth / 20)}px`}" class="teal legend"></div>
              <h3>공석({{vacantChairs}})</h3>
            </div>
            <div class="legend">
              <div :style="{ width: `${boxWidth / 2.5}px`, height: `${boxWidth / 2.5}px`, margin: `${Math.round(boxWidth / 20)}px`}" class="pink legend"></div>
              <h3>사용중({{seatedChairs}})</h3>
            </div>
            <div class="legend">
              <div :style="{ width: `${boxWidth / 2.5}px`, height: `${boxWidth / 2.5}px`, margin: `${Math.round(boxWidth / 20)}px`}" class="black legend"></div>
              <h3>출입구</h3>
            </div>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-spacer></v-spacer>
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
            {{ tabsText[active] }} 의 {{ selectedChair.value }}번 자리를 {{ !selectedChair.seated ? '입석' : '공석' }} 처리 하시겠습니까?
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
    
    

    <!-- <v-tabs
      v-model="active"
      color="cyan"
      dark
      slider-color="yellow"
    >
      <v-tab
        v-for="n in 3"
        :key="n"
        ripple
      >
        Item {{ n }}

      </v-tab>
      <v-tab-item
        v-for="n in 3"
        :key="n"
      >
        <v-card flat>
          <v-card-text>{{ text }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs> -->


  </div>
</template>

<script>
export default {
  name: 'chairs-page',
  data() {
    return {
      active: null,
      dialog: false,
      tabs: ['male', 'female'],
      tabsText: ['남자층(3층)', '여자층(2층)'],
      selectedChairOrigin: null,
      chairs: {
        male: [
          [0, 38, 33, 0, 32, 29, 0, 28, 23, 0, 22, 11, 0, 10, 1, 0],
          [0, 37, 34, 0, 31, 30, 0, 27, 24, 0, 21, 12, 0, 9, 2, 0],
          [0, 36, 35, 0, 0, 0, 0, 26, 25, 0, 20, 13, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 14, 0, 8, 3, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 15, 0, 7, 4, 0],
          [0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 17, 16, 0, 6, 5, 0],
        ],
        female: [
          [0, 40, 35, 0, 34, 31, 0, 30, 25, 0, 24, 13, 0, 12, 1, 0],
          [0, 39, 36, 0, 33, 32, 0, 29, 26, 0, 23, 14, 0, 11, 2, 0],
          [0, 38, 37, 0, 0, 0, 0, 28, 27, 0, 22, 15, 0, 10, 3, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 16, 0, 9, 4, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 17, 0, 8, 5, 0],
          [0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 19, 18, 0, 7, 6, 0],
        ],
      },
      boxWidth: 100,
    };
  },
  created() {
    this.chairs.male = this.charisToData(this.chairs.male)
    this.chairs.female = this.charisToData(this.chairs.female)
  },
  mounted() {
    this.setBoxSize()
  },
  computed: {
    selectedChair() {
      return this.selectedChairOrigin ? this.selectedChairOrigin : {}
    },
    vacantChairs() {
      if (typeof this.active === 'number' && this.tabs[this.active]) {
        return this.chairs[this.tabs[this.active]]
          .reduce((cnt, row) => cnt + row.reduce((a, b) => a + (b.value > 0 && !b.seated), 0), 0)
      }
      return 0
    },
    seatedChairs() {
      if (typeof this.active === 'number' && this.tabs[this.active]) {
        return this.chairs[this.tabs[this.active]]
          .reduce((cnt, row) => cnt + row.reduce((a, b) => a + (b.value > 0 && b.seated), 0), 0)
      }
      return 0
    },
  },
  methods: {
    charisToData(chairs) {
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
      this.boxWidth = this.$el.offsetWidth / 20
    },
    refresh() {
      Object.values(this.chairs).forEach((floor) => {
        floor.forEach((row) => {
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
