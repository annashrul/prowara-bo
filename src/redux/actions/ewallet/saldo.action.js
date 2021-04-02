import axios from "axios"
import Swal from "sweetalert2";
import {SALDO, HEADERS} from "../_constants";


export function setLoading(load) {
    return {
        type: SALDO.LOADING,
        load
    }
}
export function setLoadingExcel(load) {
    return {
        type: SALDO.LOADING_EXCEL,
        load
    }
}


export function setLoadingDetail(load) {
    return {
        type: SALDO.LOADING_DETAIL,
        load
    }
}
export function setLoadingPost(load) {
    return {
        type: SALDO.LOADING_POST,
        load
    }
}
export function setIsError(load) {
    return {
        type: SALDO.IS_ERROR,
        load
    }
}

export function setData(data = []) {
    return {
        type: SALDO.SUCCESS,
        data
    }
}
export function setExcel(data = []) {
    return {
        type: SALDO.EXCEL,
        data
    }
}

export function setDataEdit(data = []) {
    return {
        type: SALDO.EDIT,
        data
    }
}
export function setDataDetail(data = []) {
    return {
        type: SALDO.DETAIL,
        data
    }
}

export function setDataFailed(data = []) {
    return {
        type: SALDO.FAILED,
        data
    }
}

export const getLaporanSaldo = (where='') => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = 'transaction/history/member';
        if(where!==''){
            url+=`?${where}`;
        }
        axios.get(HEADERS.URL + `${url}`)
            .then(function (response) {
                const data = response.data;
                dispatch(setData(data));
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

export const getDetailLaporanSaldo = (where='') => {
    return (dispatch) => {
        dispatch(setLoadingDetail(true));
        let url = 'transaction/history';
        if(where!==''){
            url+=`?${where}`;
        }
        axios.get(HEADERS.URL + `${url}`)
            .then(function (response) {
                const data = response.data;
                dispatch(setDataDetail(data));
                dispatch(setLoadingDetail(false));
            })
            .catch(function (error) {
                dispatch(setLoadingDetail(false));
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

export const getExcelLaporanSaldo = (where = '') => {
    return (dispatch) => {
        dispatch(setLoadingExcel(true));
        let url = 'transaction/history/member';
        if (where !== '') {
            url += `?${where}`;
        }
        console.log(url);
        axios.get(HEADERS.URL + `${url}`)
            .then(function (response) {
                const data = response.data;
                console.log("RESPONSE EXCEL",response);
                dispatch(setExcel(data));
                dispatch(setLoadingExcel(false));
            })
            .catch(function (error) {
                dispatch(setLoadingExcel(false));
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
