import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import Paginationq, {noImage, rangeDate, statusQ, toCurrency, toRp} from "helper";
import {NOTIF_ALERT} from "redux/actions/_constants";
import FormVoucher from "../../modals/masterdata/voucher/form_voucher"
import {fetchKategori, fetchProduk,fetchOperator} from "redux/actions/setting/ppob.action";
import * as Swal from "sweetalert2";
import Select from 'react-select';
import {putPPOB} from "../../../../redux/actions/setting/ppob.action";

class PPOB extends Component{
    constructor(props){
        super(props);
        this.state={
            any:'',
            data_kategori:[],
            kategori:'',
            data_operator:[],
            operator:'',
            status:'',
            data_produk:[]

        };
        this.handleChange   = this.handleChange.bind(this);
        this.handlePage     = this.handlePage.bind(this);
        this.handleChangeKategori = this.handleChangeKategori.bind(this);
        this.handleChangeOperator = this.handleChangeOperator.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.produk !== undefined && props.produk.length !== 0) {
            if (props.produk !== state.prevprodukProps) {
                let datum = []
                props.produk.data.map(i => {
                    datum.push(i);
                })
                return {
                    prevprodukProps: props.produk,
                    data_produk: datum
                };
            }
        }
        if (props.kategori !== undefined && props.kategori.length !== 0) {
            if (props.kategori !== state.prevkategoriProps) {
                const datum=[]
                for (var key of Object.keys(props.kategori)) {
                    props.kategori[key].map(i=>{
                        datum.push({
                            label: i.title,
                            value: i.code,
                        })
                    })
                }
                return {
                    prevkategoriProps: props.kategori,
                    data_kategori: datum
                };
            }
        }
        if (props.operator !== undefined && props.operator.length !== 0) {
            if (props.operator !== state.prevoperatorProps) {
                const datum = []
                props.operator.data.map(i => {
                    datum.push({
                        label: i.title,
                        value: i.op_id,
                    })
                })
                return {
                    prevoperatorProps: props.operator,
                    data_operator: datum
                };
            }
        }
        return null;
    }

    handlePage(num){
        let where = this.handleValidate();
        where+=`&page=${num}`;
        this.props.dispatch(fetchProduk(where));
    }
    handleValidate(){
        this.setState({
            isLoading:true
        });
        let where = `perpage=20&kategori=${this.state.kategori}`;
        
        return where;

    }
    componentDidMount(){
        this.props.dispatch(fetchKategori());

    }
    
    handleChange = (event,i) => {
        this.state.data_produk[i].margin=event.target.value;
        this.setState({[event.target.name]: event.target.value});
    }
    handleChangeKategori(val) {
        this.props.dispatch(fetchProduk(`kategori=${val.value}`))
        this.setState({
            kategori: val.value,
            operator:''
        });
    }
    handleChangeOperator(val) {
        this.props.dispatch(fetchProduk(`operator=${val.value}`))
        this.setState({
            operator: val.value
        });
    }

    handleSubmit(e,id,data={}){
        e.preventDefault();
        let where=`kategori=${this.state.kategori}`;
        this.props.dispatch(putPPOB(id,data,where));
    }

    render(){
        const {
            total,
            per_page,
            current_page
        } = this.props.produk;
        return(
            <Layout page={"Setting Margin PPOB"}>
                <div className="row align-items-center">
                    <div className="col-12">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Setting Margin PPOB</h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row" style={{zoom:"90%"}}>
                                    <div className="col-12 col-xs-12 col-md-3">
                                        <div className='form-group'>
                                                <label>Kategori</label>
                                                <Select
                                                    options={this.state.data_kategori}
                                                    placeholder="Pilih Kategori"
                                                    onChange={this.handleChangeKategori}
                                                    value={
                                                        this.state.data_kategori.find(op => {
                                                            return op.value === this.state.kategori
                                                        })
                                                    }

                                                />
                                        </div>
                                        {
                                            this.state.data_operator.length>0?(
                                                <div className='form-group'>
                                                    <label>Layanan</label>
                                                    <Select
                                                        options={this.state.data_operator}
                                                        placeholder="Pilih Layanan"
                                                        onChange={this.handleChangeOperator}
                                                        value={
                                                            this.state.data_operator.find(op => {
                                                                return op.value === this.state.operator
                                                            })
                                                        }

                                                    />
                                            </div>
                                            ):''
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Provider</th>
                                                        <th>Produk</th>
                                                        <th>HPP</th>
                                                        <th>Margin <small className={"txtRed bold text-right"} style={{float:"right"}}>( tekan enter untuk ubah data )</small></th>
                                                        <th>Status</th>
                                                        <th>Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.props.produk.data!==undefined && this.state.data_produk.length>0?
                                                            this.state.data_produk.map((v,i)=>{
                                                                return (
                                                                    <tr key={i}>
                                                                        <td>{i+1 + (10 * (parseInt(current_page,10)-1))}</td>
                                                                        <td>{v.provider}</td>
                                                                        <td>{v.note}</td>
                                                                        <td>{toCurrency(v.raw_price)}</td>
                                                                        <td><input type="number" className="form-control" name={'margin'} value={v.margin} onChange={(e)=>this.handleChange(e,i)} onKeyPress={
                                                                            event => {
                                                                                if (event.key === 'Enter') {
                                                                                    this.handleSubmit(event,v.id,{'margin':v.margin});
                                                                                }
                                                                            }
                                                                        }
                                                                        /></td>
                                                                        <td>{v.status===0?<span className="badge badge-danger">Tidak Aktif</span>:<span className="badge badge-success">Aktif</span>}</td>
                                                                        <td>
                                                                            {
                                                                                v.status===1?
                                                                                <button onClick={(e)=>this.handleSubmit(e,v.id,{'status':0})} className="btn btn-danger btn-sm"><i className="fa fa-remove"/> Non-aktifkan</button>
                                                                                :
                                                                                <button onClick={(e)=>this.handleSubmit(e,v.id,{'status':1})} className="btn btn-success btn-sm"><i className="fa fa-check"/> Aktifkan</button>
                                                                            }
                                                                            </td>
                                                                    </tr>

                                                                )})
                                                            :<tr>
                                                            <td colSpan={7}>No Data.</td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
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
            </Layout>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        isLoading: state.ppobReducer.isLoading,
        isOpen:state.modalReducer,
        kategori:state.ppobReducer.kategori,
        operator:state.ppobReducer.operator,
        produk:state.ppobReducer.produk,
    }
}


export default connect(mapStateToProps)(PPOB);