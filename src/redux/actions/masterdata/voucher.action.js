import axios from "axios"
import Swal from "sweetalert2";
import {VOUCHER, HEADERS,NOTIF_ALERT} from "../_constants";
import {ModalToggle} from "../modal.action";


export function setLoading(load) {
    return {
        type: VOUCHER.LOADING,
        load
    }
}


export function setLoadingDetail(load) {
    return {
        type: VOUCHER.LOADING_DETAIL,
        load
    }
}
export function setLoadingPost(load) {
    return {
        type: VOUCHER.LOADING_POST,
        load
    }
}
export function setIsError(load) {
    return {
        type: VOUCHER.IS_ERROR,
        load
    }
}

export function setData(data = []) {
    return {
        type: VOUCHER.SUCCESS,
        data
    }
}

export function setDataEdit(data = []) {
    return {
        type: VOUCHER.EDIT,
        data
    }
}
export function setDataDetail(data = []) {
    return {
        type: VOUCHER.DETAIL,
        data
    }
}

export function setDataFailed(data = []) {
    return {
        type: VOUCHER.FAILED,
        data
    }
}

export const getVoucher = (where) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = 'voucher';
        if(where){
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


export const postVoucher = (data) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        dispatch(setIsError(false));
        const url = HEADERS.URL + `voucher`;
        axios.post(url,data)
            .then(function (response) {
                const data = (response.data);
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        icon: 'success',
                        text: NOTIF_ALERT.SUCCESS,
                    });
                    dispatch(setIsError(true));
                    dispatch(getVoucher(`page=1`));
                    dispatch(ModalToggle(false));
                } else {
                    Swal.fire({
                        title: 'failed',
                        icon: 'error',
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
                if (error.message === 'Network Error') {
                    Swal.fire(
                        'Network Failed!.',
                        'Please check your connection',
                        'error'
                    );
                }
                else{
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

export const putVoucher = (data,id) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        dispatch(setIsError(false));
        const url = HEADERS.URL + `voucher/${id}`;
        axios.put(url,data)
            .then(function (response) {
                const data = (response.data);
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        icon: 'success',
                        text: NOTIF_ALERT.SUCCESS,
                    });
                    dispatch(setIsError(true));
                    dispatch(getVoucher(`page=1`));
                    dispatch(ModalToggle(false));
                } else {
                    Swal.fire({
                        title: 'failed',
                        icon: 'error',
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
                if (error.message === 'Network Error') {
                    Swal.fire(
                        'Network Failed!.',
                        'Please check your connection',
                        'error'
                    );
                }
                else{
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


export const deleteVoucher = (id) => async dispatch =>{
    Swal.fire({
        title: 'Tunggu sebentar.',
        html: NOTIF_ALERT.CHECKING,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
        onClose: () => {}
    })

    axios.delete(HEADERS.URL+`voucher/${id}`)
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
                    dispatch(getVoucher(`page=1`));
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
