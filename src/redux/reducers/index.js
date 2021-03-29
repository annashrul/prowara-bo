import { combineReducers } from 'redux';
import { modalReducer, modalTypeReducer } from './modal.reducer';
import { dashboardReducer } from './dashboard/dashboard.reducer'
import authReducer from './authReducer';
import errorsReducer from './errorsReducer';
import {siteReducer} from './site.reducer';
import {paketReducer} from "./paket/paket.reducer";
import {barangReducer} from "./paket/barang.reducer";
import {kategoriReducer} from "./kategori/kategori.reducer";
import {pinReducer} from "./paket/pin.reducer";
import {memberReducer} from "./masterdata/member.reducer";
import {alamatReducer} from "./masterdata/alamat.reducer";
import {bankReducer} from "./masterdata/bank.reducer";
import {contentReducer} from "./konten/konten.reducer";
import {userListReducer} from "./masterdata/user_list.reducer";
import {userLevelReducer} from "./masterdata/user_level.reducer";
import {laporanPenjualanReducer} from "./laporan/laporan_penjualan.reducer";
import {bonusReducer} from "./laporan/bonus.reducer";
import {depositReducer} from "./ewallet/deposit.reducer";
import {penarikanReducer} from "./ewallet/penarikan.reducer";
import {saldoReducer} from "./ewallet/saldo.reducer";
import {generalReducer} from './setting/general.reducer';
import {kurirReducer} from './setting/kurir.reducer';
import {bonusSettingReducer} from './setting/configbonus.reducer'
import {banksReducer} from './setting/bank.reducer'
import {barangRedeemReducer} from "./paket/barang_redeem.reducer";
import {barangRewardReducer} from "./paket/barang_reward.reducer";
import {voucherReducer} from "./masterdata/voucher.reducer";
import {reportRedeemReducer} from "./laporan/report_redeem.reducer";
import {reportRewardReducer} from "./laporan/report_reward.reducer";
import {claimReducer} from './laporan/claim.reducer'
import {ppobReducer} from './laporan/ppob.reducer'
import {reportBarangReducer} from "./laporan/report_barang.reducer";
import {poinKelipatanRoReducer} from "./setting/poin_kelipatan_ro.reducer";
import {konfigurasiStokisReducer} from "./setting/stokis.reducer";

export default combineReducers({
    modalReducer,
    modalTypeReducer,
    dashboardReducer,
    siteReducer,
    paketReducer,
    barangReducer,
    barangRedeemReducer,
    barangRewardReducer,
    pinReducer,
    memberReducer,
    voucherReducer,
    alamatReducer,
    bankReducer,
    userListReducer,
    userLevelReducer,
    kategoriReducer,
    contentReducer,
    laporanPenjualanReducer,
    reportRedeemReducer,
    reportRewardReducer,
    reportBarangReducer,
    bonusReducer,
    depositReducer,
    penarikanReducer,
    saldoReducer,
    generalReducer,
    kurirReducer,
    bonusSettingReducer,
    poinKelipatanRoReducer,
    konfigurasiStokisReducer,
    banksReducer,
    claimReducer,
    ppobReducer,

    auth: authReducer,
    errors : errorsReducer
});