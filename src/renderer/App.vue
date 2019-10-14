<template>
    <v-app>
      <v-toolbar app absolute card dense color="primary" dark clipped-left>
        <v-toolbar-side-icon @click="drawer = !drawer">
          <v-icon>menu</v-icon>
        </v-toolbar-side-icon>
        <v-toolbar-title>
          양천 청소년 독서실
        </v-toolbar-title>
      </v-toolbar>

      <v-navigation-drawer width="200" v-model="drawer" temporary app>
        <v-toolbar dense card>
          <v-toolbar-title>
            메뉴
          </v-toolbar-title>
        </v-toolbar>
        <v-list dense>
          <v-list-tile to="/">
            홈
          </v-list-tile>
          <v-list-tile to="/chairs">
            좌석 확인
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-container fluid style="margin-top: 48px;max-height: calc(100vh - 48px);width:100vw;padding:6px" class="white">
        <router-view></router-view>
      </v-container>
    </v-app>
</template>

<script>
  export default {
    name: 'electron-studyroom',
    data: () => ({
      drawer: false,
    }),
  };
</script>

<style>
  /* CSS */
</style>
