<template>
  <router-view />
</template>

<style lang="scss">
  body {
    background-color: #fafafa;
  }

  .has-submit-bar {
    margin-bottom: 50px;
  }
  .submit-bar {
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    .van-grid-item .van-grid-item__content {
      &::after {
        border: 0;
      }
    }
  }
</style>
