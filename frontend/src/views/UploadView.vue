<script setup lang="ts">
import { Ref, toRef } from 'vue';

const imageUrl: Ref<string | ArrayBuffer> = toRef("");
function upload($event) {
  var file = $event.target.files[0]; // 获取选择的文件
        var reader = new FileReader(); // 创建FileReader对象

        reader.onload = function(e) {
            imageUrl.value = e.target.result; // 设置图片预览的src属性
        };

        // 读取文件
        if (file) {
            reader.readAsDataURL(file);
            
            // 调用上传函数
            // uploadFile(file);
        }
}
</script>

<template>
  <div class="main-container">
    <div class="button-container">
      <input type="file" accept="image/*" @change="upload">上传</input>
    </div>
    <div class="image-container">
      <img v-if="imageUrl" :src="imageUrl" alt="上一次拍摄的图片">
    </div>
  </div>
</template>

<style scoped>
.button-container {
  display: flex;
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
}
.button-container button {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
