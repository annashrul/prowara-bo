import { HEADERS } from "./actions/_constants";
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

export async function configure() {
  // await localforage.defineDriver(memoryDriver);
  // const forageStore = localforage.createInstance({
  // driver: [
  //   localforage.INDEXEDDB,
  //   localforage.LOCALSTORAGE,
  //   memoryDriver._driver,
  // ],
  //   name: "prowaracache",
  // });
  // return setup({
  //   baseURL: HEADERS.URL,
  //   cache: {
  //     maxAge: 15 * 60 * 1000,
  //     store: forageStore, // Pass `localforage` store to `axios-cache-adapter`
  //   },
  // });
}

export function handleGet(url, callback) {
  Nprogress.start();
  get(HEADERS.URL + url, {
    cache: {
      key: "prowara",
      groups: ["prowara"],
    },
  })
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
  // configure()
  //   .then(async (api) => {
  //     const response = await api.get(url);
  //     const data = response.data;
  //     callback(data);
  //     Nprogress.done();
  //   })
  //   .catch(function (error) {
  //     Nprogress.done();
  //     if (error.message === "Network Error") {
  //       Swal.fire("Terjadi Kesalahan", "cek koneksi internet anda", "error");
  //     }
  //   });
}

const CACHE_MAX_AGE = 2 * 60 * 60 * 1000;

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
    query: false,
    filter: (req) => {
      return req.cache && req.cache.exclude;
    },
  },
  key: (req) => {
    return (req.cache && req.cache.key) || req.url;
  },
  maxAge: CACHE_MAX_AGE,
  store: cacheStore,
  readHeaders: false,
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
