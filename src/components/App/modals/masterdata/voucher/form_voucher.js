import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import {ModalToggle} from "../../../../../redux/actions/modal.action";
import {ToastQ} from "../../../../../helper";
import {postVoucher, putVoucher} from "../../../../../redux/actions/masterdata/voucher.action";
import moment from "moment";

class FormVoucher extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state={
            title:'',
            periode_start:'',
            periode_end:'',
            disc:'0',
            status:'1',
            max_uses:"0",
            max_uses_user:"0",
            deskripsi:"",
        }

    }

    clearState(){
        this.setState({
            title:'',
            periode_start:'',
            periode_end:'',
            disc:'',
            status:'1',
            max_uses:"0",
            max_uses_user:"0",
            deskripsi:"",
        })
    }

    getProps(props){
        if(props.detail.id!==''){
            let detail=props.detail;
            console.log(moment(detail.periode_start).format('yyyy-MM-DD'));
            this.setState({
                title:detail.title,
                periode_start:moment(detail.periode_start).format('yyyy-MM-DD'),
                periode_end:moment(detail.periode_end).format('yyyy-MM-DD'),
                disc:detail.disc,
                status:detail.status,
                max_uses:detail.max_uses,
                max_uses_user:detail.max_uses_user,
                deskripsi:detail.deskripsi,
            })
        }
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }


    handleSubmit(e){
        e.preventDefault();
        let parseData   = {};
        parseData['title']          = this.state.title;
        parseData['periode_start']  = this.state.periode_start;
        parseData['periode_end']    = this.state.periode_end;
        parseData['disc']           = this.state.disc;
        parseData['status']         = this.state.status;
        parseData['max_uses']       = this.state.max_uses;
        parseData['max_uses_user']  = this.state.max_uses_user;
        parseData['deskripsi']      = this.state.deskripsi;
        parseData['is_fixed']      = "0";
        if(parseData['title']===''){
            ToastQ.fire({icon:'error',title:`title tidak boleh kosong`});
            return;
        }
        if(parseData['periode_start']===''){
            ToastQ.fire({icon:'error',title:`tanggal mulai tidak boleh kosong`});
            return;
        }

        if(parseData['periode_end']===''){
            ToastQ.fire({icon:'error',title:`tanggal selesai tidak boleh kosong`});
            return;
        }
        if(parseData['periode_end']<parseData['periode_start']){
            ToastQ.fire({icon:'error',title:`tanggal selesai tidak boleh kurang dari tanggal mulai`});
            return;
        }
        if(parseData['max_uses']===''||parseData['max_uses']<1){
            ToastQ.fire({icon:'error',title:`limit pemakaian voucher tidak boleh kosong atau nol`});
            return;
        }
        if(parseData['max_uses_user']===''||parseData['max_uses_user']<1){
            ToastQ.fire({icon:'error',title:`limit pemakaian voucher permember tidak boleh kosong atau nol`});
            return;
        }
        if(parseData['deskripsi']===''){
            ToastQ.fire({icon:'error',title:`deskripsi tidak boleh kosong`});
            return;
        }
        parseData['periode_start'] = parseData['periode_start']+" 00:00:00";
        parseData['periode_end'] = parseData['periode_end']+" 23:59:59";
        //
        if(this.props.detail.id===''){
            this.props.dispatch(postVoucher(parseData));
        }
        else{
            this.props.dispatch(putVoucher(parseData,this.props.detail.id));
        }
        this.clearState();
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };

    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formVoucher"} size="lg">
                <ModalHeader toggle={this.toggle}>{this.props.detail.id!==''?`Ubah Voucher`:`Tambah Voucher`}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" name={"title"} className={"form-control"} value={this.state.title} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Tanggal Mulai</label>
                                <input type="date"  name={"periode_start"} className={"form-control"} value={this.state.periode_start} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Tanggal Selesai</label>
                                <input type="date" name={"periode_end"} className={"form-control"} value={this.state.periode_end} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Disc (%)</label>
                                <input type="number" name={"disc"} className={"form-control"} value={this.state.disc} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select name="status" className="form-control" value={this.state.status} onChange={this.handleChange}>
                                    <option value="1">Aktif</option>
                                    <option value="0">Tidak Aktif</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Limit Pemakaian Voucher</label>
                                <input type="number" name={"max_uses"} className={"form-control"} value={this.state.max_uses} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Limit Pemakaian Voucher Permember</label>
                                <input type="number" name={"max_uses_user"} className={"form-control"} value={this.state.max_uses_user} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Deskripsi</label>
                                <textarea style={{height:"197px"}} name="deskripsi" className={"form-control"} cols="30" rows="10" value={this.state.deskripsi} onChange={this.handleChange}/>
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
        isLoadingPost: state.voucherReducer.isLoadingPost,
        isError: state.voucherReducer.isError,
    }
}

export default connect(mapStateToProps)(FormVoucher);

