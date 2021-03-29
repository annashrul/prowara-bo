import axios from "axios"
import Swal from "sweetalert2";
import {GENERAL, HEADERS,NOTIF_ALERT,KURIR} from "../_constants";
import {ModalToggle} from "../modal.action";
import {ToastQ} from "helper"

export function setLoading(load) {
    return {
        type: GENERAL.LOADING,
        load
    }
}
export function setIsError(load) {
    return {
        type: GENERAL.IS_ERROR,
        load
    }
}
export function setLoadingKurir(data = []) {
    return {
        type: KURIR.LOADING,
        data
    }
}
export function setKurir(data = []) {
    return {
        type: KURIR.SUCCESS,
        data
    }
}
export function setData(data = []) {
    return {
        type: GENERAL.SUCCESS,
        data
    }
}
export function setDataLanding(data = []) {
    return {
        type: GENERAL.LANDING,
        data
    }
}
export function setDataPlafon(data = []) {
    return {
        type: GENERAL.PLAFON,
        data
    }
}
export function setDataKarir(data = []) {
    return {
        type: GENERAL.KARIR,
        data
    }
}

export function setDataEdit(data = []) {
    return {
        type: GENERAL.EDIT,
        data
    }
}
export function setDataDetail(data = []) {
    return {
        type: GENERAL.DETAIL,
        data
    }
}

export function setDataFailed(data = []) {
    return {
        type: GENERAL.FAILED,
        data
    }
}

export const fetchGeneral = (where) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `site/data`)
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

export const updateGeneral = (data,type='site') => {
    return (dispatch) => {
        dispatch(setLoading(true));
        dispatch(setIsError(false));
        let url = HEADERS.URL;
        if (type !== 'site') url += 'site/general'
        else url+='site/data'
        axios.put(url, data)
            .then(function (response) {
                const datum = (response.data);
                if (datum.status === 'success') {
                    ToastQ.fire({
                        icon: 'success',
                        title: `Berhasil update ${Object.keys(data)[0]}`
                    });
                    dispatch(setIsError(true));
                    dispatch(fetchGeneral('page=1'));
                } else {
                     ToastQ.fire({
                        icon: 'error',
                        title: `Gagal update ${Object.keys(data)[0]}`
                    });
                    dispatch(setIsError(false));
                }
                dispatch(setLoading(false));


            })
            .catch(function (error) {
                dispatch(setLoading(false));
                dispatch(setIsError(false));
                dispatch(ModalToggle(true));
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

export const fetchPlafon = ()=> {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `site/plafon`)
            .then(function (response) {
                const data = response.data;
                dispatch(setDataPlafon(data));
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

export const updatePlafon = (data, id, title) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        dispatch(setIsError(false));
        let url = HEADERS.URL + 'site/plafon/'+id
        axios.put(url, data)
            .then(function (response) {
                const datum = (response.data);
                if (datum.status === 'success') {
                    ToastQ.fire({
                        icon: 'success',
                        title: `Berhasil update ${title}`
                    });
                    dispatch(setIsError(true));
                } else {
                    ToastQ.fire({
                        icon: 'error',
                        title: `Gagal update ${title}`
                    });
                    dispatch(setIsError(false));
                }
                dispatch(setLoading(false));


            })
            .catch(function (error) {
                dispatch(setLoading(false));
                dispatch(setIsError(false));
                dispatch(ModalToggle(true));
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

export const fetchKarir = ()=> {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `site/karir`)
            .then(function (response) {
                const data = response.data;
                dispatch(setDataKarir(data));
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

export const updateKarir = (data, id, title) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        dispatch(setIsError(false));
        let url = HEADERS.URL + 'site/karir/' + id
        axios.put(url, data)
            .then(function (response) {
                const datum = (response.data);
                if (datum.status === 'success') {
                    ToastQ.fire({
                        icon: 'success',
                        title: `Berhasil update ${title}`
                    });
                    dispatch(setIsError(true));
                } else {
                    ToastQ.fire({
                        icon: 'error',
                        title: `Gagal update ${title}`
                    });
                    dispatch(setIsError(false));
                }
                dispatch(fetchKarir());
                dispatch(ModalToggle(false));
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

export const fetchLanding = () => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `site/landing/data`)
            .then(function (response) {
                const data = response.data;
                dispatch(setDataLanding(data));
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

export const updateLanding = (data, id, title) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        dispatch(setIsError(false));
        let url = HEADERS.URL + 'site/landing/' + id
        axios.put(url, data)
            .then(function (response) {
                const datum = (response.data);
                if (datum.status === 'success') {
                    ToastQ.fire({
                        icon: 'success',
                        title: `Berhasil update ${title}`
                    });
                    dispatch(fetchLanding())
                    dispatch(setIsError(true));
                } else {
                    ToastQ.fire({
                        icon: 'error',
                        title: `Gagal update ${title}`
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

export const fetchKurir = ()=> {
    return (dispatch) => {
        dispatch(setLoadingKurir(true));
        axios.get(HEADERS.URL + `transaction/kurir`)
            .then(function (response) {
                const data = response.data;
                dispatch(setKurir(data));
                dispatch(setLoadingKurir(false));
            })
            .catch(function (error) {
                dispatch(setLoadingKurir(false));
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


export const updateKurir = (data,id) => async dispatch =>{
    Swal.fire({
        title: 'Tunggu sebentar.',
        html: NOTIF_ALERT.CHECKING,
        onBeforeOpen: () => {
            Swal.showLoading()
        },
        onClose: () => {}
    })

    axios.put(HEADERS.URL+`transaction/kurir/${id}`,data)
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
                    dispatch(fetchKurir());
                },800)

        }).catch(error =>{
        Swal.close()
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
