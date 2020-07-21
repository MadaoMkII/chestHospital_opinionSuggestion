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
        name="attachment"
        label="附件"
      >
        <template #input>
          <van-uploader
            style="margin-bottom: -8px;"
            v-model="attachment"
            :max-count="1"
            accept="audio/*,video/*,image/*"
            upload-icon="add-o"
            :after-read="upload"
            :max-size="2000 * 1024"
            @oversize="onOversize"
          />
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
      attachment: [],
    };
  },
  methods: {
    onOversize() {
      this.$notify({ type: 'danger', message: '上传文件大小不能超过 2MB' });
    },
    async upload(file) {
      // eslint-disable-next-line no-param-reassign
      file.status = 'uploading';
      // eslint-disable-next-line no-param-reassign
      file.message = '上传中...';
      try {
        const accessToken = (await this.$axios.get('/api/user/getToken')).data.data;
        const formData = new FormData();
        formData.append('type', file.file.type.split('/')[0]);
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
    async onSubmit(form) {
      if (this.isLoading) return;
      if (this.attachment[0] && this.attachment[0].status === 'uploading') {
        this.$notify({ type: 'danger', message: '附件正在上传，请等待上传完成再试' });
        return;
      }
      try {
        this.isLoading = true;
        let mediaId;
        if (this.attachment[0] && this.attachment[0].status === 'done' && this.attachment[0].mediaId) {
          mediaId = this.attachment[0].mediaId;
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
