import axios from "axios"
import Swal from "sweetalert2";
import {KONFIGURASI_STOCKIST, HEADERS,NOTIF_ALERT} from "../_constants";
import {ToastQ} from "helper"

export function setLoading(load) {
    return {
        type: KONFIGURASI_STOCKIST.LOADING,
        load
    }
}
export function setIsError(load) {
    return {
        type: KONFIGURASI_STOCKIST.IS_ERROR,
        load
    }
}

export function setSuccess(data = []) {
    return {
        type: KONFIGURASI_STOCKIST.SUCCESS,
        data
    }
}

export const fetchKonfigurasiStokis = () => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `site/stockist`)
            .then(function (response) {
                const data = response.data;
                dispatch(setSuccess(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                if (error.message === 'Network Error') {
                    Swal.fire(
                        'Network Failed!.',
                        'Please check your connection',
                        'error'
                    );
                }
            })

    }
};








export const updateKonfigurasiStokis = (data,id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        dispatch(setIsError(false));
        let url = HEADERS.URL + 'site/stockist/'+id
        axios.put(url, data)
            .then(function (response) {
                const datum = (response.data);
                if (datum.status === 'success') {
                    ToastQ.fire({
                        icon: 'success',
                        title: `Berhasil update`
                    });
                    dispatch(fetchKonfigurasiStokis());
                    dispatch(setIsError(true));

                } else {
                    ToastQ.fire({
                        icon: 'error',
                        title: `Gagal update`
                    });
                    dispatch(setIsError(false));
                }
                dispatch(setLoading(false));


            })
            .catch(function (error) {
                dispatch(setLoading(false));
                dispatch(setIsError(false));
                if (error.message === 'Network Error') {
                    Swal.fire(
                        'Network Failed!.',
                        'Please check your connection',
                        'error'
                    );
                } else {
                    Swal.fire({
                        title: 'failed',
                        icon: 'error',
                        text: error.response.data.msg,
                    });

                    if (error.response) {

                    }
                }

            })
    }
}

