import React, {Component} from 'react'
import { connect } from 'react-redux'
import WrapperModal from '../_wrapper.modal'
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import {ModalToggle} from "redux/actions/modal.action";
import Swal from "sweetalert2";
import File64 from "components/common/File64";
import {updateKarir} from "redux/actions/setting/general.action"

class FormBarang extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state={
           id:'',
           title:'',
           deskripsi:'',
           right_point:'',
           left_point:'',
           badge:'',
           new_badge:'-'
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data !== undefined && props.data.length !== 0) {
            if (props.data !== state.prevdataProps) {
                return {
                    prevdataProps:props.data,   
                    id: props.data.id,
                    title: props.data.title,
                    deskripsi: props.data.deskripsi,
                    right_point: props.data.right_point,
                    left_point: props.data.left_point,
                    badge: props.data.badge,
                };
            }
        }

    }

    handleFile(files) {
        this.setState({
            new_badge: files.base64
        });
    }

    clearState(){
        this.setState({
            title:"",
            harga:"",
            ppn:"",
            satuan:"",
            status:"",
            berat:"",
            stock:"",
        })
    }
    handleChange = (event) => {
        console.log({
            [event.target.name]: event.target.value
        });
        this.setState({[event.target.name]: event.target.value});
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };

    handleSubmit(e){
        e.preventDefault();
        Swal.fire({
            title: 'Perhatian !!!',
            html: `Pastikan data anda telah benar`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Oke, Update`,
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(updateKarir(this.state,this.state.id, this.state.title));
            }
        })
        if(this.props.isError===true){
            this.clearState();
        }

    }
    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "karirModal"} size="md">
                <ModalHeader toggle={this.toggle}>Update Karir</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" className={"form-control"} name={"title"} value={this.state.title} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Deskripsi</label>
                                <input type="text" className={"form-control"} name={"deskripsi"} value={(this.state.deskripsi)} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>right_point</label>
                                <input type="text" className={"form-control"} name={"right_point"} value={this.state.right_point} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>left_point</label>
                                <input type="number" className={"form-control"} name={"left_point"} value={this.state.left_point} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Gambar <small style={{color:"red",fontWeight:"bold"}}>( kosongkan apabila tidak akan diubah )</small></label><br/>
                                <File64 multiple={ false }
                                    maxSize={2048} //in kb
                                    fileType='png, jpg' //pisahkan dengan koma
                                    className="mr-3 form-control-file"
                                    onDone={ this.handleFile.bind(this) }
                                    showPreview={true}
                                    lang='id'
                                    previewLink={this.state.badge}
                                    previewConfig={{
                                        width:'100px',
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
        isLoadingPost: state.barangReducer.isLoadingPost,
        isError: state.barangReducer.isError,
    }
}
export default connect(mapStateToProps)(FormBarang);