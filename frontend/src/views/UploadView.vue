<script setup lang="ts">
import { ref, toRef } from 'vue';
import type { Ref } from 'vue';
import { EImageType, compress, } from 'image-conversion';

const imageUrl: Ref<string> = toRef("");
const uploadInput: Ref<HTMLInputElement | null> = ref(null);
const shotInput: Ref<HTMLInputElement | null> = ref(null);

function triggerUpload() {
  uploadInput.value?.click();
}

function triggerShot() {
  shotInput.value?.click();
}

async function compressImage(file: File, maxSize: number) {
  // 获取图片的长和宽
  const image = new Image();
  image.src = URL.createObjectURL(file);
  await image.decode();
  const { width, height } = image;
  // 如果长和宽的最大值超过maxSize，则设置新的长和宽
  let [newWidth, newHeight] = [width, height];
  if (width > maxSize || height > maxSize) {
    if (width > height) {
      newWidth = maxSize;
      newHeight = Math.round((maxSize * height) / width);
    } else {
      newHeight = maxSize;
      newWidth = Math.round((maxSize * width) / height);
    }
  }
  // 压缩图片
  return await compress(file, { width: newWidth, height: newHeight, quality: 0.7, type: EImageType.JPEG });
}

async function upload($event: Event) {
  const files = ($event.target as any)?.files as (FileList | null); // 获取选择的文件
  if (!files || files.length === 0) {
    return;
  }
  const reader = new FileReader(); // 创建FileReader对象
  reader.onload = function (e: Event) {
    imageUrl.value = (e.target as any).result as string; // 设置图片预览的src属性
  };

  // 读取文件
  if (files[0]) {
    reader.readAsDataURL(files[0]);
  }

  // TODO 考虑前后端支持流式上传

  // 压缩所有图片
  const compressed = await Promise.all(Array.from(files).map((file: File) => compressImage(file, 1024)));
  const thumbnails = await Promise.all(Array.from(files).map((file: File) => compressImage(file, 128)));

  // 上传文件
  const formData = new FormData();
  compressed.forEach((file, index) => {
    formData.append("image", file, files[index].name);
    formData.append("thumbnail", thumbnails[index], files[index].name);
  });
  fetch("/api/image", {
    method: "POST",
    body: formData,
  });
}
</script>

<template>
  <div class="main-container">
    <input v-show="false" type="file" accept="image/*" @change="upload" multiple ref="uploadInput" />
    <input v-show="false" type="file" accept="image/*" @change="upload" capture="environment" ref="shotInput" />
    <div class="button-container">
      <button @click="triggerUpload">上传</button>
      <button @click="triggerShot">拍摄</button>
    </div>
    <div class="image-container">
      <img v-if="imageUrl" :src="imageUrl" alt="上一次拍摄的图片">
    </div>
  </div>
</template>

<style scoped>
.button-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  border-color: gray;
  border-width: 3px;
  border-style: solid;
  padding: 10px 0 10px 0;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0 20px 0;
  border-color: gray;
  border-style: dashed;
  border-width: 3px;
  border-top-width: 0px;
  min-height: calc(60vh - 100px - 3em);
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
}

.button-container button {
  margin-left: 10px;
  margin-right: 10px;
  font-size: 3em;
  width: calc(50% - 20px);
  color: var(--color-text);
  background-color: var(--color-background);
}
</style>
