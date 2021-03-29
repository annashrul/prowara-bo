import React,{Component} from 'react';
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
class Produk extends Component{
    render(){
        const {
            grandtotal,
            kd_trx,
            status,
            voucher,
            metode_pembayaran
        }=this.props
        return (
            <div id="address" className="col-md-3">
                <div className="alert alert-warning bg-warning">
                    <p>
                        <div className="text-white" style={{float:'left'}}>Grand Total</div>  
                            <small className="text-white" style={{float:'right'}}>
                                #{kd_trx}
                            </small>
                        </p>
                    <div style={{clear:'both'}} />
                    <p className="med mbtm-10 order-items" style={{padding:0,margin:0,marginTop:'5px',marginBottom:'5px'}} data-toggle="tooltip" data-placement="top" title data-original-title="Belum Dibayar">
                        <span
                            className="text-white"
                            style={{cursor:'pointer',fontSize:'1.3em'}}
                            onClick={(e) => {
                                e.preventDefault();
                                navigator.clipboard.writeText(grandtotal);
                                Toast.fire({icon: 'success',title: `Data has been copied.`})
                                }}
                        >
                            Rp {grandtotal} <i className="fa fa-copy" style={{fontSize:'.5em'}}/> 
                        </span>
                    </p>
                    <div className="row payment-stts">
                        <div className="col-sm-12 col-md-12">
                            <p className="order-items text-white" style={{padding:0,margin:0,marginTop:'5px',marginBottom:'5px'}}>
                                <div className="text-white" style={{float:'left',fontWeight:'light'}}>Metode Pembayaran</div> <br/>
                                <div style={{fontSize:'1.2em'}}>{metode_pembayaran.charAt(0).toUpperCase() + metode_pembayaran.slice(1)}</div>
                            </p>
                        </div>
                    </div>
                    <div className="row payment-stts">
                        <div className="col-sm-12 col-md-12">
                            <p className="order-items text-white" style={{padding:0,margin:0,marginTop:'5px',marginBottom:'5px'}}>
                                <div className="text-white" style={{float:'left',fontWeight:'light'}}>Voucher</div> <br/>
                                <div style={{fontSize:'1.2em'}}>{voucher}</div>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row" id="action">
                    <div className='col-md-6 '>
                    </div>
                    {
                        metode_pembayaran!=='saldo'?parseInt(status,10)===0?(
                            <div className='col-md-12 '>
                                <Link id="batalkan" to='/deposit' className="btn btn-block btn-sm btn-success">Konfirmasi Pesanan</Link>
                            </div>
                        ):'':''
                    }
                    {
                        status===0?(
                            <div className='col-md-12 mt-3'>
                                <button id="batalkan" onClick={e=>this.handleApproval(e,kd_trx)} className="btn btn-block btn-sm btn-danger">Batalkan Pesanan</button>
                            </div>
                        ):''
                    }
                </div>
            <hr />
            </div>
        )
    }
}

export default (Produk);
