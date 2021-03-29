import React, { Component } from 'react';
import {Link} from "react-router-dom"
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom"
import { logoutUser } from "redux/actions/authActions";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import Preloader from "../../Preloader";

class SideMenu extends Component {
    constructor(props){
        super(props);
        this.state ={
            isMember:false,
            isStockist:false,
            isOrder:false,
            isEwallet:false,
            isManajemenPaket:false,
            isManajemenKonten:false,
            isLaporan:false,
            isUser:false,
            isSetting:false,

            isShowMember:false,
            isShowStockist:false,
            isShowOrder:false,
            isShowEwallet:false,
            isShowManajemenPaket:false,
            isShowManajemenKonten:false,
            isShowLaporan:false,
            isShowUser:false,
            isShowSetting:false,
            arrDisplay:[
                {range1:0,range2:10,state:'isShowMember'},
                {range1:20,range2:30,state:'isShowStockist'},
                {range1:30,range2:40,state:'isShowOrder'},
                {range1:40,range2:50,state:'isShowEwallet'},
                {range1:50,range2:60,state:'isShowManajemenPaket'},
                {range1:60,range2:70,state:'isShowManajemenKonten'},
                {range1:70,range2:80,state:'isShowLaporan'},
                {range1:80,range2:90,state:'isShowUser'},
                {range1:90,range2:100,state:'isShowSetting'},
            ],
            aksesMember:[],
            isLoading:true
        }
        this.changeMenu = this.changeMenu.bind(this);
    }



