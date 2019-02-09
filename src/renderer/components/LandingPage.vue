<template>
  <v-layout column fill-height align-center>
    <v-layout justify-center>
      <h1 style="visibility:none;">
        &nbsp;
      </h1>
    </v-layout>
    <v-layout class="my-4" justify-center>
      <img id="logo" src="~@/assets/ycg.jpeg" width="200" height="200" alt="electron-vue">
    </v-layout>
    <v-layout justify-center>
      <h1>
        독서실 자리 배정 프로그램
      </h1>
    </v-layout>

    <v-layout justify-center>
      <v-btn to="/chairs" color="primary" large>좌석 선택</v-btn>
    </v-layout>
    
    <v-layout justify-center class="my-5">
      <p>만든이: <b>임수근</b> </p>
    </v-layout>
    <v-layout class="red--text darken-2">
      <b>주의) 프로그램 종료시 데이터가 삭제됩니다.</b>
    </v-layout>
  </v-layout>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation';

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    methods: {
      open(link) {
        // this.$electron.link
        this.$electron.shell.openExternal(link);
      },
    },
  };
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    /* height: 100vh; */
    /* padding: 60px 80px; */
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
