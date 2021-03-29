import React,{Component} from 'react';
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {getLaporanPenjualan,updateResi, lacakResi} from "../../../redux/actions/laporan/laporan_penjualan.action";
import Paginationq from 'helper';
import List from './src/list/'
import Skeleton from './src/skeleton'
import Filter from './src/filter'
import CardStatus from './src/cardSatus'
import {statusOrder} from "helper";
import moment from 'moment'
import { Link } from 'react-router-dom';
import {postDeposit} from "../../../redux/actions/ewallet/deposit.action";
import Swal from "sweetalert2";
import {NOTIF_ALERT} from 'redux/actions/_constants'

class Order extends Component{
    constructor(props){
        super(props);
        this.state = {
            token:'',
            activeTab : 0,
            selectedIndex : 0,
            dateFrom: moment().format('YYYY-MM-DD'),
            dateTo: moment().format('YYYY-MM-DD'),
            isCheckedPrintAll: false,
            dataTrx:[],
            dataPenjualan:[]

        };
        this.handlePageChange = this.handlePageChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleClickStatus = this.handleClickStatus.bind(this)
        this.handleResi = this.handleResi.bind(this)
        this.handleApproval=this.handleApproval.bind(this)
        this.handleEvent = this.handleEvent.bind(this)
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.order.data !== undefined) {
            const data=[];
            if(nextProps.order.data.length>0){
                for(let i=0;i<nextProps.order.data.length;i++){
                    data.push(Object.assign(nextProps.order.data[i],{isChecked:false}));
                }
            }
            this.setState({dataPenjualan:data});
        }
    }
    componentWillMount(){
        localStorage.removeItem('kode_trx_penjualan');
        localStorage.removeItem('length_kode_trx_penjualan');
        this.setState({dataTrx:[]});
        this.props.dispatch(getLaporanPenjualan(`page=1&datefrom=${this.state.dateFrom}&dateto=${this.state.dateTo}`));
    }

    handleEvent = (event, picker) => {
        const from = moment(picker.startDate._d).format('YYYY-MM-DD');
        const to = moment(picker.endDate._d).format('YYYY-MM-DD');
        this.setState({
            dateFrom: from,
            dateTo: to
        });
    };


    handlePageChange(pageNumber) {
        this.setState({
            dataTrx: [],
            dataPenjualan: []
        })
        localStorage.setItem("pageLaporanPenjualan", pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(getLaporanPenjualan(where));
    }

    handleChange = (e,i=null) => {
        let column = e.target.name;
        let value = e.target.value;
        let checked = e.target.checked;
        let dataPenjualan = [...this.state.dataPenjualan];
        let dataTrx=this.state.dataTrx;
        if(column==='isCheckedPrintAll'){
            dataPenjualan.map((v,i)=>{
                if(checked===true){
                    v.isChecked=true;
                    dataTrx.push(v.kd_trx);
                }else{
                    v.isChecked=false;
                    this.removeItem(dataTrx,v.kd_trx);
                    localStorage.removeItem('kode_trx_penjualan');
                }
            });
            localStorage.setItem("kode_trx_penjualan",dataTrx.toString());
            localStorage.setItem("length_kode_trx_penjualan",dataTrx.length);
            this.setState({[column]:checked,dataPenjualan:dataPenjualan,kdTrx:dataTrx.toString()});
            return;
        }
        if(column==='isChecked'){
            dataPenjualan[i] = {...dataPenjualan[i], [column]: checked};
            if(dataPenjualan[i].isChecked===true){
                dataTrx.push(dataPenjualan[i].kd_trx);
                this.setState({isCheckedPrintAll:true});
            }
            else{

                this.removeItem(dataTrx,dataPenjualan[i].kd_trx);
                if(dataTrx.length===0){
                    this.setState({isCheckedPrintAll:false});
                }
            }
            localStorage.setItem("length_kode_trx_penjualan",dataTrx.length);
            localStorage.setItem("kode_trx_penjualan",dataTrx.toString());
            this.setState({dataPenjualan:dataPenjualan,kdTrx:dataTrx.toString()});
            return;
        }
        dataPenjualan[i] = {...dataPenjualan[i], [column]: value};
        this.setState({dataPenjualan:dataPenjualan});
    }

    handleClickStatus(e,title){
        e.preventDefault();
        this.setState({
            dataTrx: [],
            dataPenjualan:[]
        });

        let sts=''
        if(title==='Belum Bayar'){
            sts = '&status=0'
        }else if(title==='Dikemas'){
            sts = '&status=1'
        } else if (title === 'Dikirim') {
            sts = '&status=2'
        } else if (title === 'Selesai') {
            sts = '&status=3'
        }
        this.props.dispatch(getLaporanPenjualan(`page=1${sts}&datefrom=${this.state.dateFrom}&dateto=${this.state.dateTo}`));


    }

    handleValidate(srch=null) {
        this.setState({
            isLoading: true
        })
        let where = "";
        const page = localStorage.getItem("pageLaporanPenjualan");
        const dateFrom = this.state.dateFrom;
        const dateTo = this.state.dateTo;
        const any = srch !== null ? btoa(srch) : null;
        localStorage.setItem("dateFromLaporanPenjualan", `${dateFrom}`);
        localStorage.setItem("dateToLaporanPenjualan", `${dateTo}`);

        if (page !== null && page !== undefined && page !== "") {
            where += `page=${page}`;
        } else {
            where += "page=1";
        }
        if (dateFrom !== null && dateFrom !== undefined && dateFrom !== "") {
            where += `&datefrom=${dateFrom}&dateto=${dateTo}`;
        }
        if (any !== null && any !== undefined && any !== "") {
            where += `&q=${any}`;
        }
        return where;
    }


    handleSearch(e,q) {
        e.preventDefault();
        this.setState({
            dataTrx: [],
            dataPenjualan: []
        })           
        let where = this.handleValidate(q);
        this.props.dispatch(getLaporanPenjualan(where));
    }

    handleResi(e, kdtrx, resi,kurir, isLacak=false) {
        e.preventDefault()
        this.setState({
            dataTrx: [],
            dataPenjualan: []
        })
        if(!isLacak) this.props.dispatch(updateResi(kdtrx, resi));
        else this.props.dispatch(lacakResi(kdtrx, resi, kurir));
    }

    handleApproval(e, id) {
        e.preventDefault();
        Swal.fire({
            title: 'Perhatian !!!',
            text: `anda yakin akan membatalkan transaksi ini ??`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Oke, batalkan sekarang!`,
            cancelButtonText: 'batal',
        }).then((result) => {
            if (result.value) {
                let parsedata = {
                    "status": 2
                };
                // let where = this.handleValidate();
                this.props.dispatch(postDeposit(parsedata, btoa(id)));
            }
        })

    }

    removeItem(arr, value) {
        let b = '';
        for (b in arr) {
            if (arr[b] === value) {
                arr.splice(b, 1);
                break;
            }
        }
        return arr;
    }

    render(){
        
        const {
            last_page,
            per_page,
            current_page,
            overview,
            data
        } = this.props.order
        return (
            <Layout page="Order" headers="Order List" >
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="card">
                            <div className="card-body">
                                <Filter 
                                    dateFrom={this.state.dateFrom}
                                    dateTo={this.state.dateTo}
                                    handleSearch={this.handleSearch}
                                    handleEvent={this.handleEvent}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 box-margin">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    {/* filter per status */}
                                    <CardStatus
                                        icon={<i className="fa fa-files-o" style={{fontSize: '45px', marginBottom: '5px'}} />}
                                        handleClickStatus={this.handleClickStatus}
                                        color = 'bg-danger'
                                        title = 'Semua'
                                        counter = {overview!==undefined?overview.semua:0}
                                    />
                                    <CardStatus
                                        icon={
                                            <img alt="images" width='50px' style={{fill:'red'}} src={statusOrder('dollar',false,true)}/>
                                        }
                                        handleClickStatus={this.handleClickStatus}
                                        color = 'bg-warning'
                                        title = 'Belum Bayar'
                                        counter = {overview!==undefined?overview.belum:0}
                                    />
                                    <CardStatus
                                        icon={
                                            <img alt="images" width='50px' style={{fill:'red'}} src={statusOrder('packing',false,true)}/>
                                        }
                                        handleClickStatus={this.handleClickStatus}
                                        color = 'bg-purple'
                                        title = 'Dikemas'
                                        counter = {overview!==undefined?overview.kemas:0}
                                    />
                                    <CardStatus
                                        icon={
                                            <img alt="images" width='50px' style={{fill:'red'}} src={statusOrder('truck',false,true)}/>
                                        }
                                        handleClickStatus={this.handleClickStatus}
                                        color = 'warning-color'
                                        title = 'Dikirim'
                                        counter = {overview!==undefined?overview.kirim:0}
                                    />
                                    <CardStatus
                                        icon={
                                            <img alt="images" width='50px' style={{fill:'red'}} src={statusOrder('delivered',false,true)}/>
                                        }
                                        handleClickStatus={this.handleClickStatus}
                                        color = 'bg-success'
                                        title = 'Selesai'
                                        counter = {overview!==undefined?overview.selesai:0}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                   <div className="col-md-12 box-margin">
                         <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-10 col-xs-10 col-md-11">
                                        {
                                            this.state.dataTrx.length > 0 ? (
                                                <Link to='/print_laporan_penjualan' style={{pointerEvents:this.state.isCheckedPrintAll===false?'none':''}}>
                                                    <button className={"btn btn-info btn-block"} style={{letterSpacing:'3px'}}> <i className={'fa fa-print'}/> PRINT LABEL PENGIRIMAN</button>
                                                </Link>
                                            ):(
                                                <button className={"btn btn-info btn-block"} style={{letterSpacing:'3px'}}> <i className={'fa fa-print'}/> PRINT LABEL PENGIRIMAN</button>
                                            )
                                        }

                                    </div>
                                    <div className="col-2 col-xs-2 col-md-1">
                                        <input style={{height:'35px',width:'35px'}} name={"isCheckedPrintAll"} checked={this.state.isCheckedPrintAll} type="checkbox" onChange={(e)=>this.handleChange(e,null)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {
                        (
                            !this.props.isLoading?
                                data!==undefined && data.length>0 ?
                                    this.state.dataPenjualan.map((v, i) => {
                                        return(
                                            <List
                                                key={i}
                                                in={i}
                                                data={v}
                                                handleChange={this.handleChange}
                                                handleResi = {this.handleResi}
                                                handleApproval={this.handleApproval}
                                            />
                                        )
                                    }):<div className="col-md-5 offset-md-3"><img src={NOTIF_ALERT.NO_DATA} style={{textAlign:'center'}}/></div>
                                : 
                                (() => {
                                    const list=[]
                                        for (let x = 0; x < 10; x++) {
                                                list.push(<Skeleton key={x} />)
                                        }
                                        return list
                                    })()
                                
                        )
                    }
                    <div style={{"marginTop":"20px","marginBottom":"20px",marginLeft:'20px',"float":"right"}}>
                        <Paginationq
                            current_page={current_page}
                            per_page={per_page}
                            total={per_page*last_page}
                            callback={this.handlePageChange.bind(this)}
                        />
                    </div>
                </div>
            </Layout>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        order:state.laporanPenjualanReducer.data,
        isLoading: state.laporanPenjualanReducer.isLoading,
        auth: state.auth

    }
}

export default connect(mapStateToProps)(Order)