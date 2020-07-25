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
        name="uploadFileType"
        label="附件"
      >
        <template #input>
          <file-uploader ref="fileUploader" />
        </template>
      </van-field>
      <van-field
        name="isAnonymous"
        label="匿名"
      >
        <template #input>
          <van-radio-group
            style="margin-bottom: -8px;"
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
      isAnonymous: false,
    };
  },
  methods: {
    onTypeConfirm(value) {
      this.type = value;
      this.showTypePicker = false;
    },
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
        // 3Yyh54Zzv9sDMAzF9mSu19btDkaTU43C_ATf3I18Iz4ARxMk4i0sA_sG6vzrk1XCP
        await this.$axios.post('/api/opinionSuggestion/createOpinionSuggestion', {
          type: form.type,
          title: form.subject,
          category: form.category,
          content: form.content,
          isAnonymity: form.isAnonymous,
          media_id: mediaId,
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
