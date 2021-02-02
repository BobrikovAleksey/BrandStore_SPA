/**
 * @param state
 * @param data {object[]}
 */
const SET_DATA_CITY = (state, data) => {
  if (!state.response) return;
  state.lists.cities = [...data];
};

/**
 * @param state
 * @param data {object[]}
 */
const SET_DATA_REGION = (state, data) => {
  if (!state.response) return;
  state.lists.regions = [...data];
};

/**
 * @param state
 * @param data {object[]}
 */
const SET_DATA_REVIEW = (state, data) => {
  if (!state.response) return;
  state.lists.reviews = [...data];
};

/**
 * @param state
 * @param loading {boolean}
 */
const SET_LOADING = (state, loading) => {
  state.loading = loading;
};

/**
 * @param state
 * @param response {boolean}
 */
const SET_RESPONSE = (state, response) => {
  state.response = response;
};

export default {
  SET_DATA_CITY,
  SET_DATA_REGION,
  SET_DATA_REVIEW,
  SET_LOADING,
  SET_RESPONSE,
};
