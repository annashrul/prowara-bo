import { REPORT_TRANSAKSI_MEMBER } from "../../actions/_constants";

const initialState = {
  isLoading: true,
  isLoadingDetail: true,
  isLoadingPost: false,
  isLoadingExcel: false,
  isError: false,
  status: "",
  msg: "",
  data: [],
  edit: [],
  detail: [],
  excel: [],
};

export const reportTransaksiMemberReducer = (state = initialState, action) => {
  switch (action.type) {
    case REPORT_TRANSAKSI_MEMBER.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });

    case REPORT_TRANSAKSI_MEMBER.DETAIL:
      return Object.assign({}, state, {
        detail: action.data.result,
      });
    case REPORT_TRANSAKSI_MEMBER.EXCEL:
      return Object.assign({}, state, {
        excel: action.data.result,
      });

    case REPORT_TRANSAKSI_MEMBER.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case REPORT_TRANSAKSI_MEMBER.LOADING_EXCEL:
      return Object.assign({}, state, {
        isLoadingExcel: action.load,
      });
    case REPORT_TRANSAKSI_MEMBER.LOADING_DETAIL:
      return Object.assign({}, state, {
        isLoadingDetail: action.load,
      });
    case REPORT_TRANSAKSI_MEMBER.LOADING_POST:
      return Object.assign({}, state, {
        isLoadingPost: action.load,
      });

    default:
      return state;
  }
};
