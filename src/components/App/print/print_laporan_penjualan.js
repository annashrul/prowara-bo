import React,{Component} from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {noImage, toCurrency} from "../../../helper";
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import './print.css'
import {getLaporanPenjualan} from "../../../redux/actions/laporan/laporan_penjualan.action";
import moment from 'moment';
import Preloader from "../../../Preloader";

class PrintLaporanPenjualan extends Component {
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
        this.goBack = this.goBack.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    componentWillMount(){
        document.title = `Print Laporan Penjualan`;
        this.props.dispatch(getLaporanPenjualan(`invoice=${localStorage.kode_trx_penjualan}&perpage=${parseInt(localStorage.length_kode_trx_penjualan)}`));
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps);
    }

    goBack() {
        this.props.history.goBack();
        setTimeout(function() {
            window.location.reload();
        }, 500);
    }

    print(){
        document.getElementById("non-printable").style.display = "none";
        window.print()
        document.getElementById("non-printable").style.display = "block";
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
        let grandTotal=0;
        return(
            <div>
                <PrintProvider>
                    <NoPrint>
                        <div id="non-printable">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-2">
                                            <Link to='/produk'>
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
                                            <button className="btn btn-primary" onClick={()=>{this.print()}}><svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} fill="#fff" viewBox="0 0 485.212 485.212"><path d="M151.636 363.906h151.618v30.33H151.636zm-30.324-333.58h242.595v60.65h30.32v-60.65C394.23 13.596 380.667 0 363.907 0H121.313c-16.748 0-30.327 13.595-30.327 30.327v60.65h30.327v-60.65zm30.324 272.93h181.94v30.328h-181.94z" /><path d="M454.882 121.304H30.334c-16.748 0-30.327 13.59-30.327 30.324v181.956c0 16.76 13.58 30.32 30.327 30.32h60.65v90.98c0 16.765 13.58 30.327 30.328 30.327h242.595c16.76 0 30.32-13.56 30.32-30.323v-90.98h60.654c16.76 0 30.325-13.562 30.325-30.32v-181.96c0-16.732-13.56-30.323-30.32-30.323zm-90.975 333.582H121.312V272.93h242.595v181.956zm60.644-242.604c-16.76 0-30.32-13.564-30.32-30.327 0-16.73 13.56-30.327 30.32-30.327 16.768 0 30.334 13.595 30.334 30.327 0 16.762-13.567 30.327-30.33 30.327z" /></svg> Print</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <Print single name="printable" id="printable">
                            {
                                !this.props.isLoading?typeof this.props.data.data==='object'?this.props.data.data.length>0?
                                    this.state.cetak==='invoice'?(
                                        <div id="print_3ply">
                                            {
                                                this.props.data.data.map((v,i)=>{
                                                    return(
                                                        <div key={i} className={`card ${i % 2 === 0?'pagebreak':''}`} style={{marginBottom:'5px',border:'1px dashed black',animation:' fadeIn 2s'}} >
                                                            <div className="card-body">
                                                                <table id="print_3ply" width="100%" border="0" cellSpacing="0" className="print-data printInvoice" style={{display:'block',fontSize:'12px',opacity:'1',animation:' fadeIn 2s'}}>
                                                                    <tr style={{margin:'0',padding:'20px'}}>
                                                                        <td style={{margin:'0'}} width="10%">
                                                                            <img style={{opacity:'1',animation:' fadeIn 2s',height:'120px',verticalAlign:'center',width:'70%'}} className="img-responsive" src={this.props.data.data_perusahaan===undefined?'':this.props.data.data_perusahaan.logo} onError={(e)=>{e.target.onerror = null; e.target.src=`${noImage()}`}}/>

                                                                            {/*<img className="img-logo" src="https://indokids.co.id/assets/images/site/Logo_Indokids_Baru-011.png" style={{verticalAlign:'center',width:'100%'}}/>*/}
                                                                        </td>
                                                                        <td width={'1%'}/>
                                                                        <td colSpan="3" style={{margin:'0',verticalAlign:'center'}}>
                                                                            <h3 style={{padding:'0',margin:'0.5em 0 0'}}>{this.props.data.data_perusahaan===undefined?'':this.props.data.data_perusahaan.title}</h3>
                                                                            <p>{this.props.data.data_perusahaan===undefined?'':this.props.data.data_perusahaan.website}</p>
                                                                        </td>
                                                                        <td colSpan="2" style={{margin:'0',verticalAlign:'top'}}>
                                                                            <h5 style={{padding:'0',margin:'0.5em 0'}}>
                                                                                <strong>Tanggal:</strong>
                                                                                <span style={{clear:'both',display:'block',fontWeight:'normal'}}>{moment(v.created_at).format('ll')}</span>
                                                                            </h5>
                                                                            <h5 style={{padding:'0',margin:'0.5em 0'}}>
                                                                                <strong>Nomor Invoice:</strong>
                                                                                <span  style={{clear:'both',display:'block',fontWeight:'normal'}}>{v.kd_trx}</span>
                                                                            </h5>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style={{margin:'0',padding:'20px'}}>
                                                                        <td colSpan="4">
                                                                            <p style={{lineHeight:'1em',margin:'0',padding:'20px 0 0'}}>
                                                                                <strong>
                                                                                    Kepada : &nbsp;
                                                                                    <span style={{textTransform:'capitalize'}}>{v.penerima}</span>
                                                                                </strong>
                                                                            </p>
                                                                            <p style={{fontSize:'12px',lineHeight:'2em'}}>Terima kasih telah berbelanja di {this.props.data.data_perusahaan===undefined?'':this.props.data.data_perusahaan.website}. Berikut adalah rincian orderan Anda:</p>
                                                                        </td>
                                                                        <td colSpan="2" style={{fontSize:'0.85rem'}}>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style={{margin:'0',border:'1px solid #ddd',lineHeight:'1em',fontSize:'12px',color:'black'}}>
                                                                        <td colSpan="2" style={{padding:'10px 20px',width:'50%'}}>Kode Transaksi</td>
                                                                        <td colSpan="2" style={{padding:'10px 20px',width:'35%'}}>Barang</td>
                                                                        <td style={{padding:'10px 20px',width:'5%'}}>Jumlah</td>
                                                                        <td style={{padding:'10px 20px',width:'10%'}}>Harga</td>
                                                                        <td style={{padding:'10px 20px',width:'5%'}}>Subtotal</td>
                                                                    </tr>
                                                                    {
                                                                        v.detail.map((val,key)=>{
                                                                            grandTotal=grandTotal+(parseInt(val.price)*parseInt(val.qty));
                                                                            return(
                                                                                <tr style={{border:'1px solid #ddd',lineHeight:'1.25em',fontSize:'12px',verticalAlign:'middle'}}>
                                                                                    <td colSpan="2" style={{padding:'10px 20px',width:'50%'}}>{val.kd_trx}</td>
                                                                                    <td colSpan="2" style={{padding:'10px 20px',width:'35%'}}>{val.paket}</td>
                                                                                    <td style={{padding:'10px 20px',width:'5%'}}>{val.qty} ITEM</td>
                                                                                    <td style={{padding:'10px 20px',width:'10%'}}>Rp {toCurrency(val.price)} .-</td>
                                                                                    <td style={{padding:'10px 20px',width:'5%',textAlign:'left'}}>Rp {toCurrency(parseInt(val.price)*parseInt(val.qty))} .-</td>
                                                                                </tr>
                                                                            );
                                                                        })
                                                                    }

                                                                    <tr style={{border:'1px solid #ddd',lineHeight:'1.25em',fontSize:'12px',verticalAlign:'middle'}}>
                                                                        <td colSpan="6" style={{padding:'10px 20px',width:'45%'}}>Ongkir</td>
                                                                        <td style={{padding:'10px 20px',width:'10%',textAlign:'left'}}>Rp {parseInt(v.ongkir)===0?0:toCurrency(v.ongkir)} .-</td>
                                                                    </tr>
                                                                    <tr style={{lineHeight:'2em',fontSize:'12px'}}>
                                                                        <td style={{padding:'10px 20px',width:'45%'}} colSpan="6"><span style={{fontWeight:'700',fontSize:'1rem'}}>TOTAL</span></td>
                                                                        <td style={{padding:'10px 20px',width:'15%',textAlign:'left'}}><span style={{fontWeight:'700',fontSize:'1rem'}}>Rp {toCurrency(v.grand_total)} .-</span></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan="7">
                                                                            <hr style={{borderColor:'#ddd',borderStyle:'dotted'}}/>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{verticalAlign:'top',margin:'0',padding:'10px 0'}}>
                                                                            <p style={{lineHeight:'1em',margin:'0',padding:'0 0 0 20px',fontSize:'12px'}}>Alamat Pengiriman:</p>
                                                                        </td>
                                                                        <td colSpan="5">
                                                                            <p style={{fontSize:'12px',lineHeight:'1.25em',margin:'0',padding:'10px 0'}}>
                                                                                {v.main_address}<br/>
                                                                                Telp: {v.no_hp}
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    ):(

                                        <div id="print_3ply">
                                            {
                                                this.props.data.data.map((v,i)=>{
                                                    return(
                                                        <div key={i} className={`card ${i % 4 === 0?'pagebreak':''}`} style={{marginBottom:'5px',border:'1px dashed black',animation:' fadeIn 2s'}} >
                                                            <div key={i} className="card-body">
                                                                <table width="100%" border="0" cellSpacing="0" className="print-data" id={'printable'}>
                                                                    <tr>
                                                                        <td width="15%" rowSpan="3" className="text-center shop-logo" style={{padding:'10px'}}>
                                                                            {
                                                                                this.state.shop_logo?(
                                                                                    <img style={{opacity:'1',animation:' fadeIn 2s',height:'60px'}} className="img-responsive" src={this.props.data.data_perusahaan===undefined?'':this.props.data.data_perusahaan.logo} onError={(e)=>{e.target.onerror = null; e.target.src=`${noImage()}`}}/>
                                                                                ):null
                                                                            }
                                                                            <br/>
                                                                            <br/>
                                                                            <div className="shop-info" style={this.state.shop_info?{opacity:'1',animation:' fadeIn 2s'}:{animation:' fadeIn 1s',display:'none',transition:' opacity 1s easeOut',opacity:'0'}}>
                                                                                <span>{this.props.data.data_perusahaan===undefined?'':this.props.data.data_perusahaan.title}</span><br/>
                                                                                <span>{this.props.data.data_perusahaan===undefined?'':this.props.data.data_perusahaan.website}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td>Kepada:</td>
                                                                        <td>
                                                                            <span>ORDER</span> &nbsp;
                                                                            {
                                                                                this.state.no_order?(<span style={{opacity:'1',animation:' fadeIn 2s'}}>- {v.kd_trx}&nbsp;</span>):null
                                                                            }
                                                                            {
                                                                                this.state.tanggal_order?(<span style={{opacity:'1',animation:' fadeIn 2s'}}>- {moment(v.created_at).format('ll')}</span>):null
                                                                            }
                                                                        </td>
                                                                        {
                                                                            this.state.fragile_sign?(
                                                                                <td className="fragile" width="30%" rowSpan="4" style={{verticalAlign:'middle',borderLeft:'1px dashed #ddd',opacity:'1',animation:' fadeIn 2s'}}>
                                                                                    <center>
                                                                                        <img className="img-fragile" src={'https://indokids.co.id/assets/images/site/fragile.png '} alt=""/>
                                                                                        <br/>
                                                                                        <span>JANGAN DIBANTING!!!</span>
                                                                                    </center>
                                                                                </td>
                                                                            ):null
                                                                        }
                                                                    </tr>
                                                                    <tr>
                                                                        <td width="40%" valign="top">
                                                                            <p style={lnr} className="receiver-name ls-1"> {v.penerima}</p>
                                                                            <p style={lnr} className="address">
                                                                                Alamat: <br/>
                                                                                <span style={{fontSize:"10px"}}>{v.main_address}</span><br/>
                                                                                Telp: {v.no_hp}
                                                                            </p>
                                                                        </td>
                                                                        <td width="30%" valign="top" className="orderdetail">
                                                                            <ol className="product-list" style={{margin:'0', padding:'0'}}>
                                                                                {
                                                                                    v.detail.length>0?v.detail.map((val,key)=>{
                                                                                        return(
                                                                                            <li key={key} style={{lineHeight:'1.4em'}}>
                                                                                                <span className="left" style={{color:'grey',float:'left',width:'70%'}}>{key+1}. {val.paket}</span>
                                                                                                <span className="right" style={{color:'red',float:'right',width:'30%'}}>{val.qty}</span>
                                                                                            </li>
                                                                                        );
                                                                                    }):""
                                                                                }

                                                                            </ol>

                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <p className="plabel">Pengirim: <br/>{this.props.data.data_perusahaan===undefined?'':this.props.data.data_perusahaan.title} <br/> {this.props.data.data_perusahaan===undefined?'':this.props.data.data_perusahaan.telp}</p>
                                                                        </td>
                                                                        {
                                                                            this.state.expedisi?(
                                                                                <td style={{opacity:'1',animation:' fadeIn 2s'}}>
                                                                                    <span style={expedisi} className="expedisi">{v.layanan_pengiriman.replace('|',' | ')}</span>
                                                                                </td>
                                                                            ):null
                                                                        }
                                                                    </tr>
                                                                </table>

                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>

                                    )
                                :"":"":<Preloader/>
                            }


                        </Print>
                    </NoPrint>
                </PrintProvider>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.laporanPenjualanReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.laporanPenjualanReducer.data,
    }
}


export default connect(mapStateToProps)(PrintLaporanPenjualan);