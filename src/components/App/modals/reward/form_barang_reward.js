import React, {Component} from 'react'
import { connect } from 'react-redux'
import WrapperModal from '../_wrapper.modal'
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import {ModalToggle} from "../../../../redux/actions/modal.action";
import {ToastQ} from "../../../../helper";
import JenjangKarir from "../../../../components/common/jenjangKarir";
import File64 from "components/common/File64";
import {postBarangReward, putBarangReward} from "../../../../redux/actions/paket/barang_reward.action";
import {fetchKarir} from "../../../../redux/actions/setting/general.action";
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';


class FormBarangReward extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.HandleChangeKarir = this.HandleChangeKarir.bind(this);
        this.state={
            title:"",
            gambar:"",
            caption:"",
            id_karir:"",
        }
    }

    clearState(){
        this.setState({
            title:"",
            gambar:"",
            caption:"",
        })
    }
    getProps(props){
        console.log(props);
        if(props.detail.id!==''){
            this.setState({
                title:props.detail.title,
                id_karir:props.detail.id_karir,
                gambar:"",
                caption:props.detail.caption,
            })
        }
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
    HandleChangeKarir(val){
        this.setState({
            id_karir:val.value
        })
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
        parseData['caption'] = this.state.caption;
        parseData['id_karir'] = this.state.id_karir;
        parseData['gambar'] = this.state.gambar!==""?this.state.gambar.base64:'-';
        console.log(parseData);

        if(parseData['title']===''||parseData['title']===undefined){
            ToastQ.fire({icon:'error',title:`title tidak boleh kosong`});
            return;
        }
        if(parseData['caption']===''||parseData['caption']===undefined){
            ToastQ.fire({icon:'error',title:`deskripsi tidak boleh kosong`});
            return;
        }

        if(this.props.detail.id!==''){
            this.props.dispatch(putBarangReward(parseData,this.props.detail.id));
        }
        else{
            this.props.dispatch(postBarangReward(parseData));
        }
        if(this.props.isError===true){
            this.clearState();
        }

    }
    render(){
        // console.log(this.props.detail)
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formBarangReward"} size="md">
                <ModalHeader toggle={this.toggle}>{this.props.detail.id===''?"Tambah Barang Reward":"Ubah Barang Reward"}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" className={"form-control"} name={"title"} value={this.state.title} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Jenis Karir</label>

                                <JenjangKarir handleChange={this.HandleChangeKarir.bind(this)} id={this.state.id_karir}/>

                                {/*{*/}
                                    {/*typeof this.props.karir === 'object' ?*/}
                                        {/*(*/}
                                            {/*<Select*/}
                                                {/*options={this.state.data_karir}*/}
                                                {/*placeholder="Pilih Membership"*/}
                                                {/*onChange={this.HandleChangeKarir}*/}
                                                {/*value={*/}
                                                    {/*this.state.data_karir.find(op => {*/}
                                                        {/*return op.value === this.state.id_karir*/}
                                                    {/*})*/}
                                                {/*}*/}

                                            {/*/>*/}
                                        {/*)*/}
                                        {/*: <Skeleton height={40}/>*/}
                                {/*}*/}

                            </div>
                            <div className="form-group">
                                <label>Deskripsi</label>
                                <textarea type="text" rows="6" className="form-control" name="caption" onChange={this.handleChange} value={this.state.caption}>{this.state.caption}</textarea>
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
        isLoadingPost: state.barangRewardReducer.isLoadingPost,
        isError: state.barangRewardReducer.isError,
    }
}
export default connect(mapStateToProps)(FormBarangReward);