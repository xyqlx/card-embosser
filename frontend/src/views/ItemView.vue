<script setup lang="ts">
import { onMounted, ref } from 'vue';
const maxItemNumber = 10;
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
async function releaseItem(item: Item) {
  await fetch(`/api/item/${item._id}`, {
    method: 'DELETE',
  });
  await fetchItems();
}
async function fetchItems() {
  const response = await fetch(`/api/item/latest/${maxItemNumber}`);
  items.value = await response.json();
}
onMounted(async () => {
  await fetchItems();
});
</script>

<template>
  <div class="main-container">
    <h1>双击解散物品（仅建议解散最新物品）</h1>
    <div class="item-container">
      <div class="item" v-for="item in items" :key="item.itemId" @dblclick="releaseItem(item)">
        <img :src="item.images.length === 0 ? '' : '/api/image/thumbnail/' + item.images[0]" :alt="item.description">
        <div class="position">{{ item.records[item.records.length - 1].position }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
