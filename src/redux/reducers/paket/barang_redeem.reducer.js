

import {BARANG_REDEEM} from "../../actions/_constants";

const initialState = {
    isLoading: true,
    isLoadingPost: false,
    isError: false,
    status: "",
    msg: "",
    data: [],
    edit:[],
    detail:[]
}

export const barangRedeemReducer = (state = initialState, action) => {
    switch (action.type) {
        case BARANG_REDEEM.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case BARANG_REDEEM.EDIT:
            return Object.assign({}, state, {
                edit: action.data.result,
            });
        case BARANG_REDEEM.DETAIL:
            return Object.assign({}, state, {
                detail: action.data.result,
            });
        case BARANG_REDEEM.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.data,
            });
        case BARANG_REDEEM.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case BARANG_REDEEM.LOADING_POST:
            return Object.assign({}, state, {
                isLoadingPost: action.load
            });
        case BARANG_REDEEM.IS_ERROR:
            return Object.assign({}, state, {
                isError: action.load
            });
        default:
            return state
    }
}