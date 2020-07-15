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
    async onSubmit(form) {
      if (this.isLoading) return;
      try {
        this.isLoading = true;
        await this.$axios.post('/api/opinionSuggestion/replyOpinionSuggestion', {
          uuid: this.$route.params.id,
          content: form.content,
          accessoryUrl: 'https://www.baidu.com/',
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
