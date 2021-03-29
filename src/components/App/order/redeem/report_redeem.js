import React,{Component} from 'react';
import Layout from "../../../Layout";
import connect from "react-redux/es/connect/connect";
import {getReportRedeem, putReportRedeem} from "../../../../redux/actions/laporan/report_redeem.action";
import * as Toast from "sweetalert2";
import Paginationq, {noImage, statusOrder, toCurrency,ToastQ} from "../../../../helper";
import imgDefault from 'assets/default.png'
import {Link} from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import moment from "moment";
import {lacakResi, updateResi} from "../../../../redux/actions/laporan/laporan_penjualan.action";

class ReportRedeem extends Component{
    constructor(props){
        super(props);
        this.state = {
            dateFrom: moment().format('YYYY-MM-DD'),
            dateTo: moment().format('YYYY-MM-DD'),
            resi:'',
            dataPenjualan:[]

        };
        this.handlePageChange = this.handlePageChange.bind(this)
        this.handleResi = this.handleResi.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.data.data !== undefined) {
            const data=[];
            if(nextProps.data.data.length>0){
                for(let i=0;i<nextProps.data.data.length;i++){
                    data.push(Object.assign(nextProps.data.data[i]));
                }
            }
            this.setState({dataPenjualan:data});
        }
    }
    componentWillMount(){
        this.props.dispatch(getReportRedeem('page=1'));
    }
    rowProduk(image, title, qty, hrg){
        return (
            <div className="card shadow-1">
                <div className="row">
                    <div className="col-md-3">
                        <div style={{width:'50px',height:'50px'}}>
                            <img src={image} onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} alt="barang" className="img-responsive" />
                        </div>
                    </div>
                    <div className="col-md-8" style={{padding: '6px 0px', wordBreak:'break-word'}}>{title}
                        <div className={"txtRed"} style={{fontSize: '10px'}}>{qty}</div>
                    </div>
                </div>
            </div>
        )
    }
    handleChange = (e,i) => {
        let column = e.target.name;
        let value = e.target.value;
        let dataPenjualan = [...this.state.dataPenjualan];
        dataPenjualan[i] = {...dataPenjualan[i], [column]: value};
        this.setState({dataPenjualan:dataPenjualan});
    }

    handlePageChange(num){
        this.props.dispatch(getReportRedeem('page='+num));
    }

    handleResi(e, kdtrx, resi,isLacak=false) {
        e.preventDefault()
        console.log(btoa(kdtrx));
        console.log(resi);
        this.props.dispatch(putReportRedeem(btoa(kdtrx),{"resi":resi},"page=1"));
        // this.setState({
        //     dataTrx: [],
        //     dataPenjualan: []
        // })
        // if(!isLacak) this.props.dispatch(updateResi(kdtrx, resi));
        // else this.props.dispatch(lacakResi(kdtrx, resi, kurir));
        // console.log(resi);
    }
    render(){

        const {
            last_page,
            per_page,
            current_page,
            data
        } = this.props.data;
        console.log(data);
        return (
            <Layout page="Report Redeem" headers="Report Redeem" >
                <div className="row">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Redeem</h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {
                        !this.props.isLoading?data!==undefined?data.length>0?this.state.dataPenjualan.map((v,i)=>{
                            return(
                                <div className="col-md-6  box-margin" key={i}>
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div id="head_order" className="col-md-6">
                                                    <small>Invoice no.</small>
                                                    <p className="h5">
                                                        <a
                                                            href={null}
                                                            className="forceOneEm"
                                                            onClick = {
                                                                (e) => {
                                                                    e.preventDefault();
                                                                    navigator.clipboard.writeText(v.kd_trx);
                                                                    ToastQ.fire({icon:'success',title:`No. Invoice berhasil disalin`});
                                                                }
                                                            }
                                                        ><strong className={"txtGreen"}>#{v.kd_trx}</strong> <i className="fa fa-copy" style={{fontSize:'.5em'}}/> </a>
                                                    </p>
                                                    <small>Pemesan</small>
                                                    <p><span>{v.full_name}</span></p>
                                                    <small>Detail Alamat</small>
                                                    <p>
                                                        <span>{v.main_address}</span><br/>
                                                        <small>Penerima: </small>{v.penerima} <br/>
                                                    </p>
                                                    <div className="row" style={{paddingLeft:'15px',paddingRight:'20px',textAlign:'left'}}>
                                                        <div className="col-md-6 col-sm-6" style={{margin:'0px',padding:'0px'}}>
                                                            <p className="order-items" style={{paddingTop:0,marginTop:0}}><small>Tgl Pemesanan</small><br />{moment(v.created_at).format("DD MMM YYYY")}</p>
                                                        </div>
                                                        <div className="col-md-6 col-sm-6" style={{margin:'0px',padding:'0px'}}>
                                                            <p className="order-items" style={{paddingTop:0,marginTop:0}}><small>Tgl Terima</small><br />{v.tgl_terima===null?'-':moment(v.tgl_terima).format("DD MMM YYYY")}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="product" className="col-md-6">
                                                    <div className="scrollbar">
                                                            <small>Produk</small><br />
                                                            {
                                                                this.rowProduk(
                                                                    v.gambar,
                                                                    v.title,
                                                                    `${v.subtotal} POIN`,
                                                                    ""
                                                                )
                                                            }
                                                    </div>
                                                    <div className="row" style={{paddingRight:'20px',textAlign:'left'}}>
                                                        <div className='col-md-12'>
                                                            <p style={{paddingBottom:0,marginBottom:0}}>
                                                                <small>Status Transaksi</small>
                                                            </p>
                                                        </div>
                                                        <div className='col-md-12'>
                                                            {
                                                                v.status!==4?(
                                                                    <div className="tr-status" id="status_transaksi">
                                                                        <ul>
                                                                            <li className={(v.status===0||v.status>0)?"done":"undone"} data-toggle="tooltip" data-placement="top" title="Menunggu Pembayaran">
                                                                                <img alt="images" onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" id="TpBelumBayar" src={statusOrder('dollar',(v.status===0||v.status>0))}/>
                                                                            </li>
                                                                            <li className={(v.status===1||v.status>1)?"done":"undone"} data-toggle="tooltip" data-placement="top" title="Dalam Proses">
                                                                                <img alt="images" onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" src={statusOrder('packing',(v.status===1||v.status>1))}/>
                                                                            </li>
                                                                            <li className={(v.status===2||v.status>2)?"done":"undone"} data-toggle="tooltip" data-placement="top" title="Terkirim">
                                                                                <img alt="images" onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" src={statusOrder('truck',(v.status===2||v.status>2))}/>
                                                                            </li>
                                                                            <li className={(v.status===3||v.status>3)?"done":"undone"} data-toggle="tooltip" data-placement="top" title="Selesai">
                                                                                <img alt="images" onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" src={statusOrder('delivered',(v.status===3||v.status>3))}/>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                ):(
                                                                    <span className="btn btn-danger btn-sm"><i className='fa fa-remove'/> DIBATALKAN</span>

                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p style={{marginTop:'10px',marginBottom:'5px'}}>
                                                            <small>No. Resi</small>
                                                        </p>
                                                        {
                                                            v.resi!=='-'?(
                                                                <div id="no_resi">
                                                                    Resi: {v.resi}
                                                                </div>
                                                            ):''
                                                        }
                                                        {
                                                            v.valid_resi===0?(
                                                                <div id="input_resi">
                                                                    <input
                                                                        type="text"
                                                                        name='resi'
                                                                        className="form-control form-control-sm"
                                                                        placeholder="Cth. JO012XXXXXX"
                                                                        value={v.resi}
                                                                        onChange={(e)=>this.handleChange(e,i)}
                                                                        onKeyPress = {
                                                                            event => {
                                                                                if (event.key === 'Enter') {
                                                                                    this.handleResi(event, v.kd_trx, v.resi)
                                                                                }
                                                                            }
                                                                        }
                                                                    />
                                                                    <small id="passwordHelpBlock" className="form-text text-muted">
                                                                        Tekan enter untuk update
                                                                    </small>
                                                                </div>
                                                            ):''
                                                        }
                                                    </div>


                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }):"":"":(() => {
                            const list=[]
                            for (let x = 0; x < 10; x++) {
                                list.push(
                                        <div className="col-md-6 box-margin" key={x}>
                                            <Skeleton height={300} width={'100%'}/>

                                        </div>
                                )
                            }
                            return list
                        })()
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
        isLoading: state.reportRedeemReducer.isLoading,
        auth: state.auth,
        data:state.reportRedeemReducer.data

    }
}

export default connect(mapStateToProps)(ReportRedeem)