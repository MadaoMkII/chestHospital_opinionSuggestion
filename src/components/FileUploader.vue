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
      <van-radio
        style="margin-bottom: 8px;"
        name="file"
      >
        文件
      </van-radio>
      <van-radio
        style="margin-bottom: 8px;"
        name="voice"
      >
        语音
      </van-radio>
    </van-radio-group>
    <template v-if="fileType === 'image'">
      <van-button
        native-type="button"
        @click="takePicture"
      >
        选择图片
      </van-button>
      <van-uploader
        style="margin-bottom: -8px;"
        v-model="imageList"
        :max-count="1"
        accept=".png, .jpg, .jpeg"
        upload-icon="add-o"
        :after-read="upload"
        :max-size="2000 * 1024"
        @oversize="onOversize"
      />
    </template>
    <template v-else-if="fileType === 'video'">
      <van-uploader
        style="margin-bottom: -8px;"
        v-model="videoList"
        :max-count="1"
        accept=".mp4"
        upload-icon="add-o"
        :after-read="upload"
        :max-size="10000 * 1024"
        @oversize="onOversize"
      />
    </template>
    <template v-else-if="fileType === 'file'">
      <van-uploader
        style="margin-bottom: -8px;"
        v-model="fileList"
        :max-count="1"
        accept="*"
        upload-icon="add-o"
        :after-read="upload"
        :max-size="20000 * 1024"
        @oversize="onOversize"
      />
    </template>
    <template v-else-if="fileType === 'voice'">
      voice
    </template>
  </div>
</template>

<script>
import sha1 from 'js-sha1';

const { wx } = global;

export default {
  data() {
    return {
      fileType: 'image',
      imageList: [],
      videoList: [],
      fileList: [],
    };
  },
  async created() {
    const jsApiTicket = await this.fetchJsApiTicket();
    const timestamp = Math.floor(Date.now() / 1000);
    const nonceStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const signature = sha1(`jsapi_ticket=${jsApiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${window.location.href}`);
    wx.agentConfig({
      beta: true,
      debug: true,
      corpid: process.env.VUE_APP_WECHAT_APP_ID,
      agentid: process.env.VUE_APP_WECHAT_AGENT_ID,
      timestamp,
      nonceStr,
      signature,
      jsApiList: ['getLocalImgData', 'chooseImage'],
    });
  },
  methods: {
    takePicture() {
      console.log('takePicture');
      wx.chooseImage({
        count: 1,
        success(res) {
          console.log(res);
        },
      });
    },
    async fetchJsApiTicket() {
      const response = await this.$axios.get('/api/user/get_jsapi_ticket');
      return response.data.data;
    },
    onOversize() {
      switch (this.fileType) {
        case 'image':
          this.$notify({ type: 'danger', message: '上传图片大小不能超过 2MB' });
          break;
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
        formData.append('media', file.file);
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
  },
};
</script>
