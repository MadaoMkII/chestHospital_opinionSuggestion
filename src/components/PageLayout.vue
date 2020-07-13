<template>
  <div class="page-layout">
    <div class="page-layout__header">
      <slot name="header" />
    </div>
    <div class="page-layout__body">
      <slot name="body" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .page-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    &__header {
      flex-shrink: 0;
    }
    &__body {
      flex-grow: 1;
      overflow: auto;
      margin-bottom: 50px;
      margin-bottom: calc(constant(safe-area-inset-bottom) + 50px);
      margin-bottom: calc(env(safe-area-inset-bottom) + 50px);
    }
  }
</style>
