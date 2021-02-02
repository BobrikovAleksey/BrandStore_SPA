import { ListNames, Mutations } from '@/store/dictionary';

const urls = {
  [ListNames.cities]: '/api/lists/cities',
  [ListNames.regions]: '/api/lists/regions',
  [ListNames.reviews]: '/api/reviews',
};

/**
 * Запрашивает требуемый список с сервера
 * @param commit
 * @param name {string}
 */
const fetchData = ({ commit }, name) => {
  commit(Mutations.DataLoader.SET_LOADING, true);
  commit(Mutations.DataLoader.SET_RESPONSE, false);

  fetch(urls[name])
    .then((response) => response.json())
    .then((data) => {
      commit(Mutations.DataLoader.SET_RESPONSE, true);

      switch (name) {
        case ListNames.reviews:
          commit(Mutations.DataLoader.SET_DATA_REVIEW, data);
          break;
        case ListNames.regions:
          commit(Mutations.DataLoader.SET_DATA_REGION, data);
          break;
        case ListNames.cities:
          commit(Mutations.DataLoader.SET_DATA_CITY, data);
          break;
        default:
          commit(Mutations.DataLoader.SET_RESPONSE, false);
      }

      commit(Mutations.DataLoader.SET_LOADING, false);
    })
    .catch(() => {
      commit(Mutations.DataLoader.SET_RESPONSE, false);
      commit(Mutations.DataLoader.SET_LOADING, false);
      // сообщение об ошибке
    });
};

export default {
  fetchData,
};
