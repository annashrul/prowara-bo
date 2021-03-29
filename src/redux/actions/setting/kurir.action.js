import axios from "axios"
import Swal from "sweetalert2";
import {KURIR, HEADERS,NOTIF_ALERT} from "../_constants";
import {ModalToggle} from "../modal.action";
import {ToastQ} from "helper"

export function setLoading(load) {
    return {
        type: KURIR.LOADING,
        load
    }
}
export function setIsError(load) {
    return {
        type: KURIR.IS_ERROR,
        load
    }
}

export function setDataKecamatan(data = []) {
    return {
        type: KURIR.KECAMATAN,
        data
    }
}

export function setDataKota(data = []) {
    return {
        type: KURIR.KOTA,
        data
    }
}

export function setDataProv(data = []) {
    return {
        type: KURIR.PROVINSI,
        data
    }
}




export function setDataEdit(data = []) {
    return {
        type: KURIR.EDIT,
        data
    }
}
export function setDataDetail(data = []) {
    return {
        type: KURIR.DETAIL,
        data
    }
}

export function setDataFailed(data = []) {
    return {
        type: KURIR.FAILED,
        data
    }
}

export const fetchKecamatan = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `transaction/kurir/kecamatan?id=${id}`)
            .then(function (response) {
                const data = response.data;
                dispatch(setDataKecamatan(data));
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

export const fetchKota = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `transaction/kurir/kota?id=${id}`)
            .then(function (response) {
                const data = response.data;
                dispatch(setDataKota(data));
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
export const fetchProvinsi = () => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `transaction/kurir/provinsi`)
            .then(function (response) {
                const data = response.data;
                dispatch(setDataProv(data));
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