

import {ALAMAT} from "../../actions/_constants";

const initialState = {
    isLoadingDetail: true,
    status: "",
    msg: "",
    data: [],
}

export const alamatReducer = (state = initialState, action) => {
    switch (action.type) {
        case ALAMAT.DETAIL:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result.data,
            });
        case ALAMAT.LOADING_DETAIL:
            return Object.assign({}, state, {
                isLoadingDetail: action.load
            });
        default:
            return state
    }
}