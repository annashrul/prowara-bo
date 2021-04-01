import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import {DateRangePicker} from "react-bootstrap-daterangepicker";
import Paginationq, {rangeDate, noImage, rmComma, ToastQ, toCurrency, toRp, toExcel, myDate} from "../../../helper";
import {NOTIF_ALERT} from "../../../redux/actions/_constants";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import Skeleton from 'react-loading-skeleton';
import moment from "moment";
import FormPenarikanBonus from '../modals/laporan/form_penarikan_bonus';
import {getDeposit, postDeposit} from "../../../redux/actions/ewallet/deposit.action";
import Select from 'react-select';
import * as Swal from "sweetalert2";
import {getExcelPenarikan, getPenarikan, postPenarikan} from "../../../redux/actions/ewallet/penarikan.action";
import Preloader from "../../../Preloader";

class IndexPenarikan extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            any:"",
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD"),
            status_data:[{value:'kd_trx',label:'kode transaksi'},{value:'full_name',label:'nama'},{value:'status',label:'status'}],
            status:'',
            data:[],
        };
        this.handleChange      = this.handleChange.bind(this);
        this.handlePage      = this.handlePage.bind(this);
        this.handleChangeStatus      = this.handleChangeStatus.bind(this);
        this.handleApproval      = this.handleApproval.bind(this);
        this.handleSearch      = this.handleSearch.bind(this);
        this.handleEvent      = this.handleEvent.bind(this);

    }
    handleValidate(){
        let where="";
        let data=this.state;
        if(data.dateFrom!==null&&data.dateFrom!==undefined&&data.dateFrom!==""){
            where+=`&datefrom=${data.dateFrom}&dateto=${data.dateTo}`;
        }
        if(data.status!==null&&data.status!==undefined&&data.status!==""){
            where+=`&searchby=${data.status}`;
        }
        if(data.any!==null&&data.any!==undefined&&data.any!==""){
            where+=`&q=${btoa(data.any)}`;
        }
        return where;

    }
    handleChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    componentWillMount(){
        let where=this.handleValidate();
        this.props.dispatch(getPenarikan(`page=1&${where}`));
    }

    handleSearch(e){
        e.preventDefault();
        let where = this.handleValidate();
        this.props.dispatch(getPenarikan(`page=1&${where}`));
    }
    handlePage(num){
        let where = this.handleValidate();
        this.props.dispatch(getPenarikan(`page=${num}&${where}`));

    }
    handleChangeStatus(val){
        this.setState({
            status:val.value
        })
    }
    handleEvent = (event, picker) => {
        event.preventDefault();
        const from = moment(picker.startDate._d).format('YYYY-MM-DD');
        const to = moment(picker.endDate._d).format('YYYY-MM-DD');
        this.setState({
            dateFrom:from,
            dateTo:to
        });
    };



    handleApproval(e,id,status){
        e.preventDefault();
        Swal.fire({
            title: 'Perhatian !!!',
            text: `anda yakin akan ${status===1?"menerima":"membatalkan"} penarikan ini ??`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Oke, ${status===1?"terima":"batalkan"} sekarang!`,
            cancelButtonText: 'keluar',
        }).then((result) => {
            if (result.value) {
                let parsedata={"status":status};
                // let where = this.handleValidate();
                this.props.dispatch(postPenarikan(parsedata,btoa(id)));
            }
        })

    }
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.dataExcel.data!==this.props.dataExcel.data){
            this.getExcel(this.props);
        }
    }
    getExcel(props){
        if(props.dataExcel.data!==undefined){
            if(props.dataExcel.data.length>0){
                let content=[];
                let total=0;
                props.dataExcel.data.map((v,i)=>{
                    total=total+parseInt(v.amount,10);
                    let status='';
                    if(v.status===0){status='Pending';}
                    if(v.status===1){status='Sukses';}
                    if(v.status===2){status='Gagal';}
                    content.push([
                        v.kd_trx,
                        v.full_name,
                        v.bank_name,
                        v.acc_name,
                        v.acc_no,
                        parseInt(v.charge,10),
                        parseInt(v.amount,10),
                        status,
                        myDate(v.created_at)
                    ]);
                });
                toExcel(
                    'LAPORAN PENARIKAN',
                    `${this.state.dateFrom} - ${this.state.dateTo}`,
                    [
                        'KODE TRANSAKSI',
                        'NAMA',
                        'BANK',
                        'ATAS NAMA',
                        'NO REKENING',
                        'BIAYA ADMIN',
                        'JUMLAH',
                        'STATUS',
                        'TANGGAL'
                    ],
                    content,
                    [
                        [''],
                        [''],
                        [
                            'TOTAL',
                            '',
                            '',
                            '',
                            '',
                            '',
                            total
                        ]
                    ]
                )
            }

        }
    }
    printDocumentXLsx = (e,param) => {
        e.preventDefault();
        let where=this.handleValidate();
        this.props.dispatch(getExcelPenarikan(`page=1&perpage=${param}&${where}`));
    }
    render(){
        const columnStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const numStyle ={verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
        // const data = this.state.data;
        let totAmount=0;
        const {
            total,
            per_page,
            offset,
            to,
            last_page,
            current_page,
            from,
            data
        } = this.props.data;
        return(
            <Layout page={"Penarikan"}>
                {this.props.isLoadingExcel||this.props.isLoading ?<Preloader/>:null}
                <div className="row">
                    <div className="col-12 col-xs-12 col-md-10">
                        <div className="row">
                            <div className="col-12 col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label>Periode </label>
                                    <DateRangePicker
                                        autoUpdateInput={true} showDropdowns={true} style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onApply={this.handleEvent}>
                                        <input type="text" readOnly={true} className="form-control" value={`${this.state.dateFrom} to ${this.state.dateTo}`}/>
                                    </DateRangePicker>
                                </div>
                            </div>
                            <div className="col-12 col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label>Kolom</label>
                                    <select name="status" className="form-control" value={this.state.status} onChange={this.handleChange} >
                                        {
                                            this.state.status_data.map((v,i)=>{
                                                return(
                                                    <option value={v.value}>{v.label}</option>
                                                );
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col-12 col-xs-12 col-md-3">
                                <div className="form-group">
                                    <label>Cari</label>
                                    <input type="text" className="form-control" name="any" placeholder={"cari disini"} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xs-12 col-md-2" style={{textAlign:"right"}}>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}>
                                        <i className="fa fa-search"/>
                                    </button>
                                    <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary"  onClick={(e => this.printDocumentXLsx(e,per_page*last_page))}>
                                        <i className="fa fa-print"/>
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div style={{overflowX: "auto"}}>
                    <table className="table table-bordered">
                        <thead className="thead-dark">
                        <tr>
                            <th rowSpan="2" style={columnStyle}>NO</th>
                            <th rowSpan="2" style={columnStyle}>#</th>
                            <th rowSpan="2" style={columnStyle}>KODE TRANSAKSI</th>
                            <th rowSpan="2" style={columnStyle}>NAMA</th>
                            <th colSpan="3" style={columnStyle}>BANK</th>
                            <th rowSpan="2" style={columnStyle}>BIAYA ADMIN</th>
                            <th rowSpan="2" style={columnStyle}>JUMLAH</th>
                            <th rowSpan="2" style={columnStyle}>STATUS</th>
                            <th rowSpan="2" style={columnStyle}>TANGGAL DIBUAT</th>
                        </tr>
                        <tr>
                            <th style={columnStyle}>NAMA</th>
                            <th style={columnStyle}>ATAS NAMA</th>
                            <th style={columnStyle}>NO REKENING</th>
                        </tr>

                        </thead>
                        <tbody>
                        {

                            typeof data==='object'? data.length > 0 ?
                                data.map((v, i) => {
                                    totAmount=totAmount+parseInt(v.amount);
                                    let badge = "";
                                    let txt = "";
                                    if(v.status===0){badge="badge-warning";txt="Pending";}
                                    if(v.status===1){badge="badge-success";txt="Success";}
                                    if(v.status===2){badge="badge-danger";txt="Cancel";}
                                    return (
                                        <tr key={i}>
                                            <td style={columnStyle}>
                                                <span className="circle">{i+1 + (10 * (parseInt(current_page,10)-1))}</span>
                                            </td>
                                            <td style={columnStyle}>
                                                <button style={{marginRight:"5px"}} className={"btn btn-primary"} disabled={v.status === 1||v.status === 2} onClick={(e)=>this.handleApproval(e,v.id,1)}><i className={"fa fa-check"}/></button>
                                                <button style={{marginRight:"5px"}} className={"btn btn-primary"} disabled={v.status === 1||v.status === 2} onClick={(e)=>this.handleApproval(e,v.id,2)}><i className={"fa fa-close"}/></button>
                                            </td>
                                            <td style={columnStyle}>{v.kd_trx}</td>
                                            <td style={columnStyle}>{v.full_name}</td>
                                            <td style={columnStyle}>{v.bank_name}</td>
                                            <td style={columnStyle}>{v.acc_name}</td>
                                            <td style={columnStyle}>{v.acc_no}</td>
                                            <td style={numStyle}>Rp {v.charge===null||parseInt(v.charge)===0?0:toCurrency(parseInt(v.charge))} .-</td>
                                            <td style={numStyle}>Rp {parseInt(v.amount)===0?0:toCurrency(parseInt(v.amount))} .-</td>
                                            <td style={columnStyle}><span className={`span ${badge}`}>{txt}</span></td>
                                            <td style={columnStyle}>{myDate(v.created_at)}</td>

                                        </tr>
                                    );
                                })
                                : <tr>
                                    <td colSpan={11} style={columnStyle}><img src={NOTIF_ALERT.NO_DATA}/></td>
                                </tr>:
                                <tr>
                                    <td colSpan={11} style={columnStyle}><img src={NOTIF_ALERT.NO_DATA}/></td>
                                </tr>
                            // (()=>{
                            //     let container =[];
                            //     for(let x=0; x<10; x++){
                            //         container.push(
                            //             <tr key={x}>
                            //                 <td style={columnStyle}>{<Skeleton circle={true} height={40} width={40}/>}</td>
                            //                 <td style={columnStyle}>
                            //                     <Skeleton height={30} width={30}/>
                            //                 </td>
                            //                 <td style={columnStyle}>{<Skeleton/>}</td>
                            //                 <td style={columnStyle}>{<Skeleton/>}</td>
                            //                 <td style={columnStyle}>{<Skeleton/>}</td>
                            //                 <td style={columnStyle}>{<Skeleton/>}</td>
                            //                 <td style={columnStyle}>{<Skeleton/>}</td>
                            //                 <td style={columnStyle}>{<Skeleton/>}</td>
                            //                 <td style={columnStyle}>{<Skeleton/>}</td>
                            //                 <td style={columnStyle}>{<Skeleton/>}</td>
                            //                 <td style={columnStyle}>{<Skeleton/>}</td>
                            //             </tr>
                            //         )
                            //     }
                            //     return container;
                            // })()
                        }
                        </tbody>
                        <tfoot>
                        <tr>
                            <th colSpan={8}>TOTAL PERPAGE</th>
                            <th colSpan={1} style={numStyle}>Rp {totAmount===0?0:toCurrency(totAmount)} .-</th>
                            <th colSpan={2}/>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div style={{"marginTop":"20px","marginBottom":"20px","float":"right"}}>
                    <Paginationq
                        current_page={current_page}
                        per_page={per_page}
                        total={total}
                        callback={this.handlePage}
                    />
                </div>
            </Layout>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        isLoading: state.penarikanReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.penarikanReducer.data,
        isLoadingExcel: state.penarikanReducer.isLoadingExcel,
        dataExcel:state.penarikanReducer.excel,

    }
}


export default connect(mapStateToProps)(IndexPenarikan);