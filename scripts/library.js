/**
 * Преобразует json-строку в объект
 *
 * @param jsonString String
 * @returns {*|null}
 */
const jsonParse = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    return null;
  }
};


module.exports = {
  jsonParse,
};
