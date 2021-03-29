import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import {deleteBarangRedeem, fetchBarangRedeem} from "../../../redux/actions/paket/barang_redeem.action";
import Skeleton from 'react-loading-skeleton';
import {NOTIF_ALERT} from "../../../redux/actions/_constants";
import Paginationq,{toCurrency} from "../../../helper";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import FormBarangRedeem from "../modals/barang_redeem/form_barang_redeem"
import * as Swal from "sweetalert2";
import Select from 'react-select';

class IndexBarangRedeem extends Component{
    constructor(props){
        super(props);
        this.state={
            any:'',
            detail:{},
            status:'',

        };
        this.handleChange   = this.handleChange.bind(this);
        this.handleModal      = this.handleModal.bind(this);
        this.handleDelete      = this.handleDelete.bind(this);
        this.handleSearch      = this.handleSearch.bind(this);
        this.handlePage      = this.handlePage.bind(this);
    }
    handlePage(num){
        let where = this.handleValidate();
        where+=`&page=${num}`;
        this.props.dispatch(fetchBarangRedeem(where));
    }
    handleValidate(){
        this.setState({
            isLoading:true
        });
        let where=`perpage=9`;
        let any = this.state.any;
        if(any!==null&&any!==undefined&&any!==""){
            where+=`&q=${any}`;
        }
        return where;

    }
    componentWillMount(){
        let where = this.handleValidate();
        this.props.dispatch(fetchBarangRedeem(where));
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    handleModal(e,i){
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formBarangRedeem"));
        if(i!==''){
            this.setState({detail:{
                id:this.props.data.data[i].id,
                title:this.props.data.data[i].title,
                harga:this.props.data.data[i].harga,
                berat:this.props.data.data[i].berat,
                stock:this.props.data.data[i].stock,
                deskripsi:this.props.data.data[i].deskripsi,
                gambar:this.props.data.data[i].gambar,

            }});
        }else{
            this.setState({detail:{id:''}});

        }
    }
    handleDelete(e,id){
        e.preventDefault();
        Swal.fire({
            title: 'Perhatian !!!',
            html:`anda yakin akan menghapus data ini ??`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Oke, Hapus`,
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(deleteBarangRedeem(id));

            }
        })
    }
    handleSearch(e){
        e.preventDefault();
        let where = this.handleValidate();
        this.props.dispatch(fetchBarangRedeem(where));
    }

    render(){
        const {
            total,
            per_page,
            offset,
            to,
            last_page,
            current_page,
            from,
            data
        } = this.props.data;
        // console.log(data);
        return(
            <Layout page={"Barang Redeem"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Barang Redeem</h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="card">
                            <div className="card-body">
                                <div className="row" style={{zoom:"90%"}}>
                                    <div className="col-12 col-xs-12 col-md-3">
                                        <div className="form-group">
                                            <label>Cari</label>
                                            <input type="text" className="form-control" name="any" placeholder={"cari disini"} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                        </div>
                                    </div>

                                    <div className="col-2 col-xs-2 col-md-4">
                                        <div className="form-group">
                                            <button style={{marginTop:"27px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                            <button style={{marginTop:"27px",marginLeft:"5px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleModal(e,'')}><i className="fa fa-plus"/></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <main>
                            {
                                !this.props.isLoading?typeof data==='object'?data.length>0?data.map((v,i)=>{
                                        return(
                                            <article key={i}>
                                                <div className="box-margin">
                                                    <div className="coupon" style={{
                                                        borderRadius:"15px",
                                                        margin:"0 auto",
                                                        breakInside: 'avoid-column'
                                                    }}>
                                                        <div className="ribbon-wrapper card">
                                                            <div className="ribbon ribbon-bookmark ribbon-success">{v.title}</div>
                                                            <img src={v.gambar} alt="Avatar" style={{width:'100%'}}/>
                                                            <br/>
                                                            <h5 className={"text-center"} style={{border:'2px dashed rgb(250, 89, 29)',padding:"10px"}}><b className="txtRed bold">{toCurrency(v.harga)} POIN</b></h5>
                                                            <p>stock barang <b className={'txtRed bold'}>{toCurrency(v.stock)}</b></p>
                                                            <p>berat barang <b className={'txtRed bold'}>{toCurrency(v.berat)}</b></p>
                                                            <p>{v.deskripsi}</p>
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <button className={"btn-block btn btn-primary"} onClick={(e)=>this.handleModal(e,i)}>Ubah</button>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <button className={"btn-block btn btn-danger"} onClick={(e)=>this.handleDelete(e,v.id)}>Hapus</button>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    }):<img src={NOTIF_ALERT.NO_DATA} alt=""/>:<img className={"text-center"} src={NOTIF_ALERT.NO_DATA} alt=""/>:
                                    (()=>{
                                        let container =[];
                                        for(let x=0; x<8; x++){
                                            container.push(
                                                <article key={x}>
                                                    <div className="box-margin">
                                                        <div className="coupon" style={{
                                                            borderRadius:"15px",
                                                            margin:"0 auto",
                                                        }}>
                                                            <Skeleton width={'100%'} height={(x*10)+200}/>
                                                            <Skeleton/>
                                                            <Skeleton/>
                                                            <Skeleton/>
                                                        </div>
                                                    </div>
                                                </article>
                                            )
                                        }
                                        return container;
                                    })()
                            }
                        </main>
                        <div style={{"marginTop":"20px","marginBottom":"20px","float":"right"}}>
                            <Paginationq
                                current_page={current_page}
                                per_page={per_page}
                                total={total}
                                callback={this.handlePage}
                            />
                        </div>
                    </div>
                </div>
                {
                    this.props.isOpen===true?<FormBarangRedeem
                        detail={this.state.detail}
                    />:null
                }
            </Layout>
        );

    }
}
const mapStateToProps = (state) => {
    return {
        isOpen:state.modalReducer,
        isLoading: state.barangRedeemReducer.isLoading,
        data:state.barangRedeemReducer.data,
    }
}


export default connect(mapStateToProps)(IndexBarangRedeem);