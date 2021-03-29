import React,{Component} from 'react';
import {statusOrder} from "helper";
// import { Tooltip } from 'reactstrap';
import imgDefault from 'assets/default.png'
import moment from 'moment';

class Produk extends Component{
    constructor(props){
        super(props);
        this.state={
            tooltipOpen:false,
            resi:''
        }
        this.toggle=this.toggle.bind(this)
    }
    toggle(){
        this.setState({
            tooltipOpen:!this.state.tooltipOpen
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render(){
        const data = this.props.data
        const split = data.layanan_pengiriman.split('|');

        return (
            <div id="ekspedisi" className="col-md-3">
                <div className="row" style={{paddingRight:'20px',textAlign:'left'}}>
                    <div className='col-md-12'>
                        <p style={{paddingBottom:0,marginBottom:0}}>
                            <small>Status Transaksi</small>
                        </p>
                    </div>
                    <div className='col-md-12'>
                        {
                            data.status===4?(
                                 <span className="btn btn-danger btn-sm"><i className='fa fa-remove'/> DIBATALKAN</span>
                            ):(
                                <div className="tr-status" id="status_transaksi">
                                    <ul>
                                        <li className={(data.status===0||data.status>0)?"done":"undone"} data-toggle="tooltip" data-placement="top" title="Menunggu Pembayaran">
                                            <img alt="images" onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" id="TpBelumBayar" src={statusOrder('dollar',(data.status===0||data.status>0))}/>
                                        </li>
                                        <li className={(data.status===1||data.status>1)?"done":"undone"} data-toggle="tooltip" data-placement="top" title="Dalam Proses">
                                            <img alt="images" onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" src={statusOrder('packing',(data.status===1||data.status>1))}/>
                                        </li>
                                        <li className={(data.status===2||data.status>2)?"done":"undone"} data-toggle="tooltip" data-placement="top" title="Terkirim">
                                            <img alt="images" onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" src={statusOrder('truck',(data.status===2||data.status>2))}/>
                                        </li>
                                        <li className={(data.status===3||data.status>3)?"done":"undone"} data-toggle="tooltip" data-placement="top" title="Selesai">
                                            <img alt="images" onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} className="svg icon" src={statusOrder('delivered',(data.status===3||data.status>3))}/>
                                        </li>
                                    </ul>
                                </div>

                            )
                        }
                    </div>
                </div>
                <div className="row" style={{paddingLeft:'20px',paddingRight:'20px',textAlign:'left'}}>
                    <div className="col-md-6 col-sm-6" style={{margin:'0px',padding:'0px'}}>
                        <p className="order-items" style={{paddingTop:0,marginTop:0}}><small>Tgl Pemesanan</small><br />{moment(data.created_at).format("DD MMM YYYY")}</p>
                    </div>
                    <div className="col-md-6 col-sm-6" style={{margin:'0px',padding:'0px'}}>
                        <p className="order-items" style={{paddingTop:0,marginTop:0}}><small>Tgl Terima</small><br />{data.tgl_terima===null?'-':moment(data.tgl_terima).format("DD MMM YYYY")}</p>
                    </div>
                </div>
                <p style={{marginBottom:'5px'}}>
                    <small>Expedisi</small>
                </p>
                <img alt="images" className='img-responsive' onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} src={data.kurir} style={{maxWidth: '80px', maxHeight: '40px', marginRight: '10px'}} />
                <span className="badge badge-success">{data.layanan_pengiriman.replace('|',' - ')}</span>
                {
                    split[0]!=='COD'?
                        parseInt(data.status,10)>0?
                        <div>
                            <p style={{marginTop:'10px',marginBottom:'5px'}}>
                                <small>No. Resi</small>
                            </p>
                            {
                                data.resi!=='-'?(
                                    <div id="no_resi">
                                        Resi: {data.resi} <small><a href="#" onClick={(e)=>this.props.handleResi(e, data.kd_trx, data.resi,split[0],true)}>Lacak resi</a></small>
                                    </div>
                                ):''
                            }
                            {
                                data.valid_resi===0?(
                                    <div id="input_resi">
                                        <input
                                            type="text"
                                            name='resi'
                                            className="form-control form-control-sm"
                                            placeholder="Cth. JO012XXXXXX"
                                            onChange={e=>this.handleChange(e)}
                                            onKeyPress = {
                                                event => {
                                                    if (event.key === 'Enter') {
                                                        this.props.handleResi(event, data.kd_trx, this.state.resi)
                                                    }
                                                }
                                            }
                                        />
                                        <small id="passwordHelpBlock" class="form-text text-muted">
                                            Tekan enter untuk update
                                        </small>
                                    </div>
                                ):''
                            }
                        </div>
                        :''
                    :''
                }

                </div>
        )
    }
}

export default (Produk);
