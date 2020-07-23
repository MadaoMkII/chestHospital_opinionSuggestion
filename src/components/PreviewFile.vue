<template>
  <div
    v-if="fileType === 'image'"
    style="margin-top: 10px;"
    @click="previewImage(fileUrl)"
  >
    <van-image
      fit="cover"
      width="100"
      height="100"
      :src="fileUrl"
    />
  </div>
  <div
    v-else-if="fileType === 'video'"
    style="margin-top: 10px;"
  >
    <video
      class="preview-video"
      controls
    >
      <source
        :src="fileUrl"
        type="video/mp4"
      >
      Your browser does not support the video tag.
    </video>
  </div>
  <div
    v-else-if="fileType === 'file'"
    style="margin-top: 10px;"
  >
    <van-button
      icon="down"
      type="primary"
      size="small"
      @click="downloadFile()"
    >
      下载附件
    </van-button>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';

export default {
  props: {
    filename: {
      type: String,
      required: true,
    },
  },
  computed: {
    fileType() {
      return this.getFileType(this.filename);
      // return 'video';
      // return 'file';
    },
    fileUrl() {
      return `//www.mystery-vr.com/api/getAccessory/${this.filename}`;
      // return 'https://www.w3schools.com/html/mov_bbb.mp4';
    },
  },
  methods: {
    downloadFile() {
      const element = document.createElement('a');
      element.setAttribute('href', this.fileUrl);
      element.setAttribute('download', '');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    previewImage(url) {
      ImagePreview([url]);
    },
    getFileType(filename) {
      const ext = filename.split('.').pop().toLowerCase();
      switch (ext) {
        case 'jpg':
          return 'image';
        case 'png':
          return 'image';
        case 'jpeg':
          return 'image';
        case 'mp4':
          return 'video';
        default:
          return 'file';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .preview-video {
    max-width: 200px;
    max-height: 200px;
  }
</style>
