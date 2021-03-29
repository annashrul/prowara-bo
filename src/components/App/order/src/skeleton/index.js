import React,{Component} from 'react';
import Info from './src/info'
import Produk from './src/produk'
import Tagihan from './src/tagihan'
import Ekspedisi from './src/ekspedisi'
import Skeleton from 'react-loading-skeleton';

class ListBrand extends Component{

    render(){
        return (
            <div className="col-12 box-margin">
                <div className="card">
                    <div className="card-body" id="result_table">
                        <div className="row" style={{borderBottom:'2px solid #eee',marginBottom:'10px',paddingBottom:'10px'}}>
                            <div className='col-md-12'>
                                <Skeleton width={80}/>
                            </div>
                        </div>
                        <div className="row">
                            {/* section 1 */}
                            <Info />
                            {/* section 2 */}
                            <Produk/>
                            {/* section 3 */}
                            <Tagihan />
                            {/* section 4 */}
                            <Ekspedisi />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default (ListBrand);