

import {BARANG} from "../../actions/_constants";

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

export const barangReducer = (state = initialState, action) => {
    switch (action.type) {
        case BARANG.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case BARANG.EDIT:
            return Object.assign({}, state, {
                edit: action.data.result,
            });
        case BARANG.DETAIL:
            return Object.assign({}, state, {
                detail: action.data.result,
            });
        case BARANG.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.data,
            });
        case BARANG.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case BARANG.LOADING_POST:
            return Object.assign({}, state, {
                isLoadingPost: action.load
            });
        case BARANG.IS_ERROR:
            return Object.assign({}, state, {
                isError: action.load
            });
        default:
            return state
    }
}