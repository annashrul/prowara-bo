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
import File64 from "components/common/File64";
import {postBarangRedeem, putBarangRedeem} from "../../../../redux/actions/paket/barang_redeem.action";


class FormBarangRedeem extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state={
            title:"",
            harga:"",
            berat:"",
            stok:"",
            gambar:"",
            deskripsi:"",
        }
    }

    clearState(){
        this.setState({
            title:"",
            harga:"",
            berat:"",
            stok:"",
            gambar:"",
            deskripsi:"",
        })
    }
    getProps(props){
        console.log(props);
        this.setState({
            title:props.detail.title,
            harga:props.detail.harga,
            berat:props.detail.berat,
            stok:props.detail.stock,
            gambar:"",
            deskripsi:props.detail.deskripsi,
        })
    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    handleFile(files) {
        this.setState({gambar: files});
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));

    };
    handleSubmit(e){
        e.preventDefault();
        let parseData = {};
        parseData['title'] = this.state.title;
        parseData['harga'] = rmComma(this.state.harga);
        parseData['berat'] = rmComma(this.state.berat);
        parseData['stock'] = rmComma(this.state.stok);
        parseData['deskripsi'] = this.state.deskripsi;
        parseData['gambar'] = this.state.gambar!==""?this.state.gambar.base64:'-';
        console.log(parseData)

        if(parseData['title']===''){
            ToastQ.fire({icon:'error',title:`title tidak boleh kosong`});
            return;
        }
        if(parseData['harga']===''){
            ToastQ.fire({icon:'error',title:`poin tidak boleh kosong`});
            return;
        }
        if(parseData['stok']===''){
            ToastQ.fire({icon:'error',title:`stok tidak boleh kosong`});
            return;
        }
        if(parseData['berat']===''){
            ToastQ.fire({icon:'error',title:`berat tidak boleh kosong`});
            return;
        }
        if(parseData['deskripsi']===''){
            ToastQ.fire({icon:'error',title:`deskripsi tidak boleh kosong`});
            return;
        }
        if(this.props.detail.id!==''){
            this.props.dispatch(putBarangRedeem(parseData,this.props.detail.id));
        }
        else{
            this.props.dispatch(postBarangRedeem(parseData));
        }
        if(this.props.isError===true){
            this.clearState();
        }

    }
    render(){
        // console.log(this.props.detail)
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formBarangRedeem"} size="lg">
                <ModalHeader toggle={this.toggle}>{this.props.detail.id===''?"Tambah Barang Redeem":"Ubah Barang Redeem"}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Nama</label>
                                <input type="text" className={"form-control"} name={"title"} value={this.state.title} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Poin</label>
                                <input type="text" className={"form-control"} name={"harga"} value={toCurrency(this.state.harga)} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Stok</label>
                                <input type="text" className={"form-control"} name={"stok"} value={toCurrency(this.state.stok)} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Berat</label>
                                <input type="text" className={"form-control"} name={"berat"} value={toCurrency(this.state.berat)} onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Deskripsi</label>
                                <textarea type="text" rows="6" className="form-control" name="deskripsi" onChange={this.handleChange} value={this.state.deskripsi}>{this.state.deskripsi}</textarea>
                            </div>
                            <div className="form-group">
                                <label>Gambar <small style={{color:"red",fontWeight:"bold"}}>{this.props.detail.id!==''?"( kosongkan apabila tidak akan diubah )":""}</small></label><br/>
                                <File64 multiple={ false }
                                        maxSize={2048} //in kb
                                        fileType='png, jpg' //pisahkan dengan koma
                                        className="mr-3 form-control-file"
                                        onDone={ this.handleFile.bind(this) }
                                        showPreview={true}
                                        lang='id'
                                        previewLink={this.state.prev}
                                        previewConfig={{
                                            width:'100%',
                                            height: '100px'
                                        }}
                                />
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
        isLoadingPost: state.barangRedeemReducer.isLoadingPost,
        isError: state.barangRedeemReducer.isError,
    }
}
export default connect(mapStateToProps)(FormBarangRedeem);