import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
  namespaced: true,
  state: {
    list: [],
    loading: false,
    response: false,
  },
  mutations,
  actions,
  getters,
};
