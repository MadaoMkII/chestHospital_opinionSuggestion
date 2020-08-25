<template>
  <div>
    <van-uploader
      v-model="fileList"
      multiple
      :max-count="1"
      :max-size="1000000 * 20"
      accept=".mp4, .mov, .png, .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx, .txt, .ppt, .pptx"
      upload-icon="add-o"
      @oversize="onOversize"
      :after-read="afterRead"
      @click-preview="filePreview"
      :preview-options="{ closeable: true }"
    >
      <template #preview-cover="{ file }">
        <template v-if="isVideoFile(file)">
          <div class="van-uploader__file">
            <i class="van-icon van-icon-video-o van-uploader__file-icon" />
            <div class="van-uploader__file-name van-ellipsis">
              播放视频
            </div>
          </div>
        </template>
      </template>
    </van-uploader>
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
import { Toast } from 'vant';

export default {
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isShowVideo: false,
      videoURL: null,
    };
  },
  computed: {
    fileList: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  mounted() {
    document.body.insertBefore(this.$refs.videoPreview, document.body.lastChild);
  },
  methods: {
    videoPreview(file) {
      const reader = new FileReader();

      // eslint-disable-next-line func-names
      reader.addEventListener('load', () => {
        this.isShowVideo = true;
        // convert image file to base64 string
        this.videoURL = reader.result;
      }, false);

      reader.readAsDataURL(file);
    },
    isVideoFile(file) {
      const types = ['mp4', 'mov'];
      const type = file.name.split('.').pop().toLowerCase();
      return types.includes(type);
    },
    filePreview(file) {
      if (this.isVideoFile(file.file)) {
        this.videoPreview(file.file);
      }
    },
    onOversize() {
      Toast('文件大小不能超过 20MB');
    },
    afterRead(file) {
      if (Array.isArray(file)) {
        for (let i = 0; i < file.length; i += 1) {
          this.uploadFile(file[i]);
        }
      } else {
        this.uploadFile(file);
      }
    },
    async uploadFile(file) {
      // eslint-disable-next-line no-param-reassign
      file.status = 'uploading';
      // eslint-disable-next-line no-param-reassign
      file.message = '上传中...';
      try {
        const accessToken = (await this.$axios.get('/api/user/getToken')).data.data;
        const formData = new FormData();
        formData.append('type', 'file');
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
            // eslint-disable-next-line no-param-reassign
            file.type = file.file.name.split('.').pop().toLowerCase();
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

<style lang="scss" scoped>
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
