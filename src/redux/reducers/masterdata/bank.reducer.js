

import {BANK} from "../../actions/_constants";

const initialState = {
    isLoadingDetail: true,
    status: "",
    msg: "",
    data: [],
}

export const bankReducer = (state = initialState, action) => {
    switch (action.type) {
        case BANK.DETAIL:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result.data,
            });
        case BANK.LOADING_DETAIL:
            return Object.assign({}, state, {
                isLoadingDetail: action.load
            });
        default:
            return state
    }
}