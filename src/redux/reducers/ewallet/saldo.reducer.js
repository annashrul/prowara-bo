

import {SALDO} from "../../actions/_constants";

const initialState = {
    isLoading: true,
    isLoadingDetail: true,
    isLoadingPost: false,
    isLoadingExcel: false,
    isError: false,
    status: "",
    msg: "",
    data: [],
    edit:[],
    detail:[],
    excel:[],
}

export const saldoReducer = (state = initialState, action) => {
    switch (action.type) {
        case SALDO.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });

        case SALDO.DETAIL:
            return Object.assign({}, state, {
                detail: action.data.result,
            });
        case SALDO.EXCEL:
            return Object.assign({}, state, {
                excel: action.data.result,
            });
        case SALDO.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.data,
            });
        case SALDO.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case SALDO.LOADING_EXCEL:
            return Object.assign({}, state, {
                isLoadingExcel: action.load
            });
        case SALDO.LOADING_DETAIL:
            return Object.assign({}, state, {
                isLoadingDetail: action.load
            });
        case SALDO.LOADING_POST:
            return Object.assign({}, state, {
                isLoadingPost: action.load
            });
        case SALDO.IS_ERROR:
            return Object.assign({}, state, {
                isError: action.load
            });
        default:
            return state
    }
}