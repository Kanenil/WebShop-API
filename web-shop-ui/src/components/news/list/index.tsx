const NewsListPage = () => {
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="container px-6 py-10 mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
              Новини
            </h1>

            <p className="max-w-lg mx-auto mt-4 text-gray-500">
                Тут ви знайдете останні новини та оновлення нашого сайту, включаючи інформацію про нові функції, поліпшення та зміни дизайну. Будьте в курсі всього, що стосується нашого сайту!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-2">
            <div>
              <img
                className="relative z-10 object-cover w-full rounded-md h-96"
                src="https://images.unsplash.com/photo-1644018335954-ab54c83e007f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt=""
              />

              <div className="relative z-20 max-w-lg p-6 mx-auto -mt-20 bg-white rounded-md shadow dark:bg-gray-900">
                <a
                  href="#"
                  className="font-semibold text-gray-800 hover:underline dark:text-white md:text-xl"
                >
                    Глобальне оновлення дизайну
                </a>

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-300 md:text-sm">
                    В цьому оновленні було кардинально змінено дизайн сайту, найголовніше, що
                    було добавлено, це зміна теми на сайті
                </p>

                <p className="mt-3 text-sm text-blue-500">23 Березня 2023</p>
              </div>
            </div>

            <div>
              <img
                className="relative z-10 object-cover w-full rounded-md h-96"
                src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt=""
              />

              <div className="relative z-20 max-w-lg p-6 mx-auto -mt-20 bg-white rounded-md shadow dark:bg-gray-900">
                <a
                  href="#"
                  className="font-semibold text-gray-800 hover:underline dark:text-white md:text-xl"
                >
                    Корзина тепер з нами
                </a>

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-300 md:text-sm">
                    В цьому онволені було добавлено коризину з товарами, як
                    зберігається в не залежності від вашого пристрою
                </p>

                <p className="mt-3 text-sm text-blue-500">20 Березня 2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default NewsListPage;
