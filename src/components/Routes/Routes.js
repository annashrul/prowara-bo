import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../common/PrivateRoute';
import NotFound from '../common/notfound'

import Login from '../App/Auth/Login/Login';
import Dashboard from '../App/Dashboard/Dashboard';
import Paket from '../App/paket/indexPaket';
import Barang from '../App/paket/indexBarang';
import BarangRedeem from '../App/paket/indexBarangRedeem';
import BarangReward from '../App/paket/indexBarangReward';
import Pin from '../App/pin';
import Member from '../App/masterdata/member';
import Member_approval from '../App/masterdata/member_approval';
import Voucher from '../App/masterdata/voucher/indexVoucher';
import UserList from '../App/masterdata/indexUserList';
import UserLevel from '../App/masterdata/indexUserLevel';
import Berita from '../App/konten/indexBerita';
import Testimoni from '../App/konten/indexTestimoni';
import Penjualan from '../App/order';
import ReportRedeem from '../App/order/redeem/report_redeem';
import ReportReward from '../App/order/reward/indexReportReward';
import ReportBarang from '../App/laporan/indexReportBarang';
import Claim from '../App/order/claim';
import Bonus from '../App/laporan/indexBonus';
import Deposit from '../App/ewallet/indexDeposit';
import Penarikan from '../App/ewallet/indexPenarikan';
import Saldo from '../App/laporan/indexSaldo';
import Setting from '../App/setting/umum';
import Website from '../App/setting/website';
import Bank from '../App/setting/bank';
import Ppob from '../App/setting/ppob';
import PrintLaporanPenjualan from '../App/print/print_laporan_penjualan';

const Routes = (
    <div>
        <Switch>
            <Route path="/login" exact strict component={Login} />
           
            {/* DASHBOARD SECTION START */}
            <PrivateRoute path="/" exact strict component={Dashboard} />
            {/* DASHBOARD SECTION END */}
            {/* PAKET SECTION START */}
            <PrivateRoute path="/paket" exact strict component={Paket} />
            <PrivateRoute path="/barang" exact strict component={Barang} />
            <PrivateRoute path="/barang_redeem" exact strict component={BarangRedeem} />
            <PrivateRoute path="/barang_reward" exact strict component={BarangReward} />
            <PrivateRoute path="/pin" exact strict component={Pin} />
            {/* PAKET SECTION END */}
            {/* MASTERDATA SECTION START */}
            <PrivateRoute path="/daftar_pengguna" exact strict component={UserList} />
            <PrivateRoute path="/akses_pengguna" exact strict component={UserLevel} />
            {/* MASTERDATA SECTION END */}
            {/* MANAGEMENT CONTENT SECTION START */}
            <PrivateRoute path="/member" exact strict component={Member} />
            <PrivateRoute path="/member/ktp" exact strict component={Member_approval} />
            <PrivateRoute path="/voucher" exact strict component={Voucher} />
            <PrivateRoute path="/berita" exact strict component={Berita} />
            <PrivateRoute path="/testimoni" exact strict component={Testimoni} />
            {/* MANAGEMENT CONTENT SECTION END */}
            {/* LAPORAN SECTION START */}
            <PrivateRoute path="/bonus" exact strict component={Bonus} />
            <PrivateRoute path="/report_redeem" exact strict component={ReportRedeem} />
            <PrivateRoute path="/report_reward" exact strict component={ReportReward} />
            <PrivateRoute path="/redeem" exact strict component={ReportRedeem} />
            <PrivateRoute path="/delivery_note" exact strict component={ReportBarang} />
            <PrivateRoute path="/claim" exact strict component={Claim} />
            <PrivateRoute path="/laporan/transaksi" exact strict component={Saldo} />
            <PrivateRoute path="/produk" exact strict component={Penjualan} />
            {/* E-WALLET SECTION START */}
            <PrivateRoute path="/laporan/deposit" exact strict component={Deposit} />
            <PrivateRoute path="/laporan/penarikan" exact strict component={Penarikan} />
            {/* E-WALLET SECTION END */}
            {/* LAPORAN SECTION END */}

            <PrivateRoute path="/pengaturan/umum" exact strict component={Setting} />
            <PrivateRoute path="/setting/website" exact strict component={Website} />
            <PrivateRoute path="/pengaturan/bank" exact strict component={Bank} />
            <PrivateRoute path="/setting/ppob" exact strict component={Ppob} />

            {/* PRINT SECTION START */}
            <PrivateRoute path="/print_laporan_penjualan" exact strict component={PrintLaporanPenjualan} />
            {/* PRINT SECTION END */}
            <Route component={NotFound}/>

        </Switch>
    </div>
)

export default Routes;