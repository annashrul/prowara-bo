import axios from "axios"
import Swal from "sweetalert2";
import {BANK, HEADERS} from "../_constants";



export function setLoadingDetail(load) {
    return {
        type: BANK.LOADING_DETAIL,
        load
    }
}
export function setDataDetail(data = []) {
    return {
        type: BANK.DETAIL,
        data
    }
}


export const getDetailBank = (where) => {
    return (dispatch) => {
        dispatch(setLoadingDetail(true));
        let url = `bank_member?id_member=${where}`;
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

