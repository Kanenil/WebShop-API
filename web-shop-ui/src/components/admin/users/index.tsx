import classNames from "classnames";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import usericon from "../../../assets/user.jpg";
import { APP_ENV } from "../../../env";
import http from "../../../http";
import Pagination from "../../common/pagination";
import { IUserSearch, IUserSearchResult } from "./types";
import UserView from "./UserView";

function validateURL(url: string) {
  return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
    url
  );
}

const UsersList = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<IUserSearch>({
    page: searchParams.get("page") || 1,
    countOnPage: searchParams.get("countOnPage") || 10,
    search: searchParams.get("search") || ''
  });
  const [data, setData] = useState<IUserSearchResult>({
    pages: 0,
    users: [],
    total: 0,
    currentPage: 0,
  });

  useEffect(() => {
    http
      .get<IUserSearchResult>("/api/users", {
        params: search,
      })
      .then((resp) => {
        setData(resp.data);
      });
  }, [search]);

  const onPageChange = (page: number) => setSearch({ ...search, page });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Замовлення
          </h1>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                    >
                      Ім'я
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Заблокований
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Email підтверджений
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {data.users.map((user) => (
                    <tr key={"col-" + user.email}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={
                                user.image
                                  ? validateURL(user.image)
                                    ? user.image
                                    : `${APP_ENV.IMAGE_PATH}100x100_${user.image}`
                                  : usericon
                              }
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.fullname}
                            </div>
                            <div className="text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={classNames(
                            "inline-flex rounded-ful px-2 text-xs font-semibold leading-5",
                            {
                              "bg-green-100 text-green-800":
                              !user.banned,
                            },
                            {
                              "bg-red-100 text-red-800":
                              user.banned,
                            }
                          )}
                        >
                          {user.banned?`Заблокований до ${user.bannedTo}`:'Не заблокований'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-200">
                      <span
                          className={classNames(
                            "inline-flex rounded-ful px-2 text-xs font-semibold leading-5",
                            {
                              "bg-green-100 text-green-800":
                              user.emailConfirmed,
                            },
                            {
                              "bg-red-100 text-red-800":
                              !user.emailConfirmed,
                            }
                          )}
                        >
                          {user.emailConfirmed?'Підтверджений':'Не підтверджений'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <UserView user={user} onSubmit={()=>{setSearch({ ...search, page: 1 });}}/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Pagination
        pages={data.pages}
        currentPage={data.currentPage}
        search={search}
        onClick={onPageChange}
      />
    </div>
  );

};
export default UsersList;
