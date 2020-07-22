import Vue from 'vue';
import PageLayout from './PageLayout.vue';
import ProposalItem from './ProposalItem.vue';
import FileUploader from './FileUploader.vue';

Vue.component('PageLayout', PageLayout);
Vue.component('ProposalItem', ProposalItem);
Vue.component('FileUploader', FileUploader);

export {
  PageLayout,
  ProposalItem,
};

export default {
  PageLayout,
  ProposalItem,
};
