import axios from "axios"
import Swal from "sweetalert2";
import {POIN_KELIPATAN_RO, HEADERS,NOTIF_ALERT} from "../_constants";
import {ToastQ} from "helper"

export function setLoading(load) {
    return {
        type: POIN_KELIPATAN_RO.LOADING,
        load
    }
}
export function setIsError(load) {
    return {
        type: POIN_KELIPATAN_RO.IS_ERROR,
        load
    }
}

export function setSuccess(data = []) {
    return {
        type: POIN_KELIPATAN_RO.SUCCESS,
        data
    }
}


export function setDataFailed(data = []) {
    return {
        type: POIN_KELIPATAN_RO.FAILED,
        data
    }
}

export const fetchDataPoinKeliparanRO = () => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `site/poin_kelipatan`)
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




export const insertDataPoinKeliparanRO = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        dispatch(setIsError(false));
        let url = HEADERS.URL + 'site/poin_kelipatan';
        axios.post(url, data)
            .then(function (response) {
                const datum = (response.data);
                if (datum.status === 'success') {
                    ToastQ.fire({
                        icon: 'success',
                        title: `Berhasil update`
                    });
                    dispatch(fetchDataPoinKeliparanRO());
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




export const updateDataPoinKeliparanRO = (data,id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        dispatch(setIsError(false));
        let url = HEADERS.URL + 'site/poin_kelipatan/'+id
        axios.put(url, data)
            .then(function (response) {
                const datum = (response.data);
                if (datum.status === 'success') {
                    ToastQ.fire({
                        icon: 'success',
                        title: `Berhasil update`
                    });
                    dispatch(fetchDataPoinKeliparanRO());
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

export const deleteDataPoinKeliparanRO = (id) => async dispatch =>{
    Swal.fire({
        title: 'Tunggu sebentar.',
        html: NOTIF_ALERT.CHECKING,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
        onClose: () => {}
    })

    axios.delete(HEADERS.URL+`site/poin_kelipatan/${id}`)
        .then(response=>{
            setTimeout(
                function () {
                    Swal.close() ;
                    const data = (response.data);
                    if (data.status === 'success') {
                        Swal.fire({
                            title: 'Success',
                            icon: 'success',
                            text: NOTIF_ALERT.SUCCESS,
                        });
                    } else {
                        Swal.fire({
                            title: 'failed',
                            icon: 'error',
                            text: NOTIF_ALERT.FAILED,
                        });
                    }
                    dispatch(setLoading(false));
                    dispatch(fetchDataPoinKeliparanRO());
                },800)

        }).catch(error =>{
        Swal.close()
        dispatch(setLoading(false));
        if (error.message === 'Network Error') {
            Swal.fire(
                'Network Failed!.',
                'Please check your connection',
                'error'
            );
        }
        else {
            Swal.fire({
                title: 'failed',
                icon: 'error',
                text: error.response.data.msg,
            });
            if (error.response) {

            }
        }

    });
}
