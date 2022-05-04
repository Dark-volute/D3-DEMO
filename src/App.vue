<script setup lang="ts">
import * as d3 from "d3";
import { onMounted, ref } from "@vue/runtime-core";
import { mount, createDiv } from "./utils.js";
import towLine from './components/line/line';

const component = ref(towLine)

onMounted(async () => {
  // const svg = createRenderer(600, 600);
  // svg.translate(0, 600);
  // svg.scale(1, -1);
  //mount(createDiv(), svg); 
  towLine()
});
</script>

<template>
  <div class="tooltips"></div>
</template>

<style>
*{
  margin: 0;
  padding: 0;
}

.flex {
  stroke-dasharray: 1000;
  stroke-dashoffset: 0;
  animation: flex-draw 3s ease-in-out;
  -webkit-animation: flex-draw 3s ease-in-out;
}

@keyframes flex-draw {
  from {
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.tooltips {
  visibility: hidden;
  padding: 6px 12px;
  position: absolute;
  left: 0;
  top: 0;
  height: 40px;
  line-height: 40px;
  min-width: 60px;
  text-align: center;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff
}
</style>
