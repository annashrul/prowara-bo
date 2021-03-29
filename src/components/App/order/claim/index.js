import React,{Component} from 'react';
import Layout from "../../../Layout";
import connect from "react-redux/es/connect/connect";
import {fetchData,approval} from "redux/actions/laporan/claim.action";
import Paginationq, {ToastQ} from "helper";
import imgDefault from 'assets/default.png'
import Skeleton from 'react-loading-skeleton';
import moment from "moment";
import * as Swal from "sweetalert2";

class ReportRedeem extends Component{
    constructor(props){
        super(props);
        this.handleApproval = this.handleApproval.bind(this)
    }
    componentWillMount(){
        this.props.dispatch(fetchData('page=1'));
    }
    rowProduk(image, title, karir) {
        return (
            <div className="card shadow-1">
                <div className="row">
                    <div className="col-md-2">
                        <div style={{width:'100px',height:'100px'}}>
                            <img src={image} onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} alt="barang" className="img-responsive" />
                        </div>
                    </div>
                    <div className="col-md-4" style={{padding: '10px 10px', wordBreak:'break-word'}}>{title}<br/>
                    Reward Karir <bold>{karir}</bold>
                    </div>
                </div>
            </div>
        )
    }

    handlePageChange(num){
        this.props.dispatch(fetchData('page='+num));
    }

    handleApproval(e,trx,status){
        e.preventDefault();
        Swal.fire({
            title: 'Perhatian !!!',
            html: `anda yakin akan ${status===0?'Menolak':"Menerima"} transaksi ini?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Ya`,
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(approval(trx,status))
            }
        })
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
            <Layout page="Claim Reward" headers="Claim Reward" >
                <div className="row">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Claim Reward</h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {
                        !this.props.isLoading?typeof data==='object'?data.length>0?data.map((v,i)=>{
                            return(
                                <div className="col-md-12 box-margin">
                                    <div className="card">
                                        <div className="card-body">
                                                <h5 class="card-title badge badge-warning">#REWARD <b>{v.karir}</b></h5>
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
                                                        <small>Telp: </small>{v.no_hp} <br/>
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
                                                        <p>
                                                            <small>Produk</small><br />
                                                            {
                                                                this.rowProduk(
                                                                    v.gambar,
                                                                    v.reward,
                                                                    v.karir
                                                                )
                                                            }
                                                        </p>
                                                    </div>
                                                        <p style={{marginTop:'10px',marginBottom:'5px'}}>
                                                            <small>Status</small>
                                                        </p>
                                                        {
                                                            v.status==0?
                                                            <span className="badge badge-warning">Menunggu Konfirmasi</span>:
                                                            v.status==1?
                                                            <span className="badge badge-info">Disetujui</span>:
                                                            v.status==2?
                                                            <span className="badge badge-danger">Ditolak</span>:
                                                            v.status==3?
                                                            <span className="badge badge-warning">Reward diterima</span>:
                                                            ''
                                                        }
                                                        

                                                    <div>
                                                        {
                                                            v.status>0?'':(
                                                                <div>
                                                                    <p style={{marginTop:'10px',marginBottom:'5px'}}>
                                                                        <small>Konfirmasi</small>
                                                                    </p>
                                                                    <button className="btn btn-success" onClick={event=>this.handleApproval(event,v.kd_trx,1)} style={{width:'100%'}}>Terima</button><br/>
                                                                    <button className="btn btn-danger" onClick={event=>this.handleApproval(event,v.kd_trx,0)} style={{width:'100%',marginTop:'10px'}}>Tolak</button>
                                                                </div>
                                                            )
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
                                        <div className="col-md-6 box-margin">
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
        isLoading: state.claimReducer.isLoading,
        auth: state.auth,
        data:state.claimReducer.data

    }
}

export default connect(mapStateToProps)(ReportRedeem)