import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export default {
  namespaced: true,
  state: {
    lists: {
      reviews: [],
      regions: [],
      cities: [],
    },
    loading: false,
    response: false,
  },
  mutations,
  actions,
  getters,
};
