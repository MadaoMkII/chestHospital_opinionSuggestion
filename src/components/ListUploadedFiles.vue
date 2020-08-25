<template>
  <div class="list-uploaded-files">
    <template v-for="(file, i) in data">
      <div
        v-if="isImageFile(file)"
        :key="i"
        class="list-uploaded-files__item"
        @click="imagePreview(file)"
      >
        <van-image
          fit="cover"
          width="100%"
          height="100%"
          :src="getFileURL(file)"
        />
      </div>
      <div
        v-else-if="isVideoFile(file)"
        :key="i"
        class="list-uploaded-files__item"
        @click="videoPreview(file)"
      >
        <div class="list-uploaded-files__item__icon van-icon van-icon-video-o" />
        <div class="list-uploaded-files__item__name van-ellipsis">
          播放视频
        </div>
      </div>
      <div
        v-else
        :key="i"
        class="list-uploaded-files__item"
        @click="openOrDownload(file)"
      >
        <div class="list-uploaded-files__item__icon van-icon van-icon-description" />
        <div class="list-uploaded-files__item__name van-ellipsis">
          {{ file.type }} 文件
        </div>
      </div>
    </template>
    <van-overlay
      ref="videoPreview"
      :show="isShowVideo"
      @click="isShowVideo = false"
      z-index="99"
    >
      <i
        class="van-icon van-icon-clear van-image-preview__close-icon van-image-preview__close-icon--top-right"
        @click="isShowVideo = false"
      />
      <div
        v-if="isShowVideo"
        class="video-container"
        @click="isShowVideo = false"
      >
        <video
          controls
          width="100%"
          @click.stop
        >
          <source
            :src="videoURL"
            type="video/mp4"
          >
          Sorry, your browser doesn't support embedded videos.
        </video>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isShowVideo: false,
      videoURL: null,
    };
  },
  mounted() {
    document.body.insertBefore(this.$refs.videoPreview, document.body.lastChild);
  },
  methods: {
    openOrDownload(file) {
      window.open(this.getFileURL(file), '_blank');
    },
    getFileURL(file) {
      if (file.localMediaId) return `/api/getAccessory/${file.localMediaId}`;
      return `/wx-api/cgi-bin/media/get?access_token=${this.accessToken}&media_id=${file.mediaId}`;
    },
    isImageFile(file) {
      const types = ['png', 'jpg', 'jpeg'];
      return types.includes(file.type);
    },
    isVideoFile(file) {
      const types = ['mp4', 'mov'];
      return types.includes(file.type);
    },
    imagePreview(file) {
      ImagePreview({ images: [this.getFileURL(file)], closeable: true });
    },
    videoPreview(file) {
      this.isShowVideo = true;
      this.videoURL = this.getFileURL(file);
    },
  },
};
</script>

<style lang="scss" scoped>
.list-uploaded-files {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8px -8px 0;
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 80px;
    height: 80px;
    margin: 0 8px 8px 0;
    background-color: #f2f3f5;
    border-radius: 3px;
    overflow: hidden;

    &__icon {
      color: #646566;
      font-size: 20px;
    }
    &__name {
      box-sizing: border-box;
      width: 100%;
      margin-top: 8px;
      padding: 0 4px;
      color: #646566;
      font-size: 12px;
      text-align: center;
    }

    &:active {
      background-color: #f2f3f5;
    }
  }
}

.video-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  &__close {
    position: absolute;
    top: 8px;
    left: 8px;
    color: #fff;
    font-size: 24px;
    z-index: 9999;
  }
}
</style>
