import axios from "axios";
import Swal from "sweetalert2";
import { GENERAL, HEADERS } from "../_constants";
import { ModalToggle } from "../modal.action";
import { ToastQ } from "helper";

export function setLoading(load) {
  return {
    type: GENERAL.LOADING,
    load,
  };
}
export function setIsError(load) {
  return {
    type: GENERAL.IS_ERROR,
    load,
  };
}
export function setData(data = []) {
  return {
    type: GENERAL.SUCCESS,
    data,
  };
}
export function setDataFailed(data = []) {
  return {
    type: GENERAL.FAILED,
    data,
  };
}

export const fetchGeneral = (where) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `site/config`)
      .then(function (response) {
        const data = response.data;
        dispatch(setData(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        dispatch(setLoading(false));
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

export const updateGeneral = (data, type = "site") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    dispatch(setIsError(false));
    let url = HEADERS.URL;
    if (type !== "site") url += "site/config/general";
    else url += "site/config/alokasi";
    axios
      .put(url, data)
      .then(function (response) {
        const datum = response.data;
        if (datum.status === "success") {
          ToastQ.fire({
            icon: "success",
            title: `Berhasil update ${Object.keys(data)[0]}`,
          });
          dispatch(setIsError(true));
          dispatch(fetchGeneral("page=1"));
        } else {
          ToastQ.fire({
            icon: "error",
            title: `Gagal update ${Object.keys(data)[0]}`,
          });
          dispatch(setIsError(false));
        }
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        dispatch(setLoading(false));
        dispatch(setIsError(false));
        dispatch(ModalToggle(true));
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
