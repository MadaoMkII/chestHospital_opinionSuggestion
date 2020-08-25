<template>
  <div>
    <van-radio-group
      v-model="fileType"
      direction="horizontal"
    >
      <van-radio
        style="margin-bottom: 8px;"
        name="image"
      >
        图片
      </van-radio>
      <van-radio
        style="margin-bottom: 8px;"
        name="video"
      >
        视频
      </van-radio>
      <!--      <van-radio-->
      <!--        style="margin-bottom: 8px;"-->
      <!--        name="file"-->
      <!--      >-->
      <!--        文件-->
      <!--      </van-radio>-->
      <van-radio
        v-if="isInWeChat && !iOS()"
        style="margin-bottom: 8px;"
        name="voice"
      >
        语音
      </van-radio>
    </van-radio-group>
    <template v-if="fileType === 'image'">
      <van-uploader
        class="custom-uploader"
        :key="'image'"
        v-model="imageList"
        :max-count="1"
        accept=".png, .jpg, .jpeg"
        upload-icon="add-o"
        :before-read="imageFileFilter"
        :after-read="upload"
      />
    </template>
    <template v-else-if="fileType === 'video'">
      <van-uploader
        class="custom-uploader"
        :key="'video'"
        v-model="videoList"
        :max-count="1"
        accept=".mp4, .mov"
        upload-icon="add-o"
        :before-read="videoFileFilter"
        :after-read="upload"
        :max-size="10000 * 1024"
        @oversize="onOversize"
        @delete="previewVideoDataURL = null"
      >
        <template
          v-if="previewVideoDataURL"
          #preview-cover
        >
          <video
            ref="previewVideo"
            style="width: 100%; height: 100%; background-color: #ccc;"
            @click="fullscreenPlay"
            autoplay
            muted
            loop
          >
            <source
              :src="previewVideoDataURL"
              type="video/mp4"
            >
            Your browser does not support the video tag.
          </video>
        </template>
      </van-uploader>
    </template>
    <!--    <template v-else-if="fileType === 'file'">-->
    <!--      <van-uploader-->
    <!--        style="margin-bottom: -8px;"-->
    <!--        v-model="fileList"-->
    <!--        :max-count="1"-->
    <!--        accept="*"-->
    <!--        upload-icon="add-o"-->
    <!--        :after-read="upload"-->
    <!--        :max-size="20000 * 1024"-->
    <!--        @oversize="onOversize"-->
    <!--      />-->
    <!--    </template>-->
    <template v-else-if="fileType === 'voice'">
      <van-button
        v-if="!isStartVoiceRecord"
        native-type="button"
        plain
        icon="play"
        type="info"
        size="small"
        @click="startVoiceRecord()"
      >
        开始录音
      </van-button>
      <van-button
        v-else
        native-type="button"
        plain
        icon="stop"
        type="danger"
        size="small"
        @click="stopVoiceRecord()"
      >
        停止录音
      </van-button>
      <template v-if="voiceLocalId">
        <span style="margin-right: 12px;" />
        <van-button
          v-if="!isPlayVoice"
          native-type="button"
          plain
          icon="play"
          type="primary"
          size="small"
          @click="playVoice()"
        >
          播放录音
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
      </template>
      <!--      <van-count-down :time="1 * 60" />-->
    </template>
  </div>
</template>

<script>
import sha1 from 'js-sha1';
import { compressAccurately } from 'image-conversion';
import { mapState } from 'vuex';

const { wx } = global;

