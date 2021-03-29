import React,{Component} from 'react';
import Skeleton from 'react-loading-skeleton';

class Produk extends Component{
    render(){
        return (
            <div id="address" className="col-md-3">
                <div className="alert alert-warning bg-warning">
                    <p>
                        <div className="text-white" style={{float:'left'}}><Skeleton width={30}/></div>  
                            <small className="text-white" style={{float:'right'}}>
                                <Skeleton width={20}/>
                            </small>
                        </p>
                    <div style={{clear:'both'}} />
                    <p className="med mbtm-10 order-items" data-toggle="tooltip" data-placement="top" title data-original-title="Belum Dibayar">
                        <span
                            className="text-white"
                            style={{cursor:'pointer',fontSize:'1.3em'}}
                        >
                           <Skeleton width={60}/>
                        </span>
                    </p>
                    <div className="row payment-stts">
                        <div className="col-sm-12 col-md-12">
                            <p className="order-items text-white" style={{padding:0,margin:0,marginTop:'5px',marginBottom:'5px'}}>
                                <div className="text-white" style={{float:'left',fontWeight:'light'}}>
                                    <Skeleton width={60}/></div> <br/>
                                <div style={{fontSize:'1.3em'}}>
                                    <Skeleton width={40}/>
                                </div>
                            </p>
                        </div>
                    </div>
                     <div className="row payment-stts">
                        <div className="col-sm-12 col-md-12">
                            <p className="order-items text-white" style={{padding:0,margin:0,marginTop:'5px',marginBottom:'5px'}}>
                                <div className="text-white" style={{float:'left',fontWeight:'light'}}>
                                    <Skeleton width={60}/></div> <br/>
                                <div style={{fontSize:'1.3em'}}>
                                    <Skeleton width={40}/>
                                </div>
                            </p>
                        </div>
                    </div>
                </div>
            <hr />
            </div>
        )
    }
}

export default (Produk);
