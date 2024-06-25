<script setup lang="ts">
import { onMounted, ref } from 'vue';

const maxItemNumber = 50;
class Item {
  _id: string = '';
  itemId: number = 0;
  images: string[] = [];
  description: string = '';
  records: {
    time: Date;
    position: string;
  }[] = [];
}
const items = ref<Item[]>([]);
async function fetchItems() {
  isLoading.value = true;
  const response = await fetch(`/api/item/latest/${maxItemNumber}`);
  items.value = await response.json();
  isLoading.value = false;
}
onMounted(async () => {
  await fetchItems();
});
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
const selectedItemIds = ref<string[]>([]);
// expose selectedImageIds to the outside
defineExpose({ selectedImageIds: selectedItemIds, refresh });

function selectItem(id: string) {
  if (selectionMode.value === SelectionMode.Single) {
    if (selectedItemIds.value.length === 1 && selectedItemIds.value[0] === id) {
      selectedItemIds.value = [];
    } else {
      selectedItemIds.value = [id];
    }
  } else if (selectionMode.value === SelectionMode.FromBeginning) {
    const index = items.value.findIndex((item) => item._id === id);
    // check if the images are already selected
    if (selectedItemIds.value.length === index + 1
      && selectedItemIds.value.every((id, i) => items.value[i]._id === id)) {
      selectedItemIds.value = [];
    }
    else {
      selectedItemIds.value = items.value.map(x=>x._id).slice(0, index + 1);
    }
  } else if (selectionMode.value === SelectionMode.Multiple) {
    if (selectedItemIds.value.includes(id)) {
      selectedItemIds.value = selectedItemIds.value.filter((id) => id !== id);
    } else {
      selectedItemIds.value = [...selectedItemIds.value, id];
    }
  }
}

function deleteItems() {
  if (selectedItemIds.value.length === 0) {
    return;
  }
  fetch(`/api/item`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ids: selectedItemIds.value
    }),
  }).then(() => {
    selectedItemIds.value = [];
    fetchItems();
  });
}

const isLoading = ref(false);

async function refresh() {
  await fetchItems();
  // default choose the first item
  if (items.value.length > 0) {
    selectedItemIds.value = [items.value[0]._id];
  }
}

async function addRecord() {
  const position = prompt('请输入新的位置');
  if (position === null) {
    return;
  }
  if (position === '') {
    alert('位置不能为空');
    return;
  }
  const ids = selectedItemIds.value;
  const records = [{
    time: new Date().toISOString(),
    position,
  }]
  await fetch(`/api/item/record`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ids,
      records,
    }),
  });
  await refresh();
}

onMounted(async () => {
  await refresh();
});
</script>

<template>
  <div class="main-container">
    <div class="items-container">
      <div v-for="item of items" :key="item._id" class="item-container"
        :class="selectedItemIds.includes(item._id) ? 'selected' : ''">
        <div class="position">{{ item.records[item.records.length - 1].position }}</div>
        <img :src="item.images.length === 0 ? '' : '/api/image/thumbnail/' + item.images[0]" :alt="item.description"
          @click="selectItem(item._id)" loading="lazy">
        <div class="mask"></div>
      </div>
    </div>
    <div v-show="!isLoading" class="control-container">
      <div class="selection-mode-container">
        <span>按照</span>
        <button v-for="option of selectionModeOptions" :key="option.value"
          :class="selectionMode === option.value ? 'selected' : ''" @click="switchSelectionMode(option.value)">{{
        option.label }}</button>
        <span>的选择模式，已选择</span>
        <strong>{{ selectedItemIds.length }}</strong>
        <span>项</span>
      </div>
      <div class="command-container">
        <span>操作：</span>
        <button @click="refresh">刷新</button>
        <button @click="addRecord">转移位置</button>
        <button @click="deleteItems" :disabled="selectedItemIds.length === 0">删除</button>
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

.items-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.item-container {
  position: relative;
  border: 1px solid var(--color-border);
  cursor: pointer;
}

.item-container.selected {
  border-color: var(--color-primary);
  border-style: dashed;
}

.item-container.selected .mask {
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

.item-container img {
  max-width: min(300px, calc(33vw - 26px));
  min-height: 128px;
  min-width: 50px
}

.item-container .position {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
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
