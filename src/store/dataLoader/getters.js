const getCity = (state) => state.lists.cities;

const getRegion = (state) => state.lists.regions;

const getReviews = (state) => state.lists.reviews;

const isEmptyCity = (state) => state.lists.cities.length === 0;

const isEmptyRegion = (state) => state.lists.regions.length === 0;

const isEmptyReviews = (state) => state.lists.reviews.length === 0;

export default {
  getCity,
  getRegion,
  getReviews,
  isEmptyCity,
  isEmptyRegion,
  isEmptyReviews,
};
