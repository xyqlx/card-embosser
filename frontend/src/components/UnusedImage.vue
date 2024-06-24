<script setup lang="ts">
import { onMounted, ref } from 'vue';

const maxImageNumber = 10;
const imageIds = ref<string[]>([]);
enum SelectionMode {
  Single,
  FromBeginning,
  Multiple,
}
const selectionMode = ref<SelectionMode>(SelectionMode.FromBeginning);
const selectionModeOptions = [
  { value: SelectionMode.Single, label: "单选" },
  { value: SelectionMode.FromBeginning, label: "从头开始" },
  { value: SelectionMode.Multiple, label: "多选" },
];
function switchSelectionMode(mode: SelectionMode) {
  selectionMode.value = mode;
}
const selectedImageIds = ref<string[]>([]);
// expose selectedImageIds to the outside
defineExpose({ selectedImageIds });

function selectImage(imageId: string) {
  if (selectionMode.value === SelectionMode.Single) {
    if (selectedImageIds.value.length === 1 && selectedImageIds.value[0] === imageId) {
      selectedImageIds.value = [];
    } else {
      selectedImageIds.value = [imageId];
    }
  } else if (selectionMode.value === SelectionMode.FromBeginning) {
    const index = imageIds.value.indexOf(imageId);
    // check if the images are already selected
    if (selectedImageIds.value.length === index + 1
      && selectedImageIds.value.every((id, i) => imageIds.value[i] === id)) {
      selectedImageIds.value = [];
    }
    else {
      selectedImageIds.value = imageIds.value.slice(0, index + 1);

    }
  } else if (selectionMode.value === SelectionMode.Multiple) {
    if (selectedImageIds.value.includes(imageId)) {
      selectedImageIds.value = selectedImageIds.value.filter((id) => id !== imageId);
    } else {
      selectedImageIds.value = [...selectedImageIds.value, imageId];
    }
  }
}

function deleteImages() {
  if (selectedImageIds.value.length === 0) {
    return;
  }
  fetch(`/api/image`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageIds: selectedImageIds.value
    }),
  }).then(() => {
    selectedImageIds.value = [];
    fetchImages();
  });
}

async function fetchImages() {
  const response = await fetch(`/api/image/unused/desc/${maxImageNumber}`);
  const data = await response.json();
  imageIds.value = data.map((document: any) => document._id);
}

onMounted(async () => {
  await fetchImages();
});
</script>

<template>
  <div class="main-container">
    <div v-if="imageIds.length === 0" class="empty-tips">
      <h1>没有未使用的图片</h1>
    </div>
    <div class="images-container">
      <div v-for="imageId of imageIds" :key="imageId" class="image-container"
        :class="selectedImageIds.includes(imageId) ? 'selected' : ''">
        <img :src="'/api/image/thumbnail/' + imageId" :alt="imageId" @click="selectImage(imageId)">
        <div class="mask"></div>
      </div>
    </div>
    <div class="control-container">
      <div class="selection-mode-container">
        <span>按照</span>
        <button v-for="option of selectionModeOptions" :key="option.value"
          :class="selectionMode === option.value ? 'selected' : ''" @click="switchSelectionMode(option.value)">{{
      option.label }}</button>
        <span>的图片选择模式，已选择</span>
        <strong>{{ selectedImageIds.length }}</strong>
        <span>项</span>
      </div>
      <div class="command-container">
        <span>操作：</span>
        <button @click="deleteImages">删除</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  border: 1px solid var(--color-border);
}

.empty-tips {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.images-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.image-container {
  position: relative;
  border: 1px solid var(--color-border);
  cursor: pointer;
}

.image-container.selected {
  border-color: var(--color-primary);
  border-style: dashed;
}

.image-container.selected .mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 204, 255, 0.2);
  display: flex;
  /* click through */
  pointer-events: none;
}

.image-container img {
  max-width: min(300px, calc(33vw - 26px));
}

.selection-mode-container {
  display: flex;
  gap: 10px;
  padding-left: 20px;
}

.selection-mode-container button {
  padding: 5px 10px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  opacity: 0.5;
}

.selection-mode-container button.selected {
  opacity: 1;
}

.command-container {
  display: flex;
  gap: 10px;
  padding-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.command-container button {
  padding: 5px 10px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
}
</style>