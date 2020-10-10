import axios from 'axios';
import { boot } from 'quasar/wrappers';

export default boot(({ Vue }) => {
  // eslint-disable-next-line no-param-reassign
  Vue.prototype.$axios = axios;
});
