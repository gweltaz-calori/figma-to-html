<template>
    <div class="progress">
        <div ref="progressContent" class="progress-content" :style="{width:progress+'%'}" ></div>
        <div class="progress-background"></div>
    </div>
</template>

<script>
export default {
  props: {
    progress: {
      default: 50
    }
  },
  mounted() {}
};
</script>

<style scoped>
.progress {
  height: 7px;
  border-radius: 17px;
  width: 222px;
  overflow: hidden;
  position: relative;
}

.progress-background {
  background: rgba(141, 135, 225, 0.36);
  border-radius: 17px;
  width: 100%;
  height: 100%;
}

.progress-content {
  background: linear-gradient(180deg, #8d87e1 0%, #4b3eff 100%);
  border-radius: 17px;
  width: 50%;
  height: 100%;
  position: absolute;
}
</style>
