import moment from 'moment';

export default {
  methods: {
    formatDatetime(datetime) {
      return moment(datetime).format('YYYY-MM-DD HH:mm');
    },
  },
};
