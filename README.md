# Интернет магазин одежды и аксессуаров "Brand"
Тестовый сервер для магазина одежды и аксессуаров "Brand"

## Установка проекта:
yarn install | npm install

## Запуск сервера:
yarn serve | npm run serve

## API
1. [Каталог](http://localhost:3030/api/catalog): http://localhost:3030/api/catalog
    - [каталог женский|мужской|детский|аксессуары](http://localhost:3030/api/catalog/?page=women): http://localhost:3030/api/catalog/?page=men|women|kids|accessories
    - [коллекции](http://localhost:3030/api/catalog/?collection=женская%20коллекция): http://localhost:3030/api/catalog/?collection=название_коллекции"
    - [каталог по категории](http://localhost:3030/api/catalog/?categories=["одежда|блузки%20и%20рубашки"]): http://localhost:3030/api/catalog/?categories=["type|category",[...]]
    - [каталог по бренду](http://localhost:3030/api/catalog/?brands=["mango"]): http://localhost:3030/api/catalog/?brands=["название_бренда",[...]]
    - [каталог по цвету](http://localhost:3030/api/catalog/?colors=["white","черный"]): http://localhost:3030/api/catalog/?colors=["цвет",[...]]
    - [поиск по каталогу](http://localhost:3030/api/catalog/?filter=["брюки","white","лен"]): http://localhost:3030/api/catalog/?filter=["любое_слово_более_двух_букв",[...]]
    - [сортировка каталога](http://localhost:3030/api/catalog/?sortBy={"rating":"desc","price":"asc"}): http://localhost:3030/api/catalog/?sortBy={"поле":"способ_сортировки",[...]}
2. [Категории](http://localhost:3030/api/catalog/categories/): http://localhost:3030/api/catalog/categories/
3. [Бренды](http://localhost:3030/api/catalog/brands/): http://localhost:3030/api/catalog/brands/
4. [Палитра цветов](http://localhost:3030/api/catalog/colors/): http://localhost:3030/api/catalog/colors/
5. [Отзывы](http://localhost:3030/api/reviews/): http://localhost:3030/api/reviews/
6. Списки:
    - [города](http://localhost:3030/api/lists/cities/): http://localhost:3030/api/lists/cities/
    - [регионы](http://localhost:3030/api/lists/regions/): http://localhost:3030/api/lists/regions/
7. Корзина:
    - [список товаров](http://localhost:3030/api/cart/): http://localhost:3030/api/cart/
    - добавить товар: http://localhost:3030/api/cart/ (post)
    - увеличить количество товара: http://localhost:3030/api/cart/ (put)
    - убрать/уменьшить количество товара: http://localhost:3030/api/cart/ (delete)
    - очистить: http://localhost:3030/api/cart/clear/ (delete)
