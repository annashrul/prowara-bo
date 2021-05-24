import { HEADERS, NOTIF_ALERT } from "./actions/_constants";
// import localforage from "localforage";
import memoryDriver from "localforage-memoryStorageDriver";
// import { setup } from "axios-cache-adapter";

import Swal from "sweetalert2";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import Axios from "axios";
import { setupCache } from "axios-cache-adapter";
import localforage from "localforage";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";

export function handleGet(url, callback, isClear = false) {
  Nprogress.start();
  // if (isClear) {
  //   purgeCache().then((res) => {});
  // }
  Axios.get(HEADERS.URL + url)
    .then(async (api) => {
      const data = api.data;
      callback(data);
      Nprogress.done();
    })
    .catch(function (error) {
      Nprogress.done();
      if (error.message === "Network Error") {
        Swal.fire("Terjadi Kesalahan", "cek koneksi internet anda", "error");
      }
    });
}
export const handlePost = (url, data, callback) => {
  Axios.post(HEADERS.URL + url, data)
    .then(function (response) {
      const data = response.data;
      if (data.status === "success") {
        purgeCache().then((res) => {});

        Swal.fire({
          title: "Success",
          icon: "success",
          text: NOTIF_ALERT.SUCCESS,
        });
        callback(true);
      } else {
        Swal.fire({
          title: "failed",
          icon: "error",
          text: NOTIF_ALERT.FAILED,
        });
        callback(false);
      }
    })
    .catch(function (error) {
      callback(false);
      if (error.message === "Network Error") {
        Swal.fire("Network Failed!.", "Please check your connection", "error");
      } else {
        Swal.fire({
          title: "failed",
          icon: "error",
          text: error.response.data.msg,
        });

        if (error.response) {
        }
      }
    });
};

export const handlePut = (url, data, callback) => {
  Axios.put(HEADERS.URL + url, data)
    .then(function (response) {
      const data = response.data;
      if (data.status === "success") {
        purgeCache().then((res) => {});

        Swal.fire({
          title: "Success",
          icon: "success",
          text: NOTIF_ALERT.SUCCESS,
        });
        callback(true);
      } else {
        Swal.fire({
          title: "failed",
          icon: "error",
          text: NOTIF_ALERT.FAILED,
        });
        callback(false);
      }
    })
    .catch(function (error) {
      callback(false);
      if (error.message === "Network Error") {
        Swal.fire("Network Failed!.", "Please check your connection", "error");
      } else {
        Swal.fire({
          title: "failed",
          icon: "error",
          text: error.response.data.msg,
        });

        if (error.response) {
        }
      }
    });
};

export const handleDelete = (url, callback) => {
  Swal.fire({
    title: "Tunggu sebentar.",
    html: NOTIF_ALERT.CHECKING,
    onBeforeOpen: () => {
      Swal.showLoading();
    },
    onClose: () => {},
  });

  Axios.delete(HEADERS.URL + url)
    .then((response) => {
      setTimeout(function () {
        Swal.close();
        const data = response.data;
        if (data.status === "success") {
          purgeCache().then((res) => {});

          Swal.fire({
            title: "Success",
            icon: "success",
            text: NOTIF_ALERT.SUCCESS,
          });
          callback(true);
        } else {
          Swal.fire({
            title: "failed",
            icon: "error",
            text: NOTIF_ALERT.FAILED,
          });
          callback(false);
        }
      }, 800);
    })
    .catch((error) => {
      Swal.close();
      callback(false);

      if (error.message === "Network Error") {
        Swal.fire("Network Failed!.", "Please check your connection", "error");
      } else {
        Swal.fire({
          title: "failed",
          icon: "error",
          text: error.response.data.msg,
        });
        if (error.response) {
        }
      }
    });
};

const CACHE_MAX_AGE = 120000;

