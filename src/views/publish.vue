<template>
  <div class="has-submit-bar">
    <van-form
      ref="form"
      @submit="onSubmit"
    >
      <van-field
        readonly
        clickable
        name="type"
        :value="type"
        label="类型"
        placeholder="点击选择类型"
        @click="showTypePicker = true"
      />
      <van-field
        name="subject"
        v-model="subject"
        label="主题"
        placeholder="请填写主题"
        rows="1"
        autosize
        type="textarea"
        maxlength="50"
        show-word-limit
        :rules="[{ required: true, message: '主题不能为空' }]"
      />
      <van-field
        name="category"
        label="分类"
        :rules="[{ required: true, message: '请选择分类' }]"
      >
        <template #input>
          <van-radio-group
            style="margin-bottom: -8px;"
            v-model="category"
            direction="horizontal"
          >
            <van-radio
              style="margin-bottom: 8px;"
              v-for="(categoryText, i) in categoryList"
              :key="i"
              :name="categoryText"
            >
              {{ categoryText }}
            </van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        name="content"
        v-model="content"
        label="内容"
        placeholder="请填写内容"
        rows="2"
        autosize
        type="textarea"
        maxlength="1000"
        show-word-limit
        :rules="[{ required: true, message: '内容不能为空' }]"
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
      <van-field
        name="isAnonymous"
        label="匿名"
      >
        <template #input>
          <van-radio-group
            v-model="isAnonymous"
            direction="horizontal"
          >
            <van-radio
              style="margin-bottom: 8px;"
              :name="true"
            >
              是
            </van-radio>
            <van-radio
              style="margin-bottom: 8px;"
              :name="false"
            >
              否
            </van-radio>
          </van-radio-group>
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
            >确认提交</span>
          </template>
        </van-grid-item>
      </van-grid>
    </div>
    <van-popup
      v-model="showTypePicker"
      position="bottom"
    >
      <van-picker
        show-toolbar
        :columns="typeList"
        @confirm="onTypeConfirm"
        @cancel="showTypePicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      type: '建议',
      typeList: ['建议', '意见'],
      showTypePicker: false,
      subject: '',
      category: '',
      categoryList: [
        '医院建设',
        '人才建设',
        '学科建设',
        '医疗安全',
        '安全管理',
        '后勤保障',
        '信息化',
        '职工福利',
        '便民服务',
        '其它',
      ],
      content: '',
      attachment: [],
      isAnonymous: false,
    };
  },
  methods: {
    onTypeConfirm(value) {
      this.type = value;
      this.showTypePicker = false;
    },
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
        await this.$axios.post('/api/opinionSuggestion/createOpinionSuggestion', {
          type: form.type,
          title: form.subject,
          category: form.category,
          content: form.content,
          isAnonymity: form.isAnonymous,
          accessoryUrl: mediaId,
        });
        this.$notify({ type: 'success', message: `${this.type}发布成功` });
        this.$router.push({ name: 'my' });
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
