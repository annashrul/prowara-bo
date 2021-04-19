import { combineReducers } from "redux";
import { modalReducer, modalTypeReducer } from "./modal.reducer";
import { dashboardReducer } from "./dashboard/dashboard.reducer";
import authReducer from "./authReducer";
import errorsReducer from "./errorsReducer";
import { siteReducer } from "./site.reducer";
import { kategoriReducer } from "./kategori/kategori.reducer";
import { pinReducer } from "./paket/pin.reducer";
import { paketReducer } from "./paket/paket.reducer";
import { memberReducer } from "./masterdata/member.reducer";
import { alamatReducer } from "./masterdata/alamat.reducer";
import { bankReducer } from "./masterdata/bank.reducer";
import { contentReducer } from "./konten/konten.reducer";
import { userListReducer } from "./masterdata/user_list.reducer";
import { userLevelReducer } from "./masterdata/user_level.reducer";
import { depositReducer } from "./ewallet/deposit.reducer";
import { penarikanReducer } from "./ewallet/penarikan.reducer";
import { saldoReducer } from "./ewallet/saldo.reducer";
import { generalReducer } from "./setting/general.reducer";
import { banksReducer } from "./setting/bank.reducer";

export default combineReducers({
  modalReducer,
  modalTypeReducer,
  dashboardReducer,
  siteReducer,
  pinReducer,
  paketReducer,
  memberReducer,
  alamatReducer,
  bankReducer,
  userListReducer,
  userLevelReducer,
  kategoriReducer,
  contentReducer,
  depositReducer,
  penarikanReducer,
  saldoReducer,
  generalReducer,
  banksReducer,
  auth: authReducer,
  errors: errorsReducer,
});