    changeMenu(e,param){
        e.preventDefault();
        const sts = {
            isMember: false,
            isStockist: false,
            isOrder: false,
            isEwallet: false,
            isManajemenPaket: false,
            isManajemenKonten: false,
            isLaporan: false,
            isUser: false,
            isSetting:false
        };
        sts[param] = !this.state[param];
        this.setState(sts);

        this.forceUpdate();

    }
    handleLoop(param,state){
        this.state[state]=false;
        param.forEach(val=>{
            if(val.label!==''){
                if(val.value==='1'){
                    this.setState({[state]:true});
                }
            }
        });
    }
    getProps(param){
        if (param.auth.user) {
            if(param.auth.user!==undefined){
                let akses = param.auth.user.access_level;
                if(akses!==undefined){
                    let toArray=[];
                    this.state.arrDisplay.forEach(val=>{
                        this.handleLoop(akses.slice(val.range1,val.range2),val.state);
                    })
                    akses.forEach((parent,i)=>{
                        toArray.push(parent);
                        // toArray=Object.assign(parent,)
                    });
                    this.setState({aksesMember:toArray,isLoading:false});
                }
            }

        }
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    componentDidMount(){
        this.getProps(this.props);
        const path = this.props.location.pathname;
        {/* ===================================MEMBER MODUL START=================================== */}
        if (path === '/member'||path==='/member/ktp') {
            this.setState({
                isMember: true
            })
        }
        {/* ===================================MEMBER MODUL END=================================== */}
        {/* ===================================STOCKSIT MODUL START=================================== */}
        if (path === '/pin/ro' || path === '/pin/aktivasi') {
            this.setState({
                isStockist:true
            })
        }
        {/* ===================================STOCKSIT MODUL END=================================== */}
        {/* ===================================ORDER MODUL START=================================== */}
        if(path==='/produk'||path==='/redeem'||path==='/claim'){
            this.setState({
                isOrder:true
            })
        }
        {/* ===================================ORDER MODUL END=================================== */}
        {/* ===================================EWALLET MODUL START=================================== */}
        if(path==='/deposit'||path==='/penarikan'||path==='/bonus'){
            this.setState({
                isEwallet:true
            })
        }
        {/* ===================================EWALLET MODUL END=================================== */}
        {/* ===================================MANAJEMEN PAKET MODUL START=================================== */}
        if(path==='/paket' || path==='/barang'||path==='/barang_redeem'||path==='/barang_reward'){
            this.setState({
                isManajemenPaket:true
            })
        }
        {/* ===================================MANAJEMEN PAKET MODUL END=================================== */}
        {/* ===================================MANAJEMEN KONTEN MODUL START=================================== */}
        if(path==='/berita'||path==='/testimoni'){
            this.setState({
                isManajemenKonten:true
            })
        }
        {/* ===================================MANAJEMEN KONTEN MODUL END=================================== */}
        {/* ===================================LAPORAN MODUL START=================================== */}
        if(path==='/saldo'||path==='/report_barang'){
            this.setState({
                isLaporan:true
            })
        }
        {/* ===================================LAPORAN MODUL END=================================== */}
        {/* ===================================USER MODUL START=================================== */}
        if(path==='/user_list'||path==='/user_level'){
            this.setState({
                isUser:true
            })
        }
        {/* ===================================USER MODUL END=================================== */}
        {/* ===================================SETTING MODUL START=================================== */}
        if (path === '/setting' || path === '/setting/website' || path === '/setting/bank' || path === '/setting/ppob') {
            this.setState({
                isSetting:true
            })
        }
        {/* ===================================SETTING MODUL END=================================== */}
    }
    componentWillReceiveProps = (nextProps) => {
        this.getProps(nextProps);
        if (this.props.activePath !== nextProps.activePath) {
            this.setState({
              activePath: nextProps.activePath
            })
        }
    }
    handleLogout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Apakah anda yakin akan logout aplikasi?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya!'
        }).then((result) => {
            if (result.value) {
                this.props.logoutUser();
            }
        })
    };

    render() {
        const path = this.props.location.pathname;
        const {
            isLoading,
            aksesMember,
            isMember,isStockist,isOrder,isEwallet,isManajemenPaket,isManajemenKonten,isLaporan,isUser,isSetting,
            isShowMember,isShowStockist,isShowOrder,isShowEwallet,isShowManajemenPaket,isShowManajemenKonten,isShowLaporan,isShowUser,isShowSetting
        }=this.state;
        return (
            <nav>
                {
                    isLoading?<Preloader/>:(
                        <ul className="sidebar-menu" data-widget="tree">
                            {/* ===================================DASHBOARD MODUL START=================================== */}
                            <li  className={path==='/'?"active":''}><Link to="/"> <i className="fa fa-dashboard" /><span> Dashboard</span></Link></li>
                            {/* ===================================DASHBOARD MODUL END=================================== */}
                            {/* ===================================MEMBER MODUL START=================================== */}
                            <li style={{display:isShowMember?'block':'none'}} className={"treeview" +(isMember===true || path==='/member' || path==='/member/ktp' ?" active menu-open" : "")}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'isMember')}><i className="fa fa-users" /> <span>Member</span> <i className="fa fa-angle-right" /></a>
                                <ul className={"treeview-menu"} style={{display:isMember===true?"block":"none"}}>
                                    <li style={{display:aksesMember[0].value==='1'?'block':'none'}} className={path==='/member'?"active":''}><Link to="/member" style={{width:'fit-content'}}> List Member</Link></li>
                                    <li style={{display:aksesMember[1].value==='1'?'block':'none'}} className={path==='/member/ktp'?"active":''}><Link to="/member/ktp" style={{width:'fit-content'}}> Approval KTP member</Link></li>
                                </ul>
                            </li>
                            {/* ===================================MEMBER MODUL END=================================== */}

                            {/* ===================================STOCKIST MODUL START=================================== */}
                            <li style={{display:isShowStockist?'block':'none'}} className={"treeview" +(isStockist===true || path==='/pin/aktivasi' || path==='/pin/ro' ?" active menu-open" : "")}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'isStockist')}><i className="fa fa-tasks" /> <span>Stockist</span> <i className="fa fa-angle-right" /></a>
                                <ul className={"treeview-menu"} style={{display:isStockist===true?"block":"none"}}>
                                    <li style={{display:aksesMember[20].value==='1'?'block':'none'}} className={path==='/pin/aktivasi'?"active":''}><Link to="/pin/aktivasi" style={{width:'fit-content'}}> PIN Aktivasi</Link></li>
                                    <li style={{display:aksesMember[21].value==='1'?'block':'none'}} className={path==='/pin/ro'?"active":''}><Link to="/pin/ro" style={{width:'fit-content'}}> PIN RO</Link></li>
                                </ul>
                            </li>
                            {/* ===================================STOCKIST MODUL END=================================== */}
                            {/* ===================================ORDER MODUL START=================================== */}
                            <li style={{display:isShowOrder?'block':'none'}} className={"treeview" +(isOrder===true || path==='/produk' || path==='/redeem' || path==='/claim'?" active menu-open" : "")}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'isOrder')}><i className="fa fa-shopping-basket" /> <span>Order</span> <i className="fa fa-angle-right" /></a>
                                <ul className={"treeview-menu"} style={{display:isOrder===true?"block":"none"}}>
                                    <li style={{display:aksesMember[30].value==='1'?'block':'none'}} className={path==='/produk'?"active":''}><Link to="/produk" style={{width:'fit-content'}}> Order Paket</Link></li>
                                    <li style={{display:aksesMember[31].value==='1'?'block':'none'}} className={path==='/redeem'?"active":''}><Link to="/redeem" style={{width:'fit-content'}}> Redeem Point</Link></li>
                                    <li style={{display:aksesMember[32].value==='1'?'block':'none'}} className={path==='/claim'?"active":''}><Link to="/claim" style={{width:'fit-content'}}> Claim Reward</Link></li>

                                </ul>
                            </li>
                            {/* ===================================ORDER MODUL END=================================== */}
                            {/* ===================================E-WALLET MODUL START=================================== */}
                            <li style={{display:isShowEwallet?'block':'none'}} className={"treeview" +(isEwallet===true || path==='/deposit'|| path==='/penarikan'||path==='/bonus'?" active menu-open" : "")}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'isEwallet')}><i className="fa fa-google-wallet" /> <span>E-Wallet</span> <i className="fa fa-angle-right" /></a>
                                <ul className={"treeview-menu"} style={{display:isEwallet===true?"block":"none"}}>
                                    <li style={{display:aksesMember[40].value==='1'?'block':'none'}} className={path==='/deposit'?"active":''}><Link to="/deposit" style={{width:'fit-content'}}> Deposit</Link></li>
                                    <li style={{display:aksesMember[41].value==='1'?'block':'none'}} className={path==='/penarikan'?"active":''}><Link to="/penarikan" style={{width:'fit-content'}}> Penarikan</Link></li>
                                    <li style={{display:aksesMember[42].value==='1'?'block':'none'}} className={path==='/bonus'?"active":''}><Link to="/bonus" style={{width:'fit-content'}}> Bonus</Link></li>

                                </ul>
                            </li>
                            {/* ===================================E-WALLET MODUL END=================================== */}
                            {/* ===================================MANAJEMEN PAKET MODUL START=================================== */}
                            <li style={{display:isShowManajemenPaket?'block':'none'}} className={"treeview" +(isManajemenPaket===true || path==='/paket' || path==='/barang' || path==='/barang_redeem' || path==='/barang_reward'?" active menu-open" : "")}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'isManajemenPaket')}><i className="fa fa-folder-o" /> <span>Manajemen Paket</span> <i className="fa fa-angle-right" /></a>
                                <ul className={"treeview-menu"} style={{display:isManajemenPaket===true?"block":"none"}}>
                                    <li style={{display:aksesMember[50].value==='1'?'block':'none'}} className={path==='/paket'?"active":''}><Link to="/paket" style={{width:'fit-content'}}> Paket</Link></li>
                                    <li style={{display:aksesMember[51].value==='1'?'block':'none'}} className={path==='/barang'?"active":''}><Link to="/barang" style={{width:'fit-content'}}> Barang</Link></li>
                                    <li style={{display:aksesMember[52].value==='1'?'block':'none'}} className={path==='/barang_redeem'?"active":''}><Link to="/barang_redeem" style={{width:'fit-content'}}> Barang Redeem</Link></li>
                                    <li style={{display:aksesMember[53].value==='1'?'block':'none'}} className={path==='/barang_reward'?"active":''}><Link to="/barang_reward" style={{width:'fit-content'}}> Barang Reward</Link></li>
                                </ul>
                            </li>
                            {/* ===================================MANAJEMEN PAKET MODUL END=================================== */}
                            {/* ===================================MANAJEMEN KONTENT MODUL START=================================== */}
                            <li style={{display:isShowManajemenKonten?'block':'none'}} className={"treeview" +(isManajemenKonten===true || path==='/berita'|| path==='/testimoni' ?" active menu-open" : "")}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'isManajemenKonten')}><i className="fa fa-list" /> <span>Menejemen Konten</span> <i className="fa fa-angle-right" /></a>
                                <ul className={"treeview-menu"} style={{display:isManajemenKonten===true?"block":"none"}}>
                                    <li style={{display:aksesMember[60].value==='1'?'block':'none'}} className={path==='/berita'?"active":''}><Link to="/berita" style={{width:'fit-content'}}> Berita</Link></li>
                                    <li style={{display:aksesMember[61].value==='1'?'block':'none'}} className={path==='/testimoni'?"active":''}><Link to="/testimoni" style={{width:'fit-content'}}> Testimoni</Link></li>
                                </ul>
                            </li>
                            {/* ===================================MANAJEMEN KONTENT MODUL END=================================== */}
                            {/* ===================================VOUCHER MODUL START=================================== */}
                            <li style={{display:aksesMember[10].value==='1'?'block':'none'}}  className={path==='/voucher'?"active":''}><Link to="/voucher"> <i className="fa fa-code" /><span> Voucher</span></Link></li>
                            {/* ===================================VOUCHER MODUL END=================================== */}
                            {/* ===================================LAPORAN MODUL START=================================== */}
                            <li style={{display:isShowLaporan?'block':'none'}} className={"treeview" +(isLaporan===true || path==='/saldo'|| path==='/report_barang' ?" active menu-open" : "")}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'isLaporan')}><i className="fa fa-file-text" /> <span>Laporan</span> <i className="fa fa-angle-right" /></a>
                                <ul className={"treeview-menu"} style={{display:isLaporan===true?"block":"none"}}>
                                    <li style={{display:aksesMember[70].value==='1'?'block':'none'}} className={path==='/saldo'?"active":''}><Link to="/saldo" style={{width:'fit-content'}}> Transaksi Member</Link></li>
                                    <li style={{display:aksesMember[71].value==='1'?'block':'none'}} className={path==='/report_barang'?"active":''}><Link to="/report_barang" style={{width:'fit-content'}}> Penjualan Paket</Link></li>
                                </ul>
                            </li>
                            {/* ===================================LAPORAN MODUL END=================================== */}
                            {/* ===================================USER MODUL START=================================== */}
                            <li style={{display:isShowUser?'block':'block'}} className={"treeview" +(isUser===true || path==='/user_list' || path==='/user_level' ?" active menu-open" : "")}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'isUser')}><i className="fa fa-user" /> <span>Manajemen User</span> <i className="fa fa-angle-right" /></a>
                                <ul className={"treeview-menu"} style={{display:isUser===true?"block":"none"}}>
                                    <li style={{display:aksesMember[80].value==='1'?'block':'block'}} className={path==='/user_list'?"active":''}><Link to="/user_list" style={{width:'fit-content'}}> User List</Link></li>
                                    <li style={{display:aksesMember[81].value==='1'?'block':'block'}} className={path==='/user_level'?"active":''}><Link to="/user_level" style={{width:'fit-content'}}> User Level</Link></li>
                                </ul>
                            </li>
                            {/* ===================================USER MODUL END=================================== */}
                            {/* ===================================SETTING MODUL START=================================== */}
                            <li style={{display:isShowSetting?'block':'none'}} className={"treeview" +(isSetting===true || path==='/setting' || path==='/setting/website'  || path==='/setting/bank' || path === '/setting/ppob' ?" active menu-open" : "")}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'isSetting')}><i className="fa fa-cogs" /> <span>Pengaturan</span> <i className="fa fa-angle-right" /></a>
                                <ul className={"treeview-menu"} style={{display:isSetting===true?"block":"none"}}>
                                    <li style={{display:aksesMember[90].value==='1'?'block':'none'}} className={path==='/setting'?"active":''}><Link to="/setting" style={{width:'fit-content'}}> Pengaturan Umum</Link></li>
                                    <li style={{display:aksesMember[91].value==='1'?'block':'none'}} className={path==='/setting/website'?"active":''}><Link to="/setting/website" style={{width:'fit-content'}}> Pengaturan Website</Link></li>
                                    <li style={{display:aksesMember[92].value==='1'?'block':'none'}} className={path=== '/setting/ppob'?"active":''}><Link to="/setting/ppob" style={{width:'fit-content'}}> Pengaturan PPOB</Link></li>
                                    <li style={{display:aksesMember[93].value==='1'?'block':'none'}} className={path==='/setting/bank'?"active":''}><Link to="/setting/bank" style={{width:'fit-content'}}> Pengaturan bank</Link></li>
                                </ul>
                            </li>
                            {/* ===================================SETTING MODUL END=================================== */}
                            {/* ===================================LOGOUT MODUL START */}
                            <li><a href={null} style={{cursor:'pointer',color:'#a6b6d0'}} onClick={(event)=>this.handleLogout(event)}> <i className="fa fa-sign-out" /><span> Logout</span></a></li>
                            {/* ===================================LOGOUT MODUL END=================================== */}
                        </ul>
                    )
                }

            </nav>
        )
    }
}
SideMenu.propTypes = {
    logoutUser: PropTypes.func.isRequired
};
const mapStateToProps = (state) => {
    return{
        auth: state.auth
    }
}

export default withRouter(connect(mapStateToProps,{logoutUser})(SideMenu))