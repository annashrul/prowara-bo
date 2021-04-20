import axios from "axios";
import Swal from "sweetalert2";
import { USER_LEVEL, HEADERS, NOTIF_ALERT } from "../_constants";
import { ModalToggle } from "../modal.action";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

export function setLoading(load) {
  return {
    type: USER_LEVEL.LOADING,
    load,
  };
}

export function setLoadingDetail(load) {
  return {
    type: USER_LEVEL.LOADING_DETAIL,
    load,
  };
}
export function setLoadingPost(load) {
  return {
    type: USER_LEVEL.LOADING_POST,
    load,
  };
}
export function setIsError(load) {
  return {
    type: USER_LEVEL.IS_ERROR,
    load,
  };
}

export function setData(data = []) {
  return {
    type: USER_LEVEL.SUCCESS,
    data,
  };
}

export function setDataEdit(data = []) {
  return {
    type: USER_LEVEL.EDIT,
    data,
  };
}
export function setDataDetail(data = []) {
  return {
    type: USER_LEVEL.DETAIL,
    data,
  };
}

export function setDataFailed(data = []) {
  return {
    type: USER_LEVEL.FAILED,
    data,
  };
}

export const getUserLevel = (where) => {
  return (dispatch) => {
    NProgress.start();
    let url = "user_level";
    if (where) {
      url += `?${where}`;
    }

    axios
      .get(HEADERS.URL + `${url}`)
      .then(function (response) {
        const data = response.data;
        dispatch(setData(data));
        NProgress.done();
      })
      .catch(function (error) {
        NProgress.done();
        if (error.message === "Network Error") {
          Swal.fire(
            "Network Failed!.",
            "Please check your connection",
            "error"
          );
        }
      });
  };
};

export const postUserLevel = (data) => {
  return (dispatch) => {
    dispatch(setLoadingPost(true));
    dispatch(setIsError(false));
    const url = HEADERS.URL + `user_level`;
    axios
      .post(url, data)
      .then(function (response) {
        const data = response.data;
        if (data.status === "success") {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: NOTIF_ALERT.SUCCESS,
          });
          dispatch(setIsError(true));
          dispatch(getUserLevel(`page=1`));
          dispatch(ModalToggle(false));
        } else {
          Swal.fire({
            title: "failed",
            icon: "error",
            text: NOTIF_ALERT.FAILED,
          });
          dispatch(ModalToggle(true));
          dispatch(setIsError(false));
        }
        dispatch(setLoadingPost(false));
      })
      .catch(function (error) {
        dispatch(setLoadingPost(false));
        dispatch(setIsError(false));
        if (error.message === "Network Error") {
          Swal.fire(
            "Network Failed!.",
            "Please check your connection",
            "error"
          );
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
};

export const putUserLevel = (data, id) => {
  return (dispatch) => {
    dispatch(setLoadingPost(true));
    dispatch(setIsError(false));
    const url = HEADERS.URL + `user_level/${id}`;
    axios
      .put(url, data)
      .then(function (response) {
        const data = response.data;
        if (data.status === "success") {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: NOTIF_ALERT.SUCCESS,
          });
          dispatch(setIsError(true));
          dispatch(getUserLevel(`page=1`));
          dispatch(ModalToggle(false));
        } else {
          Swal.fire({
            title: "failed",
            icon: "error",
            text: NOTIF_ALERT.FAILED,
          });
          dispatch(ModalToggle(true));
          dispatch(setIsError(false));
        }
        dispatch(setLoadingPost(false));
      })
      .catch(function (error) {
        dispatch(setLoadingPost(false));
        dispatch(setIsError(false));
        if (error.message === "Network Error") {
          Swal.fire(
            "Network Failed!.",
            "Please check your connection",
            "error"
          );
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
};

export const deleteUserLevel = (id) => async (dispatch) => {
  Swal.fire({
    title: "Tunggu sebentar.",
    html: NOTIF_ALERT.CHECKING,
    onBeforeOpen: () => {
      Swal.showLoading();
    },
    onClose: () => {},
  });

  axios
    .delete(HEADERS.URL + `user_level/${id}`)
    .then((response) => {
      setTimeout(function () {
        Swal.close();
        const data = response.data;
        if (data.status === "success") {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: NOTIF_ALERT.SUCCESS,
          });
        } else {
          Swal.fire({
            title: "failed",
            icon: "error",
            text: NOTIF_ALERT.FAILED,
          });
        }
        dispatch(setLoading(false));
        dispatch(getUserLevel(`page=1`));
      }, 800);
    })
    .catch((error) => {
      Swal.close();
      dispatch(setLoading(false));
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
