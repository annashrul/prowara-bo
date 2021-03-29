import React, {Component} from 'react'
import { connect } from 'react-redux'
import WrapperModal from '../_wrapper.modal'
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import {ModalToggle} from "../../../../redux/actions/modal.action";
import {rmComma, ToastQ, toCurrency} from "../../../../helper";
import {postBarang} from "../../../../redux/actions/paket/barang.action";


class FormAdjusment extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state={
            id_barang:"",
            keterangan:"",
            qty:"0",
            stock_terakhir:"0",
            stock_sebelum:"0",
            jenis:"1",
        }
    }

    clearState(){
        this.setState({
            id_barang:"",
            keterangan:"",
            qty:"0",
            stock_terakhir:"0",
            stock_sebelum:"0",
            jenis:"1",
        })
    }

    getProps(props){
        this.setState({
            id_barang:props.detail.id,
            keterangan:"",
            qty:"0",
            stock_terakhir:parseInt(props.detail.stock,10)+parseInt(this.state.qty,10),
            stock_sebelum:props.detail.stock,
            jenis:"1",
        })
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }

    setValStock(param,qty){
        const {stock_sebelum}=this.state;
        let stockSebelum=parseInt(rmComma(stock_sebelum),10);
        let qtySeudah=parseInt(rmComma(qty),10);
        return param==='1'?stockSebelum+qtySeudah:stockSebelum-qtySeudah;
    }

    handleChange = (event) => {
        let col=event.target.name;
        let val=event.target.value;
        let stock;
        const {qty,jenis,stock_sebelum}=this.state;
        if(col==='jenis')this.setState({stock_terakhir:this.setValStock(val,qty)});
        if(col==='qty'){
            stock=val===''||val==='0'?rmComma(stock_sebelum):this.setValStock(jenis,val);
            this.setState({stock_terakhir:stock});
        }
        this.setState({[col]: val});
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));

    };
    handleSubmit(e){
        e.preventDefault();
        let parseData = {};
        const {qty,keterangan,stock_terakhir,jenis}=this.state;
        if(qty===''||qty==='0'){
            ToastQ.fire({icon:'error',title:`qty tidak boleh kosong`});
            return;
        }
        if(keterangan===''){
            ToastQ.fire({icon:'error',title:`keterangan tidak boleh kosong`});
            return;
        }
        parseData['keterangan'] = keterangan;
        parseData['detail'] = [{
            "id_barang":this.props.detail.id,
            "qty":rmComma(qty),
            "stock_terakhir":rmComma(stock_terakhir),
            "jenis":jenis==='1'?'tambah':'kurang'
        }];
        this.props.dispatch(postBarang(parseData,'/adjustment'));
        if(this.props.isError===true){
            this.clearState();
        }

    }
    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formAdjusment"} size="md">
                <ModalHeader toggle={this.toggle}>Form Adjusment</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">

                            <div className="form-group">
                                <label>Qty</label>
                                <input type="text" className={"form-control"} name={"qty"} value={toCurrency(this.state.qty)} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Stock Sebelum</label>
                                <input readOnly={true} type="text" className={"form-control"} name={"stock_sebelum"} value={toCurrency(this.state.stock_sebelum)} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Jenis</label>
                                <select name="jenis" className="form-control" defaultValue={this.state.jenis} onChange={this.handleChange}>
                                    <option value="1">Tambah</option>
                                    <option value="0">Kurang</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Stock Sesudah</label>
                                <input readOnly={true} type="text" className={"form-control"} name={"stock_terakhir"} value={toCurrency(this.state.stock_terakhir)} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Keterangan</label>
                                <input type="text" className={"form-control"} name={"keterangan"} value={this.state.keterangan} onChange={this.handleChange}/>
                            </div>
                        </div>

                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="form-group" style={{textAlign:"right"}}>
                        <button style={{color:"white"}} type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle} ><i className="ti-close"/>Keluar</button>
                        <button type="submit" className="btn btn-primary mb-2 mr-2" onClick={this.handleSubmit} ><i className="ti-save" />{!this.props.isLoadingPost?'Simpan':'Loading ......'}</button>
                    </div>
                </ModalFooter>
            </WrapperModal>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        isLoadingPost: state.barangReducer.isLoadingPost,
        isError: state.barangReducer.isError,
    }
}
export default connect(mapStateToProps)(FormAdjusment);