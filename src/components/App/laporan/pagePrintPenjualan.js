import React,{Component} from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {noImage} from "../../../helper";
class PagePrintPenjualan extends Component {
    constructor(props){
        super(props);
        this.state={
            cetak:'shipping_label',
            detail_order:true,
            fragile_sign:true,
            shop_logo:true,
            shop_info:true,
            expedisi:true,
            no_order:true,
            tanggal_order:true,
            sku:false,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = e => {
        let column = e.target.name;
        let value = e.target.value;
        let checked = e.target.checked;
        let type = e.target.type;
        if(type==='checkbox'){
            this.setState({[column]: checked});
            return;
        }

        this.setState({[column]: value});
    };
    render(){
        const expedisi={
            textAlign:'left',
            display:'inlineBlock',
            border:'1px solid black',
            margin:'15px 0',
            fontWeight:'bold',
            padding:'10px 15px',
            fontSize:'14px'
        };
        const lnr ={borderBottom: '1px dashed #ddd',paddingBottom:'5px',marginBottom:'15px',width:'90%'};

        return(
            <Layout>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-2">
                                <Link to='/penjualan'>
                                    <button className={"btn btn-success"} style={{letterSpacing:'3px'}}> <i className={'fa fa-arrow-left'}/> KEMBALI</button>
                                </Link>
                            </div>
                            <div className="col-md-2">
                                <p style={{letterSpacing:'3px'}}>CETAK</p>
                                <div className="radio-buttons" style={{letterSpacing:'2px',color:'grey'}}>
                                    <input value={'shipping_label'} name="cetak" type="radio" onChange={this.handleChange} defaultChecked /> Shipping Label<br/>
                                    {/*<input value={'shipping_label_v2'} name="cetak" type="radio" onChange={this.handleChange}/> Shipping Label v2<br/>*/}
                                    <input value={'invoice'} name="cetak" type="radio" onChange={this.handleChange}/> Invoice
                                </div>
                            </div>
                            <div className="col-md-7">
                                <p style={{letterSpacing:'3px'}}>PENGATURAN</p>
                                {
                                    this.state.cetak==='shipping_label'?(
                                        <div style={{display:'inlineBlock',letterSpacing:'2px',color:'grey'}}>
                                            <input type="checkbox" name="detail_order" checked={this.state.detail_order} onChange={this.handleChange}/> Detail Order &nbsp;
                                            <input type="checkbox" name="fragile_sign" checked={this.state.fragile_sign} onChange={this.handleChange}/> Fragile Sign&nbsp;
                                            <input type="checkbox" name="shop_logo" checked={this.state.shop_logo} onChange={this.handleChange}/> Shop Logo&nbsp;
                                            <input type="checkbox" name="shop_info" checked={this.state.shop_info} onChange={this.handleChange}/> Shop Info&nbsp;
                                            <input type="checkbox" name="expedisi" checked={this.state.expedisi} onChange={this.handleChange}/> Expedisi&nbsp;
                                            <input type="checkbox" name="no_order" checked={this.state.no_order} onChange={this.handleChange}/> No. Order&nbsp;
                                            <input type="checkbox" name="tanggal_order" checked={this.state.tanggal_order} onChange={this.handleChange}/> Tanggal Order
                                        </div>
                                    ):(this.state.cetak==='shipping_label_v2'?(
                                        <div style={{display:'inlineBlock',letterSpacing:'2px',color:'grey'}}>
                                            <input type="checkbox" name="detail_order" checked={this.state.detail_order} onChange={this.handleChange}/> Detail Order &nbsp;
                                            <input type="checkbox" name="no_order" checked={this.state.no_order} onChange={this.handleChange}/> No. Order&nbsp;
                                            <input type="checkbox" name="tanggal_order" checked={this.state.tanggal_order} onChange={this.handleChange}/> Tanggal Order
                                        </div>
                                    ):(
                                        <div style={{display:'inlineBlock',letterSpacing:'2px',color:'grey'}}>
                                            <input type="checkbox" name="sku" checked={this.state.sku} onChange={this.handleChange}/> SKU
                                        </div>
                                    ))
                                }

                            </div>
                            <div className="col-md-1">
                                <Link to='/penjualan'>
                                    <button className={"btn btn-success"} style={{letterSpacing:'2px'}}> <i className={'fa fa-print'}/> PRINT</button>
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
                <br/>


                {
                    this.state.cetak==='invoice'?(
                        <div className="card" style={{border:'1px dashed black'}} >
                            <div className="card-body">
                                <table width="100%" border="0" cellSpacing="0" className="print-data printInvoice" style={{display:'block',fontSize:'12px',opacity:'1',animation:' fadeIn 2s'}}>
                                    <tr style={{margin:'0',padding:'20px'}}>
                                        <td style={{margin:'0'}} width="10%">
                                            <img className="img-logo" src="https://indokids.co.id/assets/images/site/Logo_Indokids_Baru-011.png" style={{verticalAlign:'center',width:'100%'}}/>
                                        </td>
                                        <td width={'1%'}/>
                                        <td colSpan="3" style={{margin:'0',verticalAlign:'center'}}>
                                            <h3 style={{padding:'0',margin:'0.5em 0 0'}}>PT NETINDO MEDIATAMA PERKASA</h3>
                                            <p>www.ptnetindo.com</p>
                                        </td>
                                        <td colSpan="2" style={{margin:'0',verticalAlign:'top'}}>
                                            <h5 style={{padding:'0',margin:'0.5em 0'}}>
                                                <strong>Tanggal:</strong>
                                                <span style={{clear:'both',display:'block',fontWeight:'normal'}}>2020</span>
                                            </h5>
                                            <h5 style={{padding:'0',margin:'0.5em 0'}}>
                                                <strong>Nomor Invoice:</strong>
                                                <span  style={{clear:'both',display:'block',fontWeight:'normal'}}>0XXXXXXXXXXXXX</span>
                                            </h5>
                                        </td>
                                    </tr>
                                    <tr style={{margin:'0',padding:'20px'}}>
                                        <td colSpan="4">
                                            <p style={{lineHeight:'1em',margin:'0',padding:'20px 0 0'}}>
                                                <strong>
                                                    Kepada : &nbsp;
                                                    <span style={{textTransform:'capitalize'}}>Annashrul Yusuf</span>
                                                </strong>
                                            </p>
                                            <p style={{fontSize:'12px',lineHeight:'2em'}}>Terima kasih telah berbelanja di www.ptnetindo.com. Berikut adalah rincian orderan Anda:</p>
                                        </td>
                                        <td colSpan="2" style={{fontSize:'0.85rem'}}>
                                        </td>
                                    </tr>
                                    <tr style={{margin:'0',background:'#555',lineHeight:'1em',fontSize:'12px',color:'#fff'}}>
                                        <td colSpan="2" style={{padding:'10px 20px',width:'45%'}}>Nama Produk</td>
                                        <td style={{padding:'10px 20px',width:'10%'}}>Jumlah</td>
                                        <td style={{padding:'10px 20px',width:'15%'}}>Berat</td>
                                        <td style={{padding:'10px 20px',width:'15%'}}>Harga</td>
                                        <td style={{padding:'10px 20px',width:'15%'}}>Subtotal</td>
                                    </tr>
                                    <tr style={{border:'1px solid #ddd',lineHeight:'1.25em',fontSize:'12px',verticalAlign:'middle'}}>
                                        <td colSpan="2" style={{padding:'10px 20px',width:'45%'}}>
                                            NAMA PRODUK <span className="sku-inv" style={{float:'right',display:'block'}}>KODE BARANG</span>
                                        </td>
                                        <td style={{padding:'10px 20px',width:'10%'}}>1 ITEM</td>
                                        <td style={{padding:'10px 20px',width:'15%'}}>10 Kg</td>
                                        <td style={{padding:'10px 20px',width:'15%'}}>Rp 1000</td>
                                        <td style={{padding:'10px 20px',width:'15%'}}>Rp 1000</td>
                                    </tr>

                                    <tr style={{lineHeight:'1.25em',fontSize:'12px',verticalAlign:'middle'}}>
                                        <td colSpan="5" style={{padding:'10px 20px',width:'45%'}}>Kode unik</td>
                                        <td style={{padding:'10px 20px',width:'10%'}}>Rp 1000</td>
                                    </tr>
                                    <tr style={{lineHeight:'2em',fontSize:'12px'}}>
                                        <td style={{padding:'10px 20px',width:'45%'}} colSpan="5"><span style={{fontWeight:'700',fontSize:'1rem'}}>TOTAL</span></td>
                                        <td style={{padding:'10px 20px',width:'15%'}}><span style={{fontWeight:'700',fontSize:'1rem'}}>Rp 10000</span></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="6">
                                            <hr style={{borderColor:'#ddd',borderStyle:'dotted'}}/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{verticalAlign:'top',margin:'0',padding:'10px 0'}}>
                                            <p style={{lineHeight:'1em',margin:'0',padding:'0 0 0 20px',fontSize:'12px'}}>Alamat Pengiriman:</p>
                                        </td>
                                        <td colSpan="5">
                                            <p style={{fontSize:'12px',lineHeight:'1.25em',margin:'0',padding:'10px 0'}}>
                                                jln kebon manggu rt 02/04 kelurahan padasuka <br/>
                                                Kec. Cimahi Tengah,  Kota Cimahi, 40256 <br/>
                                                Provinsi Jawa Barat <br/>
                                                Telp: 081223165037
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    ):(
                        <div className="card" style={{border:'1px dashed black',opacity:'1',animation:' fadeIn 2s'}} >
                            <div className="card-body">
                            <table width="100%" border="0" cellSpacing="0" className="print-data" id={'printable'}>
                                <tr>
                                    <td width="20%" rowSpan="3" className="text-center shop-logo" style={{padding:'10px'}}>
                                        {
                                            this.state.shop_logo?(
                                                <img style={{opacity:'1',animation:' fadeIn 2s'}} className="img-logo" src={'https://indokids.co.id/assets/images/site/Logo_Indokids_Baru-011.png'} width="120"/>
                                            ):null
                                        }
                                        <div className="shop-info" style={this.state.shop_info?{opacity:'1',animation:' fadeIn 2s'}:{animation:' fadeIn 1s',display:'none',transition:' opacity 1s easeOut',opacity:'0'}}>
                                            <h5>PT NETINDO MEDIATAMA PERKASA</h5>
                                            <p>www.ptnetindo.com</p>
                                        </div>
                                    </td>
                                    <td className="plabel">Kepada:</td>
                                    <td className="plabel orderdetail">
                                        <span>ORDER</span> &nbsp;
                                        {
                                            this.state.no_order?(<span style={{opacity:'1',animation:' fadeIn 2s'}}>- KODE INVOICE&nbsp;</span>):null
                                        }
                                        {
                                            this.state.tanggal_order?(<span style={{opacity:'1',animation:' fadeIn 2s'}}>- 01 Januari 2021</span>):null
                                        }
                                    </td>
                                    {
                                        this.state.fragile_sign?(
                                            <td className="fragile" width="30%" rowSpan="4" style={{borderLeft:'1px dashed #ddd',opacity:'1',animation:' fadeIn 2s'}}>
                                                <img className="img-fragile" src={'https://indokids.co.id/assets/images/site/fragile.png '} alt=""/>
                                                <h2>FRAGILE</h2>
                                                <p>JANGAN DIBANTING!!!</p>
                                            </td>
                                        ):null
                                    }
                                </tr>
                                <tr>
                                    <td width="40%" valign="top">
                                        <p style={lnr} className="receiver-name ls-1"> Annashrul Yusuf</p>
                                        <p style={lnr} className="address">
                                            Alamat: <br/>
                                            jln kebon manggu rt 02/04 kelurahan padasuka <br/>
                                            Kec. Cimahi Tengah,  Kota Cimahi, 40256 <br/>
                                            Provinsi Jawa Barat <br/>
                                            Telp: 081223165037
                                        </p>
                                    </td>
                                    <td style={{fontSize:'12px'}} width="30%" valign="top" className="orderdetail">
                                        <ul className="product-list" style={{margin:'0', padding:'0'}}>
                                            <li style={{lineHeight:'1.4em'}}>
                                                <span className="left" style={{color:'grey',float:'left',width:'70%'}}>NAMA BARANG </span>
                                                <span className="right" style={{color:'red',float:'right',width:'30%'}}>1 Item</span>
                                            </li>
                                        </ul>

                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p className="plabel">Pengirim: <br/>PT NETINDO MEDIATAMA PERKASA <br/> 081223165037</p>
                                    </td>
                                    {
                                        this.state.expedisi?(
                                            <td style={{opacity:'1',animation:' fadeIn 2s'}}>
                                                <span style={expedisi} className="expedisi">JNE - EZ ( 100 gram )</span>
                                            </td>
                                        ):null
                                    }
                                </tr>
                            </table>

                        </div>
                        </div>
                    )
                }
            </Layout>
        );
    }
}



export default PagePrintPenjualan;