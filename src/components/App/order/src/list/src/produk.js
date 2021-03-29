import React,{Component} from 'react';
import imgDefault from 'assets/default.png'
import {toCurrency} from 'helper'

class Produk extends Component{
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
                        <div style={{fontSize: '10px'}}>{qty} x Rp {toCurrency(hrg)}</div>
                    </div>
                </div>
            </div>
        )
    }

    rowBottom(title,value){
        console.log(value);
        return (
            <div className="col-md-6 col-sm-12" style={{margin:'0px',padding:'0px'}}>
                <p className="order-items" style={{padding:0,margin:0}}><small>{title}</small><br /><small>Rp</small> {toCurrency(value)}</p>
            </div>
        )
    }

    render(){
        const data = this.props.data;
        const len= data===undefined?(180/2)+'px':(data.length>=3?180:280/1.5)+'px';
        return (
            <div id="product" className="col-md-3">
                <div className="scrollbar" style={{height:len, overflowX:'hidden', overflowY:'auto'}}>
                    <p className="order-items">
                        <small>Produk</small><br />
                        {
                            data!==undefined?
                                data.map((item,key)=>{
                                    return this.rowProduk(
                                        item.foto,
                                        item.paket,
                                        item.qty+" item",
                                        item.price
                                    )
                                }):''
                        }
                    </p>
                </div>
            <div className="row" style={{paddingLeft:'20px',paddingRight:'20px',textAlign:'center'}}>
                {this.rowBottom('Subtotal',this.props.subtotal)}
                {this.rowBottom('Diskon', this.props.diskon)}
                {this.rowBottom('PPN', this.props.ppn)}
                {this.rowBottom('Ongkir',this.props.ongkir)}
            </div>
            <hr />
        </div>
        )
    }
}

export default (Produk);
