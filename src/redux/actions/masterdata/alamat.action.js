import axios from "axios"
import Swal from "sweetalert2";
import {ALAMAT, HEADERS} from "../_constants";



export function setLoadingDetail(load) {
    return {
        type: ALAMAT.LOADING_DETAIL,
        load
    }
}
export function setDataDetail(data = []) {
    return {
        type: ALAMAT.DETAIL,
        data
    }
}


export const getDetailAlamat = (where) => {
    return (dispatch) => {
        dispatch(setLoadingDetail(true));
        let url = `alamat?id_member=${where}`;
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
