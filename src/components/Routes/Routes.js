import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "../common/PrivateRoute";
import NotFound from "../common/notfound";
import Login from "../App/Auth/Login/Login";
import Dashboard from "../App/Dashboard/Dashboard";
import Pin from "../App/pin";
import DaftarPaket from "../App/paket/daftar_paket";
import KategoriPaket from "../App/paket/kategori_paket";
import Member from "../App/masterdata/member";
import UserList from "../App/masterdata/indexUserList";
import UserLevel from "../App/masterdata/indexUserLevel";
import Berita from "../App/konten/indexBerita";
import Deposit from "../App/ewallet/indexDeposit";
import Penarikan from "../App/ewallet/indexPenarikan";
import Saldo from "../App/laporan/indexSaldo";
import Bank from "../App/setting/bank";
import IndexSetting from "../App/setting/umum";

const Routes = (
  <div>
    <Switch>
      <Route path="/login" exact strict component={Login} />

      {/* DASHBOARD SECTION START */}
      <PrivateRoute path="/" exact strict component={Dashboard} />
      {/* DASHBOARD SECTION END */}
      {/* PAKET SECTION START */}
      <PrivateRoute path="/pin" exact strict component={Pin} />
<<<<<<< HEAD
      <PrivateRoute path="/daftar_paket" exact strict component={DaftarPaket} />
      <PrivateRoute
        path="/kategori_paket"
        exact
        strict
        component={KategoriPaket}
      />
=======
>>>>>>> 1bda5c11d26c4fbec56592407a0b7a8634839010
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
<<<<<<< HEAD
      <PrivateRoute path="/ewallet/deposit" exact strict component={Deposit} />
      <PrivateRoute
        path="/ewallet/penarikan"
=======
      <PrivateRoute path="/laporan/deposit" exact strict component={Deposit} />
      <PrivateRoute
        path="/laporan/penarikan"
>>>>>>> 1bda5c11d26c4fbec56592407a0b7a8634839010
        exact
        strict
        component={Penarikan}
      />
      {/* E-WALLET SECTION END */}
      {/* LAPORAN SECTION END */}
      <PrivateRoute path="/pengaturan/bank" exact strict component={Bank} />
<<<<<<< HEAD
=======
      <PrivateRoute path="/pengaturan" exact strict component={IndexSetting} />
>>>>>>> 1bda5c11d26c4fbec56592407a0b7a8634839010
      <Route component={NotFound} />
    </Switch>
  </div>
);

export default Routes;
