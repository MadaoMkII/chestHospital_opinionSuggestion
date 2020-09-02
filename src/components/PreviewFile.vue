<template>
  <div
    v-if="meta.type === 'image' && (meta.localMediaId || accessToken)"
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
    v-else-if="meta.type === 'video' && (meta.localMediaId || accessToken)"
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
    v-else-if="meta.type === 'voice' && (meta.localMediaId || accessToken)"
    style="margin-top: 10px;"
  >
    <van-button
      v-if="!isPlayVoice"
      native-type="button"
      plain
      icon="play"
      type="primary"
      size="small"
      @click="playVoice()"
    >
      播放语音
    </van-button>
    <van-button
      v-else
      native-type="button"
      plain
      icon="stop"
      type="danger"
      size="small"
      @click="stopVoice()"
    >
      停止播放
    </van-button>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
import BenzAMRRecorder from 'benz-amr-recorder';

export default {
  props: {
    meta: {
      type: Object,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isPlayVoice: false,
      amr: null,
    };
  },
  computed: {
    fileUrl() {
      if (this.meta.localMediaId) {
        return `/api/getAccessory/${this.meta.localMediaId}`;
      }
      return `/wx-api/cgi-bin/media/get?access_token=${this.accessToken}&media_id=${this.meta.mediaId}`;
    },
  },
  methods: {
    playVoice() {
      this.amr = new BenzAMRRecorder();
      this.amr.initWithUrl(this.fileUrl).then(() => {
        this.amr.play();
        this.isPlayVoice = true;
      });
      this.amr.onEnded(() => {
        this.isPlayVoice = false;
      });
    },
    stopVoice() {
      this.amr.stop();
      this.amr.onStop(() => {
        this.isPlayVoice = false;
      });
    },
    async fetchJsApiTicket() {
      const response = await this.$axios.get('/api/user/get_jsapi_ticket');
      return response.data.data;
    },
    previewImage(url) {
      ImagePreview([url]);
    },
    // getFileType(filename) {
    //   const ext = filename.split('.').pop().toLowerCase();
    //   switch (ext) {
    //     case 'jpg':
    //       return 'image';
    //     case 'png':
    //       return 'image';
    //     case 'jpeg':
    //       return 'image';
    //     case 'mp4':
    //       return 'video';
    //     case 'mov':
    //       return 'video';
    //     case 'amr':
    //       return 'voice';
    //     default:
    //       return 'file';
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
  .preview-video {
    width: 100%;
    max-height: 200px;
  }
</style>
