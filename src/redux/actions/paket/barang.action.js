import axios from "axios"
import Swal from "sweetalert2";
import {BARANG, HEADERS,NOTIF_ALERT} from "../_constants";
import {ModalToggle} from "../modal.action";


export function setLoading(load) {
    return {
        type: BARANG.LOADING,
        load
    }
}
export function setLoadingPost(load) {
    return {
        type: BARANG.LOADING_POST,
        load
    }
}
export function setIsError(load) {
    return {
        type: BARANG.IS_ERROR,
        load
    }
}

export function setData(data = []) {
    return {
        type: BARANG.SUCCESS,
        data
    }
}

export function setDataEdit(data = []) {
    return {
        type: BARANG.EDIT,
        data
    }
}
export function setDataDetail(data = []) {
    return {
        type: BARANG.DETAIL,
        data
    }
}

export function setDataFailed(data = []) {
    return {
        type: BARANG.FAILED,
        data
    }
}

export const fetchBarang = (where) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = 'barang';
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


export const postBarang = (data,where='') => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        dispatch(setIsError(false));
        let url=`${HEADERS.URL}barang`;
        if(where!==''){
            url+=where;
        }
        // const url = HEADERS.URL + `barang`;
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
                    dispatch(ModalToggle(false));
                    dispatch(fetchBarang('page=1'));
                } else {
                    Swal.fire({
                        title: 'failed',
                        icon: 'error',
                        text: NOTIF_ALERT.FAILED,
                    });
                    dispatch(setIsError(false));
                    dispatch(ModalToggle(true));
                }
                dispatch(setLoadingPost(false));
            })
            .catch(function (error) {
                dispatch(setLoadingPost(false));
                dispatch(setIsError(false));
                dispatch(ModalToggle(true));
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
export const putBarang = (data,id) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        dispatch(setIsError(false));
        const url = HEADERS.URL + `barang/${id}`;
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
                    dispatch(ModalToggle(false));
                    dispatch(fetchBarang('page=1'));
                } else {
                    Swal.fire({
                        title: 'failed',
                        icon: 'error',
                        text: NOTIF_ALERT.FAILED,
                    });
                    dispatch(setIsError(false));
                    dispatch(ModalToggle(true));
                }
                dispatch(setLoadingPost(false));


            })
            .catch(function (error) {
                dispatch(setLoadingPost(false));
                dispatch(setIsError(false));
                dispatch(ModalToggle(true));
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
export const deleteBarang = (id) => async dispatch =>{
    Swal.fire({
        title: 'Tunggu sebentar.',
        html: NOTIF_ALERT.CHECKING,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
        onClose: () => {}
    })

    axios.delete(HEADERS.URL+`barang/${id}`)
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
                    dispatch(fetchBarang('page=1'));
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

