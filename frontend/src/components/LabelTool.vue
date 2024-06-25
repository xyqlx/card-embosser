<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue';

const props = defineProps({
  selectedImageIds: Array,
});
const { selectedImageIds } = toRefs(props);
const emit = defineEmits(['submit']);
// form model
const position = ref('');
const description = ref('');
async function pressEnter(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    await submit();
  }
}
async function submit() {
  // 处理多行postion
  const records = position.value.split('\n').map((position) => ({ time: new Date().toISOString(), position }));
  await fetch('/api/item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      images: selectedImageIds?.value ?? [],
      records: records,
      description: description.value,
    }),
  });
  // set position and description to empty
  description.value = '';
  emit('submit');
}
onMounted(async () => {
  // get the last position
  const response = await fetch('/api/item/last-position');
  position.value = await response.text();
});
</script>

<template>
  <div class="main-container">
    <form>
      <p>
        <label for="position">记录位置</label>
        <textarea type="text" id="position" name="position" :rows="3" v-model="position"></textarea>
      </p>
      <p>
        <label for="description">描述或者写点什么（按下回车提交）</label>
        <textarea name="description" id="description" rows="3" v-model="description" @keydown.enter="pressEnter"></textarea>
      </p>
      <button type="submit"  @click.prevent="submit">提交</button>
    </form>
  </div>
</template>

<style scoped>
.main-container {
  border: 1px solid var(--color-border);
}

form {
  padding: 20px;
}

form p {
  margin-bottom: 10px;
}

form label {
  display: block;
  margin-bottom: 5px;
}

form input {
  width: 100%;
  padding: 5px;
  font-size: 16px;
}

form textarea {
  width: 100%;
  padding: 5px;
  font-size: 16px;
  /* 不写的话会被用户代理样式表覆盖 */
  font-family: inherit;
}
</style>