function exclude(config = {}, req) {
  const { exclude = {}, debug } = config;

  if (typeof exclude.filter === "function" && exclude.filter(req)) {
    debug(`Excluding request by filter ${req.url}`);

    return true;
  }

  // do not cache request with query
  const hasQueryParams = req.url.match(/\?.*$/) || !isEmpty(req.params);

  if (exclude.query && hasQueryParams) {
    debug(`Excluding request by query ${req.url}`);

    return true;
  }

  const paths = exclude.paths || [];
  const found = find(paths, (regexp) => req.url.match(regexp));

  if (found) {
    debug(`Excluding request by url match ${req.url}`);

    return true;
  }

  return false;
}
localforage.defineDriver(memoryDriver);

const cacheStore = localforage.createInstance({
  driver: [
    localforage.INDEXEDDB,
    localforage.LOCALSTORAGE,
    memoryDriver._driver,
  ],
  name: "prowara-project",
});

const cacheAdapter = setupCache({
  clearOnStale: false,
  debug: false,
  exclude: {
    // query: false,
    filter: (req) => {
      return req.cache && req.cache.exclude;
    },
  },
  // key: (req) => {
  //   return (req.cache && req.cache.key) || req.url;
  // },
  maxAge: CACHE_MAX_AGE,
  store: cacheStore,
  validateStatus: function () {
    return true;
  },
  readOnError: (error, request) => {
    return error.response.status >= 400 && error.response.status < 600;
  },
  invalidate: async (config, request) => {
    if (request.data && typeof request.data === "string") {
      let data = JSON.parse(request.data);

      if (data.clearCacheEntry) {
        await config.store.removeItem(config.uuid);
      }

      if (data.purgeCache) {
        config.store.store = {};
      }
    }
  },
  // readHeaders: false,
});

const getKey = cacheAdapter.config.key;
const debug = cacheAdapter.config.debug;
const myAdapter = function (adapter) {
  return async function (req) {
    const isExcluded = exclude(cacheAdapter.config, req);
    const key = getKey(req);

    // Add the key to the groups.
    if (!isExcluded && req.cache && req.cache.groups) {
      const groupsCacheKey = "__groups";
      const groupsKeys = (await cacheStore.getItem(groupsCacheKey)) || {};
      let hasSetAny = false;

      // Loop over each group.
      for (let group of req.cache.groups) {
        if (!(group in groupsKeys)) {
          groupsKeys[group] = [];
        }
        if (groupsKeys[group].indexOf(key) < 0) {
          hasSetAny = true;
          groupsKeys[group].push(key);
        }
      }

      // Commit the changes.
      if (hasSetAny) {
        await cacheStore.setItem(groupsCacheKey, groupsKeys);
      }
    }

    let res;
    try {
      res = await adapter(req);
    } catch (e) {
      debug("request-failed", req.url);
      if (
        e.request &&
        req.cache &&
        req.cache.useOnNetworkError &&
        !isExcluded
      ) {
        res = await cacheStore.getItem(key);
        if (res && res.data) {
          res = res.data;
          res.config = req;
          res.request = {
            networkError: true,
            fromCache: true,
          };
          return res;
        }
      }

      throw e;
    }

    return res;
  };
};

const axios = Axios.create({
  adapter: myAdapter(cacheAdapter.adapter),
  cache: {
    key: null,
    useOnNetworkError: true,
  },
  // withCredentials: true,
});

const get = async function (url, config) {
  return axios.get(url, config);
};

const clearCacheByKey = async function (key) {
  let result = await cacheStore.getItem(key);
  if (result && "expires" in result) {
    result.expires = 1;
    await cacheStore.setItem(key, result);
  }
};

const clearCacheByGroup = async function (group) {
  const groups = (await cacheStore.getItem("__groups")) || {};
  const keys = groups[group] || [];
  for (let key of keys) {
    await clearCacheByKey(key);
  }
};

const clearCacheByGroups = function (groups) {
  return Promise.all(groups.map(clearCacheByGroup));
};

const purgeCache = async function () {
  await cacheStore.clear();
};

export default {
  get,
  post: axios.post,
  clearCacheByKey,
  clearCacheByGroup,
  clearCacheByGroups,
  purgeCache,
};
