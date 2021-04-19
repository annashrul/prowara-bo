import React, { Component } from 'react';
import {connect} from 'react-redux';
import Layout from 'components/Layout';
import moment from 'moment';
import 'bootstrap-daterangepicker/daterangepicker.css';
// import socketIOClient from "socket.io-client";

import Cards from './src/Cards'
import Filter from './src/Filter'
import Chart from './src/charts'
import Clock from "../../common/clock";
import Default from 'assets/default.png';
import {toCurrency} from "../../../helper";

// const socket = socketIOClient(HEADERS.URL);
//
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD"),
            saldo_member:0,
            total_penarikan:0,
            total_member:0,
            total_penjualan:0,
            get_sponsor_terbaik:[],
            get_member_baru:[],
            location_data:[],
            location:"-",
        }
    };

    componentWillReceiveProps = (nextProps) => {
     
        if (nextProps.auth.user) {
          let lk = [{
              value: "-",
              label: "Semua Lokasi"
          }]
          let loc = nextProps.auth.user.lokasi;
          if(loc!==undefined){
              loc.map((i) => {
                lk.push({
                  value: i.kode,
                  label: i.nama
                });
                return null;
              })
              
              this.setState({
                location_data: lk,
                userid: nextProps.auth.user.id
              })
          }
        }
      }

    componentWillMount(){
    }

    componentWillUnmount(){
        localStorage.removeItem('startDateProduct');
        localStorage.removeItem('endDateDashboard');

    }

    onChange = date => this.setState({ date })

    

    render() {
        return (
            <Layout page="Dashboard">
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <Filter
                                startDate={this.state.startDate}
                                endDate ={this.state.endDate}
                                handleEvent={this.handleEvent}
                            />
                        </div>
                    </div>
                    {/* Dashboard Info Area */}
                    <div className="col-6">
                        <div className="dashboard-infor-mation d-flex flex-wrap align-items-center mb-3">
                            <div className="dashboard-clock">
                                <div id="dashboardDate" className="text-muted">{moment().format("dddd, Do MMM YYYY")}</div>
                                <Clock/>
                            </div>
                            <div className="dashboard-btn-group d-flex align-items-center">
                                <button type="button" onClick={(e)=>this.handleSubmit(e)} className="btn btn-primary ml-1 float-right"><i className="fa fa-refresh"/></button>
                            </div>

                        </div>
                    </div>


                    <div className="col-md-12">
                        {/* Dashboard Widget Area */}
                        <div className="row">
                            <Cards title="TOTAL SALDO MEMBER" data={"Rp "+toCurrency(this.state.saldo_member)} icon="fa fa-money text-white"/>
                            <Cards title="TOTAL PENARIKAN" data={"Rp "+toCurrency(this.state.total_penarikan)} icon="fa fa-dollar text-white"/>
                            <Cards title="TOTAL PENJUALAN" data={"Rp "+toCurrency(this.state.total_penjualan)} icon="fa fa-shopping-cart text-white"/>
                            <Cards title="MEMBER AKTIF" data={toCurrency(this.state.total_member)} icon="fa fa-users text-white"/>
                        </div>
                        {/* Dashboard Widget Area */}
                    </div>
                </div>
        </Layout>
       
        );
    }
}
// Dashboard.propTypes = {
//     auth: PropTypes.object
// }

const mapStateToProps = (state) =>{
     return{
       auth: state.auth,
       stock: state.dashboardReducer.data,
        // skipped: state.transactionReducer.skipped,
        // isLoadingCheck: state.transactionReducer.isLoadingCheck,
     }
}
export default connect(mapStateToProps)(Dashboard);