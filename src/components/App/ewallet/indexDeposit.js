import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import {DateRangePicker} from "react-bootstrap-daterangepicker";
import Paginationq, {rangeDate, noImage, rmComma, ToastQ, toCurrency, toRp, myDate, toExcel} from "../../../helper";
import {NOTIF_ALERT} from "../../../redux/actions/_constants";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import Skeleton from 'react-loading-skeleton';
import moment from "moment";
import FormPenarikanBonus from '../modals/laporan/form_penarikan_bonus';
import {getDeposit, getExcelDeposit, postDeposit} from "../../../redux/actions/ewallet/deposit.action";
import Select from 'react-select';
import * as Swal from "sweetalert2";

class IndexDeposit extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            any:"",
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD"),
            status_data:[{value:'kd_trx',label:'KODE TRX'},{value:'full_name',label:'NAMA'},{value:'status',label:'STATUS'}],
            status:'',
            data:[],
            isLoading:true
        };
        this.handleChange      = this.handleChange.bind(this);
        this.handleModal      = this.handleModal.bind(this);
        this.handlePage      = this.handlePage.bind(this);
        this.handleChangeStatus      = this.handleChangeStatus.bind(this);
        this.handlePaymentSlip      = this.handlePaymentSlip.bind(this);
        this.handleApproval      = this.handleApproval.bind(this);
        this.handleSearch      = this.handleSearch.bind(this);
        this.handleEvent      = this.handleEvent.bind(this);

    }
    handleChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    componentWillMount(){
        let where=this.handleValidate();
        this.props.dispatch(getDeposit(where));
    }

    componentWillUnmount(){
        localStorage.removeItem('pageDeposit')
        localStorage.removeItem('dateFromDeposit')
        localStorage.removeItem('dateToDeposit')
    }
    componentWillReceiveProps(nextProps){
        let data=[];
        let isLoading=true;
        if(typeof nextProps.data.data==='object'){
            if(nextProps.data.data.length>0){
                for(let i=0;i<nextProps.data.data.length;i++){
                    data.push(nextProps.data.data[i]);
                    isLoading=false;
                }
            }
            else{
                data=[];
                isLoading=false;
            }
        }
        else{
            data=[];
            isLoading=false;
        }
        this.setState({data:data});
    }
    handleValidate(){
        let where="";
        let page = localStorage.getItem("pageDeposit");
        let dateFrom = this.state.dateFrom;
        let dateTo = this.state.dateTo;
        let status = this.state.status;
        let any = this.state.any;
        localStorage.setItem("dateFromDeposit",`${dateFrom}`);
        localStorage.setItem("dateToDeposit",`${dateTo}`);
        if(page!==null&&page!==undefined&&page!==""){
            where+=`&page=${page}`;

        }else{
            where+=`&page=1`;
        }
        if(dateFrom!==null&&dateFrom!==undefined&&dateFrom!==""){
            where+=`&datefrom=${dateFrom}&dateto=${dateTo}`;
        }
        if(status!==null&&status!==undefined&&status!==""){
            where+=`&searchby=${status}`;
        }
        if(any!==null&&any!==undefined&&any!==""){
            where+=`&q=${btoa(any)}`;
        }
        return where;

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
                        v.fullname,
                        v.acc_name,
                        v.acc_no,
                        parseInt(v.amount,10),
                        parseInt(v.unique_code,10),
                        status,
                        myDate(v.created_at)
                    ]);
                });
                toExcel(
                    'LAPORAN DEPOSIT',
                    `${this.state.dateFrom} - ${this.state.dateTo}`,
                    [
                        'KODE TRANSAKSI',
                        'NAMA',
                        'BANK TUJUAN',
                        'NO REKENING',
                        'JUMLAH',
                        'KODE UNIK',
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
                            total
                        ]
                    ]
                )
            }

        }
    }



    printDocumentXLsx = (e,param) => {
        e.preventDefault();
        let where=`perpage=${param}&datefrom=${this.state.dateFrom}&dateto=${this.state.dateTo}`;
        if(this.state.any!==null&&this.state.any!==undefined&&this.state.any!==""){
            where+=`&q=${this.state.any}`;
        }

        this.props.dispatch(getExcelDeposit(where));
    }
    handleSearch(e){
        e.preventDefault();
        // this.state.isLoading=true;
        let where = this.handleValidate();
        this.props.dispatch(getDeposit(where));
        // this.state.isLoading=false;
    }

    handlePage(num){
        localStorage.setItem("pageDeposit",num);
        let where = this.handleValidate();
        this.props.dispatch(getDeposit(where));

    }
    handleChangeStatus(val){
        this.setState({
            status:val.value
        })
    }

    handleModal(e,kode){
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formPenarikanBonus"));
        this.setState({detail:{kode:kode}});
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

    handlePaymentSlip(e,param) {
        e.preventDefault();
        Swal.fire({
            title: 'Bukti Transfer',
            text: this.props.data.data[param].name,
            imageUrl: this.props.data.data[param].payment_slip,
            imageAlt: 'gambar tidak tersedia',
            showClass   : {popup: 'animate__animated animate__fadeInDown'},
            hideClass   : {popup: 'animate__animated animate__fadeOutUp'},
        })
    }

    handleApproval(e,id,status){
        e.preventDefault();
        Swal.fire({
            title: 'Perhatian !!!',
            text: `anda yakin akan ${status===1?"menerima":"membatalkan"} deposit ini ??`,
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
                this.props.dispatch(postDeposit(parsedata,btoa(id)));
            }
        })

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
            data,
            // total,
            // per_page,
            // current_page,
        } = this.props.data;
        return(
            <Layout page={"Laporan Deposit"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Laporan Deposit</h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-10">
                                        <div className="row">
                                            <div className="col-6 col-xs-6 col-md-3">
                                                <div className="form-group">
                                                    <label>Periode </label>
                                                    <DateRangePicker
                                                        autoUpdateInput={true} showDropdowns={true} style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onApply={this.handleEvent}>
                                                        <input type="text" readOnly={true} className="form-control" value={`${this.state.dateFrom} to ${this.state.dateTo}`}/>
                                                    </DateRangePicker>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label>Kolom</label>
                                                    <Select
                                                        options={this.state.status_data}
                                                        placeholder="==== Pilih Kolom ===="
                                                        onChange={this.handleChangeStatus}
                                                        value={
                                                            this.state.status_data.find(op => {
                                                                return op.value === this.state.status
                                                            })
                                                        }
                                                    />
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
                                    <div className="col-6 col-xs-6 col-md-2" style={{textAlign:"right"}}>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}>
                                                        <i className="fa fa-search"/>
                                                    </button>
                                                    <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary"  onClick={(e => this.printDocumentXLsx(e,per_page*last_page))}>
                                                        <i className="fa fa-print"/> {!this.props.isLoadingExcel?'Export':'loading...'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <br/>

                        <div style={{overflowX: "auto"}}>
                            <table className="table table-hover table-bordered">
                                <thead className="thead-dark">
                                <tr>
                                    <th rowSpan="2" style={columnStyle}>NO</th>
                                    <th rowSpan="2" style={columnStyle}>#</th>
                                    <th rowSpan="2" style={columnStyle}>KODE TRANSAKSI</th>
                                    <th rowSpan="2" style={columnStyle}>NAMA</th>
                                    <th colSpan="2" style={columnStyle}>BANK TUJUAN</th>
                                    <th rowSpan="2" style={columnStyle}>JUMLAH</th>
                                    <th rowSpan="2" style={columnStyle}>KODE UNIK</th>
                                    <th rowSpan="2" style={columnStyle}>STATUS</th>
                                    <th rowSpan="2" style={columnStyle}>TANGGAL DIBUAT</th>
                                </tr>
                                <tr>
                                    <th style={columnStyle}>AKUN</th>
                                    <th style={columnStyle}>REKENING</th>
                                </tr>

                                </thead>
                                <tbody>
                                {

                                    !this.props.isLoading?this.state.data.length > 0 ?
                                        this.state.data.map((v, i) => {
                                        totAmount = totAmount+parseInt(v.amount);
                                        let status='';
                                            if(v.status===0){
                                                status = <button style={{padding:'10px'}} className={"badge badge-warning"}>Pending</button>
                                            }
                                            if(v.status===1){
                                                status = <button style={{padding:'10px'}} className={"badge badge-success"}>Sukses</button>
                                            }
                                            if(v.status===2){
                                                status = <button style={{padding:'10px'}} className={"badge badge-danger"}>Gagal</button>
                                            }
                                            return (
                                                <tr key={i}>
                                                    <td style={columnStyle}>
                                                        {i+1 + (10 * (parseInt(current_page,10)-1))}
                                                    </td>
                                                    <td style={columnStyle}>
                                                        <button style={{marginRight:"5px"}} className={"btn btn-primary btn-sm"} disabled={v.status === 1 || v.status===2} onClick={(e)=>this.handleApproval(e,v.kd_trx,1)}><i className={"fa fa-check"}/></button>
                                                        <button style={{marginRight:"5px"}} className={"btn btn-danger btn-sm"} disabled={v.status === 1 || v.status===2} onClick={(e)=>this.handleApproval(e,v.kd_trx,2)}><i className={"fa fa-close"}/></button>
                                                        <button className={"btn btn-success btn-sm"} onClick={(e)=>this.handlePaymentSlip(e,i)}><i className={"fa fa-image"}/></button>
                                                    </td>
                                                    <td style={columnStyle}>{v.kd_trx}</td>
                                                    <td style={columnStyle}>{v.fullname}</td>
                                                    <td style={columnStyle}>{v.acc_name}<br/><div style={{paddingTop:'5px'}}>BANK {v.bank_name}</div></td>
                                                    <td style={columnStyle}>{v.acc_no}</td>
                                                    <td style={numStyle} className="txtGreen">Rp {parseInt(v.amount)===0?0:toCurrency(parseInt(v.amount))} .-</td>
                                                    <td style={numStyle} className="txtRed">{parseInt(v.unique_code)===0?0:toCurrency(parseInt(v.unique_code))}</td>
                                                    <td style={columnStyle}>{status}</td>
                                                    <td style={columnStyle}>{myDate(v.created_at)}</td>
                                                </tr>
                                            );
                                        })
                                        : <tr>
                                            <td colSpan={10} style={columnStyle}><img src={NOTIF_ALERT.NO_DATA}/></td>
                                        </tr> : (()=>{
                                        let container =[];
                                        for(let x=0; x<10; x++){
                                            container.push(
                                                <tr key={x}>
                                                    <td style={columnStyle}>{<Skeleton circle={true} height={40} width={40}/>}</td>
                                                    <td style={columnStyle}>
                                                        <Skeleton height={30} width={30}/>
                                                    </td>
                                                    <td style={columnStyle}>{<Skeleton/>}</td>
                                                    <td style={columnStyle}>{<Skeleton/>}</td>
                                                    <td style={columnStyle}>{<Skeleton/>}</td>
                                                    <td style={columnStyle}>{<Skeleton/>}</td>
                                                    <td style={columnStyle}>{<Skeleton/>}</td>
                                                    <td style={columnStyle}>{<Skeleton/>}</td>
                                                    <td style={columnStyle}>{<Skeleton/>}</td>
                                                    <td style={columnStyle}>{<Skeleton/>}</td>
                                                </tr>
                                            )
                                        }
                                        return container;
                                    })()



                                }
                                </tbody>
                                <tfoot style={{backgroundColor:"#EEEEEE"}}>
                                <tr>
                                    <th colSpan={6}>TOTAL PERHALAMAN</th>
                                    <th colSpan={1} style={numStyle} className="txtGreen">Rp {totAmount===0?0:toCurrency(totAmount)} .-</th>
                                    <th colSpan={3}/>
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

                    </div>
                </div>
                {
                    this.props.isOpen===true?<FormPenarikanBonus
                        detail={this.state.detail}
                    />:null
                }
                {/*<FormPaket/>*/}
            </Layout>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        isLoading: state.depositReducer.isLoading,
        isLoadingExcel: state.depositReducer.isLoadingExcel,
        isOpen:state.modalReducer,
        data:state.depositReducer.data,
        dataExcel:state.depositReducer.excel,

    }
}


export default connect(mapStateToProps)(IndexDeposit);