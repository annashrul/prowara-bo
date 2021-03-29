import React,{Component} from 'react';
import Skeleton from 'react-loading-skeleton';

class Produk extends Component{
    rowProduk(){
        return (
            <div className="card shadow-1">
                <div className="row">
                    <div className="col-md-3">
                        <div style={{width:'50px',height:'50px'}}>
                            <Skeleton width={50} height={50}/>
                        </div>
                    </div>
                    <div className="col-md-8" style={{padding: '6px 0px', wordBreak:'break-word'}}><Skeleton width={50}/>
                        <div style={{fontSize: '10px'}}><Skeleton width={30}/></div>
                    </div>
                </div>
            </div>
        )
    }

    rowBottom(){
        return (
            <div className="col-md-6 col-sm-12" style={{margin:'0px',padding:'0px'}}>
                <p className="order-items"><small><Skeleton width={60}/></small><br /><Skeleton width={30}/></p>
            </div>
        )
    }

    render(){
        const data = this.props.data;
        const len= data===undefined?(280/2)+'px':(data.length>=3?180:280/1.5)+'px';
        return (
            <div id="product" className="col-md-3">
                <div className="scrollbar" style={{height:len, overflowX:'hidden', overflowY:'auto'}}>
                    <p className="order-items">
                        <small><Skeleton width={60}/></small><br />
                        {
                            (() => {
                                    const list=[]
                                        for (let x = 0; x < 3; x++) {
                                                list.push(this.rowProduk())
                                        }
                                        return list
                                    })()
                        }
                    </p>
                </div>
            <div className="row" style={{paddingLeft:'20px',paddingRight:'20px',textAlign:'center'}}>
                {this.rowBottom('Subtotal',0)}
                {this.rowBottom('PPN', 0)}
                {this.rowBottom('Diskon', 0)}
                {this.rowBottom('Ongkir', 0)}
            </div>
            <hr />
        </div>
        )
    }
}

export default (Produk);
