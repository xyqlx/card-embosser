<script setup lang="ts">
import { onMounted, ref } from 'vue';

const maxImageNumber = 10;
const imageIds = ref<string[]>([]);

onMounted(async () => {
  const response = await fetch(`/api/image/unused/desc/${maxImageNumber}`);
  const data = await response.json();
  imageIds.value = data.map((document: any) => document._id);
});
</script>

<template>
  <div v-if="imageIds.length === 0">
    <h1>没有未使用的图片</h1>
  </div>
  <div class="main-container">
    <div v-for="imageId of imageIds" :key="imageId" class="image-container">
      <img :src="'/api/image/' + imageId" :alt="imageId">
    </div>
  </div>
</template>

<style scoped>
</style>