export default {
  computed: mapState(['config']),
  data() {
    return {
      fileType: 'image',
      imageList: [],
      videoList: [],
      fileList: [],
      isStartVoiceRecord: false,
      isPlayVoice: false,
      voiceMediaId: null,
      voiceLocalId: null,
      isInWeChat: false,
      previewVideoDataURL: null,
    };
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
        corpid: this.config.corpId,
        agentid: this.config.agentId,
        timestamp,
        nonceStr,
        signature,
        jsApiList: ['onVoiceRecordEnd', 'onVoicePlayEnd', 'startRecord', 'stopRecord', 'playVoice', 'stopVoice'],
      });
      this.isInWeChat = true;
    } catch (e) {
      this.isInWeChat = false;
    }

    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
      } else {
        console.log('Leaving full-screen mode.');
        this.$refs.previewVideo.pause();
      }
    });
  },
  methods: {
    fullscreenPlay() {
      if (this.iOS()) {
        this.$refs.previewVideo.play();
        return;
      }
      const elem = this.$refs.previewVideo;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }

      elem.play();
    },
    iOS() {
      return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
      ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
    },
    imageFileFilter(file) {
      const types = ['png', 'jpg', 'jpeg'];
      const type = file.type.split('/').pop().toLowerCase();
      if (!types.includes(type)) {
        this.$notify({ type: 'danger', message: '图片格式必须是 .png, .jpg, .jpeg' });
        return false;
      }
      return true;
    },
    videoFileFilter(file) {
      const types = ['mp4', 'quicktime'];
      const type = file.type.split('/').pop().toLowerCase();
      if (!types.includes(type)) {
        this.$notify({ type: 'danger', message: '视频格式必须是 .mp4, .mov' });
        return false;
      }
      return true;
    },
    async fetchJsApiTicket() {
      const response = await this.$axios.get('/api/user/get_jsapi_ticket');
      return response.data.data;
    },
    onOversize() {
      switch (this.fileType) {
        case 'video':
          this.$notify({ type: 'danger', message: '上传视频大小不能超过 10MB' });
          break;
        case 'file':
          this.$notify({ type: 'danger', message: '上传文件大小不能超过 20MB' });
          break;
        default:
          break;
      }
    },
    async upload(file) {
      // eslint-disable-next-line no-param-reassign
      file.status = 'uploading';
      // eslint-disable-next-line no-param-reassign
      file.message = '上传中...';
      try {
        const accessToken = (await this.$axios.get('/api/user/getToken')).data.data;
        const formData = new FormData();
        formData.append('type', this.fileType);
        if (this.fileType === 'image' && file.file.size > 2000 * 1000) {
          const compressFile = await compressAccurately(file.file, 1000 * 1.5);
          formData.append('media', compressFile);
        } else {
          formData.append('media', file.file);
        }
        const response = await this.$axios.post('/wx-api/cgi-bin/media/upload', formData, {
          params: {
            access_token: accessToken,
          },
        });
        switch (response.data.errcode) {
          case 0:
            // eslint-disable-next-line no-param-reassign
            file.status = 'done';
            // eslint-disable-next-line no-param-reassign
            file.mediaId = response.data.media_id;

            if (this.fileType === 'video') {
              this.previewVideoDataURL = file.content;
              setTimeout(() => {
                this.$refs.previewVideo.pause();
              }, 2000);
            }
            break;
          default:
            // eslint-disable-next-line no-param-reassign
            file.status = 'failed';
            // eslint-disable-next-line no-param-reassign
            file.message = '上传失败';
            this.$notify({
              type: 'danger',
              message: `上传失败: (${response.data.errcode})${response.data.errmsg}`,
            });
            break;
        }
      } catch (e) {
        // eslint-disable-next-line no-param-reassign
        file.status = 'failed';
        // eslint-disable-next-line no-param-reassign
        file.message = '上传失败';
      }
    },
    startVoiceRecord() {
      const then = this;
      wx.startRecord({
        success() {
          then.isPlayVoice = false;
          then.isStartVoiceRecord = true;
          then.voiceLocalId = null;
          wx.onVoiceRecordEnd({
            complete({ localId }) {
              then.voiceLocalId = localId;
              wx.uploadVoice({
                localId,
                success({ serverId }) {
                  then.voiceMediaId = serverId;
                  then.isStartVoiceRecord = false;
                },
              });
            },
          });
        },
        fail(e) {
          // alert(JSON.stringify(e));
          console.log(e);
        },
      });
    },
    stopVoiceRecord() {
      const then = this;
      wx.stopRecord({
        success({ localId }) {
          then.voiceLocalId = localId;
          wx.uploadVoice({
            localId,
            success({ serverId }) {
              then.voiceMediaId = serverId;
              then.isStartVoiceRecord = false;
            },
          });
        },
      });
    },
    playVoice() {
      const then = this;
      wx.playVoice({
        localId: then.voiceLocalId,
        success() {
          then.isPlayVoice = true;
          wx.onVoicePlayEnd({
            success() {
              then.isPlayVoice = false;
            },
          });
        },
      });
    },
    stopVoice() {
      const then = this;
      wx.stopVoice({
        localId: then.voiceLocalId,
        success() {
          then.isPlayVoice = false;
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .custom-uploader {
    display: block;
    &::v-deep {
      .van-uploader__preview, .van-uploader__upload {
        margin-bottom: 0;
      }
    }
  }
</style>
