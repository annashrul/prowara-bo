import React,{Component} from 'react';
import Info from './src/info'
import Produk from './src/produk'
import Tagihan from './src/tagihan'
import Ekspedisi from './src/ekspedisi'
import {toCurrency} from 'helper'
class ListBrand extends Component{
    // constructor(props){
    //     super(props);
       
    // }
    render(){
        const data = this.props.data
        return (
            <div className="col-12 box-margin">
                <div className="card">
                    <div className="card-body" id="result_table">
                        <div className="row" style={{borderBottom:'2px solid #eee',marginBottom:'10px',paddingBottom:'10px'}}>
                            <div className='col-md-12'>
                                {
                                    data.type===0?<div className='btn btn-dark'>AKTIVASI</div>:<div className='btn btn-secondary'>RO</div>
                                }
                            </div>
                        </div>
                        <div className="row">
                            {/* section 1 */}
                            <Info
                                data={data}
                                in={this.props.in}
                                handleChange={this.props.handleChange}
                            />
                            {/* section 2 */}
                            <Produk
                                data={data.detail}
                                subtotal={data.subtotal}
                                ppn={data.tax}
                                diskon={data.disc}
                                ongkir={parseInt(data.ongkir)}
                            />
                            {/* section 3 */}
                            <Tagihan
                                kd_trx={data.kd_trx}
                                grandtotal={toCurrency(data.grand_total)}
                                bukti={data.bukti}
                                metode_pembayaran={data.metode_pembayaran}
                                status={data.status}
                                voucher={data.voucher_code}
                                handleApproval={this.props.handleApproval}
                            />
                            {/* section 4 */}
                            <Ekspedisi
                                data={data}
                                handleResi={this.props.handleResi}
                            />
                        
                        
                        
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default (ListBrand);