<script setup lang="ts">
import UnusedImage from '@/components/UnusedImage.vue';
import LabelTool from '@/components/LabelTool.vue';
import { ref } from 'vue';
import type { Ref } from 'vue';
const unusedImage: Ref<InstanceType<typeof UnusedImage> | null> = ref(null);
async function submit() {
  await unusedImage.value?.refresh();
}
</script>

<template>
  <UnusedImage ref="unusedImage" />
  <LabelTool :selected-image-ids="unusedImage?.selectedImageIds" @submit="submit" />
</template>

<style scoped></style>
