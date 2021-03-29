

import {BARANG_REWARD} from "../../actions/_constants";

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

export const barangRewardReducer = (state = initialState, action) => {
    switch (action.type) {
        case BARANG_REWARD.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case BARANG_REWARD.EDIT:
            return Object.assign({}, state, {
                edit: action.data.result,
            });
        case BARANG_REWARD.DETAIL:
            return Object.assign({}, state, {
                detail: action.data.result,
            });
        case BARANG_REWARD.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.data,
            });
        case BARANG_REWARD.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case BARANG_REWARD.LOADING_POST:
            return Object.assign({}, state, {
                isLoadingPost: action.load
            });
        case BARANG_REWARD.IS_ERROR:
            return Object.assign({}, state, {
                isError: action.load
            });
        default:
            return state
    }
}