import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../common/PrivateRoute';
import NotFound from '../common/notfound'
import Login from '../App/Auth/Login/Login';
import Dashboard from '../App/Dashboard/Dashboard';
import Pin from '../App/pin';
import Member from '../App/masterdata/member';
import UserList from '../App/masterdata/indexUserList';
import UserLevel from '../App/masterdata/indexUserLevel';
import Berita from '../App/konten/indexBerita';
import Deposit from '../App/ewallet/indexDeposit';
import Penarikan from '../App/ewallet/indexPenarikan';
import Saldo from '../App/laporan/indexSaldo';
import Bank from '../App/setting/bank';

const Routes = (
    <div>
        <Switch>
            <Route path="/login" exact strict component={Login} />
           
            {/* DASHBOARD SECTION START */}
            <PrivateRoute path="/" exact strict component={Dashboard} />
            {/* DASHBOARD SECTION END */}
            {/* PAKET SECTION START */}
            <PrivateRoute path="/pin" exact strict component={Pin} />
            {/* PAKET SECTION END */}
            {/* MASTERDATA SECTION START */}
            <PrivateRoute path="/daftar_pengguna" exact strict component={UserList} />
            <PrivateRoute path="/akses_pengguna" exact strict component={UserLevel} />
            {/* MASTERDATA SECTION END */}
            {/* MANAGEMENT CONTENT SECTION START */}
            <PrivateRoute path="/member" exact strict component={Member} />
            <PrivateRoute path="/berita" exact strict component={Berita} />
            {/* MANAGEMENT CONTENT SECTION END */}
            {/* LAPORAN SECTION START */}
            <PrivateRoute path="/laporan/transaksi" exact strict component={Saldo} />
            {/* E-WALLET SECTION START */}
            <PrivateRoute path="/laporan/deposit" exact strict component={Deposit} />
            <PrivateRoute path="/laporan/penarikan" exact strict component={Penarikan} />
            {/* E-WALLET SECTION END */}
            {/* LAPORAN SECTION END */}
            <PrivateRoute path="/pengaturan/bank" exact strict component={Bank} />
            <Route component={NotFound}/>

        </Switch>
    </div>
)

export default Routes;