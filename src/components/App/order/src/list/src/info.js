import React,{Component} from 'react';
import Swal from 'sweetalert2'
import moment from 'moment';
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
class Info extends Component{
    render(){
        const data = this.props.data;
        return (
            <div id="head_order" className="col-md-3">
                <small>Invoice no.</small>
                 <p className="h5">
                    <a 
                    href={null}
                    className="forceOneEm" 
                    onClick = {
                        (e) => {
                            e.preventDefault();
                            navigator.clipboard.writeText(data.kd_trx);
                            Toast.fire({
                                icon: 'success',
                                title: `Data has been copied.`
                            })
                        }
                    }
                    ><strong>{data.kd_trx}</strong> <i className="fa fa-copy" style={{fontSize:'.5em'}}/> </a>
                </p>
                <small>Pemesan</small>
                <p><span>{data.full_name}</span></p>
                <small>Detail Alamat <span className="badge badge-info">{data.title}</span></small>
                <p>
                    <span>{data.main_address}</span><br/>
                    <small>Penerima: </small>{data.penerima} <br/>
                    <small>Telp: </small>{data.no_hp} 
                </p>
                <hr />
                <input name={"isChecked"} checked={data.isChecked} type="checkbox" onChange={(e)=>this.props.handleChange(e,this.props.in)} />
                <Link to='/print_laporan_penjualan' style={{pointerEvents:data.isChecked===false?'none':''}}>
                    <button className="btn btn-sm btn-info" style={{marginLeft:'10px'}}>
                        <span className="fa fa-print"/> PRINT LABEL PENGIRIMAN
                    </button>
                </Link>
            </div>
        )
    }
}

export default (Info);
