import React,{Component} from 'react';
import Skeleton from 'react-loading-skeleton';


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
        return (
            <div id="ekspedisi" className="col-md-3">
                <div className="row" style={{paddingRight:'20px',textAlign:'left'}}>
                    <div className='col-md-12'>
                        <p style={{paddingBottom:0,marginBottom:0}}>
                            <small><Skeleton width={80} /></small>
                        </p>
                    </div>
                    <div className='col-md-12'>
                        <div className="tr-status" id="status_transaksi">
                            <ul>
                                <li  data-toggle="tooltip" data-placement="top" title="Menunggu Pembayaran">
                                   <Skeleton circle={true} height={24} width={24} />

                                </li>
                                <li data-toggle="tooltip" data-placement="top" title="Dalam Proses">
                                   <Skeleton circle={true} height={24} width={24} />
                                </li>
                                <li data-toggle="tooltip" data-placement="top" title="Terkirim">
                                   <Skeleton circle={true} height={24} width={24} />
                                </li>
                                <li data-toggle="tooltip" data-placement="top" title="Selesai">
                                   <Skeleton circle={true} height={24} width={24} />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="row" style={{paddingLeft:'20px',paddingRight:'20px',textAlign:'left'}}>
                    <div className="col-md-6 col-sm-6" style={{margin:'0px',padding:'0px'}}>
                        <p className="order-items" style={{paddingTop:0,marginTop:0}}><small><Skeleton width={50} /></small><br /><Skeleton width={40} /></p>
                    </div>
                    <div className="col-md-6 col-sm-6" style={{margin:'0px',padding:'0px'}}>
                        <p className="order-items" style={{paddingTop:0,marginTop:0}}><small><Skeleton width={50} /></small><br /><Skeleton width={40} /></p>
                    </div>
                </div>
                <p style={{marginBottom:'5px'}}>
                    <small><Skeleton width={60} /></small>
                </p>
                <Skeleton width={40} height={40}/>
                    <Skeleton width={40} />       
                </div>
        )
    }
}

export default (Produk);
