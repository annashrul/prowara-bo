import React,{Component} from 'react';
import Layout from "../../../Layout";
import connect from "react-redux/es/connect/connect";
import {getReportReward} from "../../../../redux/actions/laporan/report_reward.action";
import {DateRangePicker} from "react-bootstrap-daterangepicker";
import Paginationq, {rangeDate, noImage, rmComma, ToastQ, toCurrency, toRp, statusOrder} from "../../../../helper";
import {NOTIF_ALERT} from "../../../../redux/actions/_constants";
import moment from "moment";
import imgDefault from 'assets/default.png'
import Skeleton from 'react-loading-skeleton';

const prefix='ReportReward';

class IndexReportReward extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            any:"",
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD"),
        };
        this.handleChange      = this.handleChange.bind(this);
        this.handlePage      = this.handlePage.bind(this);
        this.handleSearch      = this.handleSearch.bind(this);
        this.handleEvent      = this.handleEvent.bind(this);

    }
    handleValidate(){
        let sessPage=localStorage.getItem(`page${prefix}`);
        let sessDateFrom=localStorage.getItem(`dateFrom${prefix}`);
        let sessDateTo=localStorage.getItem(`dateTo${prefix}`);
        let page = sessPage!==null?sessPage:"1";
        let dateFrom=sessDateFrom!==null?sessDateFrom:this.state.dateFrom;
        let dateTo=sessDateTo!==null?sessDateTo:this.state.dateTo;
        let any = this.state.any;
        let where=`page=${page}&perpage=10&datefrom=${dateFrom}&dateto=${dateTo}`;
        if(any!==null&&any!==undefined&&any!==""){
            where+=`&q=${any}`;
        }
        return where;
    }
    componentWillUnmount(){
        localStorage.removeItem(`dateFrom${prefix}`);
        localStorage.removeItem(`dateTo${prefix}`);
        localStorage.removeItem(`page${prefix}`);
    }
    componentWillMount(){
        let where=this.handleValidate();
        this.props.dispatch(getReportReward(where));
    }
    handleChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handlePage(num){
        localStorage.setItem(`page${prefix}`,num);
        let where = this.handleValidate();
        this.props.dispatch(getReportReward(where));

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
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem(`dateFrom${prefix}`,`${this.state.dateFrom}`);
        localStorage.setItem(`dateTo${prefix}`,`${this.state.dateTo}`);
        localStorage.removeItem(`page${prefix}`);
        let where = this.handleValidate();
        this.props.dispatch(getReportReward(where));
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
        } = this.props.data;
        return (
            <Layout page="Report Reward" headers="Report Reward" >
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Report Reward</h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            <div className="row" style={{zoom:"90%"}}>
                                <div className="col-6 col-xs-6 col-md-2">
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
                                        <label>Cari</label>
                                        <input type="text" className="form-control" name="any" placeholder={"cari disini"} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                    </div>
                                </div>
                                <div className="col-2 col-xs-2 col-md-4">
                                    <div className="form-group">
                                        <button style={{marginTop:"27px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                        <button style={{marginTop:"27px",marginLeft:"5px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleAdd(e)}><i className="fa fa-plus"/></button>
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>
                </div>
            </div>


                <div className="row">
                    {
                        !this.props.isLoading?typeof data==='object'?data.length>0?data.map((v,i)=>{
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
                                                                    v.reward,
                                                                    v.karir,
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
                                                                    Resi: {v.resi} <small><a href="#">Lacak resi</a></small>
                                                                </div>
                                                            ):'-'
                                                        }
                                                    </div>


                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }): <img src={NOTIF_ALERT.NO_DATA} alt=""/>:<img src={NOTIF_ALERT.NO_DATA} alt=""/>:(() => {
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
                    <div className="col-md-12">
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

            </Layout>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        data:state.reportRewardReducer.data,
        isLoading: state.reportRewardReducer.isLoading,
        auth: state.auth

    }
}

export default connect(mapStateToProps)(IndexReportReward)