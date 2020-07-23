<template>
  <div class="has-submit-bar">
    <van-form
      ref="form"
      @submit="onSubmit"
    >
      <van-field
        name="content"
        v-model="content"
        label="回复内容"
        placeholder="请填写回复内容"
        rows="2"
        autosize
        type="textarea"
        maxlength="1000"
        show-word-limit
        :rules="[{ required: true, message: '回复内容不能为空' }]"
      />
      <van-field
        name="uploadFileType"
        label="附件"
      >
        <template #input>
          <file-uploader ref="fileUploader" />
        </template>
      </van-field>
    </van-form>
    <div class="submit-bar">
      <van-grid
        clickable
        :column-num="2"
      >
        <van-grid-item
          clickable
          text="取消"
          @click="$router.back()"
        />
        <van-grid-item
          clickable
          @click="$refs.form.submit()"
        >
          <template #text>
            <span
              class="van-grid-item__text"
              style="color: #1989fa;"
            >发送</span>
          </template>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      content: '',
    };
  },
  methods: {
    async onSubmit(form) {
      if (this.isLoading) return;
      let uploadFileList;
      switch (this.$refs.fileUploader.fileType) {
        case 'image':
          uploadFileList = this.$refs.fileUploader.imageList;
          break;
        case 'video':
          uploadFileList = this.$refs.fileUploader.videoList;
          break;
        case 'file':
          uploadFileList = this.$refs.fileUploader.fileList;
          break;
        case 'voice':
          if (this.$refs.fileUploader.voiceMediaId) {
            uploadFileList = [{ status: this.$refs.fileUploader.isStartVoiceRecord ? 'uploading' : 'done', mediaId: this.$refs.fileUploader.voiceMediaId }];
          } else {
            uploadFileList = [];
          }
          break;
        default:
          uploadFileList = [];
          break;
      }
      if (uploadFileList[0] && uploadFileList[0].status === 'uploading') {
        if (this.$refs.fileUploader.fileType === 'voice') {
          this.$notify({ type: 'danger', message: '录音正在进行，请完成录音后再试' });
        } else {
          this.$notify({ type: 'danger', message: '附件正在上传，请等待上传完成再试' });
        }
        return;
      }
      try {
        this.isLoading = true;
        let mediaId;
        if (uploadFileList[0] && uploadFileList[0].status === 'done' && uploadFileList[0].mediaId) {
          mediaId = uploadFileList[0].mediaId;
        }
        await this.$axios.post('/api/opinionSuggestion/replyOpinionSuggestion', {
          uuid: this.$route.params.id,
          content: form.content,
          media_id: mediaId,
        });
        this.$notify({ type: 'success', message: '回复发送成功' });
        this.$router.back();
      } catch (e) {
        if (e.response.data && e.response.data.message) {
          this.$notify({ type: 'danger', message: e.response.data.message });
        } else {
          this.$notify({ type: 'danger', message: '请求失败，服务器发生错误' });
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
