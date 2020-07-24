import Vue from 'vue';
import PageLayout from './PageLayout.vue';
import ProposalItem from './ProposalItem.vue';
import FileUploader from './FileUploader.vue';
import PreviewFile from './PreviewFile.vue';

Vue.component('PageLayout', PageLayout);
Vue.component('ProposalItem', ProposalItem);
Vue.component('FileUploader', FileUploader);
Vue.component('PreviewFile', PreviewFile);

export {
  PageLayout,
  ProposalItem,
  FileUploader,
  PreviewFile,
};

export default {
  PageLayout,
  ProposalItem,
  FileUploader,
  PreviewFile,
};
