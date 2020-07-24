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
    v-else-if="fileType === 'voice'"
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
import sha1 from 'js-sha1';
import BenzAMRRecorder from 'benz-amr-recorder';

const { wx } = global;

export default {
  props: {
    filename: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isInWeChat: false,
      isPlayVoice: false,
      amr: null,
    };
  },
  computed: {
    fileType() {
      return this.getFileType(this.filename);
      // return 'video';
      // return 'file';
    },
    fileUrl() {
      return `/api/getAccessory/${this.filename}`;
      // return 'https://www.w3schools.com/html/mov_bbb.mp4';
    },
  },
  async created() {
    const jsApiTicket = await this.fetchJsApiTicket();
    const timestamp = Math.floor(Date.now() / 1000);
    const nonceStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const signature = sha1(`jsapi_ticket=${jsApiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${window.location.href}`);
    try {
      wx.agentConfig({
        beta: true,
        debug: true,
        corpid: process.env.VUE_APP_WECHAT_APP_ID,
        agentid: process.env.VUE_APP_WECHAT_AGENT_ID,
        timestamp,
        nonceStr,
        signature,
        jsApiList: ['downloadFile', 'playVoice', 'stopVoice'],
      });
      this.isInWeChat = true;
    } catch (e) {
      this.isInWeChat = false;
    }
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
    downloadFile() {
      const element = document.createElement('a');
      element.setAttribute('href', this.fileUrl);
      element.setAttribute('download', this.filename);
      element.setAttribute('target', '_blank');
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
        case 'mov':
          return 'video';
        case 'amr':
          return 'voice';
        default:
          return 'file';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .preview-video {
    width: 100%;
    max-height: 200px;
  }
</style>
