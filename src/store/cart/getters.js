const getCost = (state) => state.list.reduce((sum, el) => sum + el.price * el.data.quantity, 0);

const getCount = (state) => state.list.length;

const getList = (state) => state.list;

const isEmpty = (state) => state.list.length === 0;

export default {
  getCost,
  getCount,
  getList,
  isEmpty,
};
