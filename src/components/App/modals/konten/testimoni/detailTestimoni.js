import React, {Component} from 'react'
import { connect } from 'react-redux'
import WrapperModal from '../../_wrapper.modal'
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import {ModalToggle} from "../../../../../redux/actions/modal.action";
import moment from "moment";
import ReactPlayer from "react-player"


class DetailTestimoni extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state={
            title:"",
            picture:"-",
            video:"-",
            caption:"",
            type:0,
        }
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));

    };

    componentWillReceiveProps(nextProps){

        if(nextProps.detail.id!==''){
            this.setState({
                caption:nextProps.detail.caption,
                id_category:nextProps.detail.id_category,
                title:nextProps.detail.title,
                video:nextProps.detail.video,
            });
            // this.handleChangeKategori({value:nextProps.detail.id_category,label:nextProps.detail.category})
        }
    }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailTestimoni"} size="lg">
                <ModalHeader toggle={this.toggle}>Detail Testimoni</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="ibox-content" id="ibox-content">
                                <div id="vertical-timeline" className="vertical-container light--timeline">
                                    <div className="vertical-timeline-block">
                                        <div className={`vertical-timeline-icon ${this.props.detail.video==='-'?'bg-info':''} btn-floating pulse`} style={{
                                            border:this.props.detail.video==='-'?'3px solid #e8ebf1':'3px solid transparent',
                                            backgroundColor:this.props.detail.video==='-'?'#5d78ff!important':'none!important'
                                        }}>
                                            {/*<i className="fa fa-briefcase"/>*/}
                                            {
                                                this.props.detail.video==='-'?(
                                                    <i className="fa fa-briefcase"/>
                                                ):(
                                                    <img src={this.props.detail.picture} className={"img-rounded"} alt="" style={{height:'100%',width:'100%',objectFit:"contain"}}/>

                                                )
                                            }
                                        </div>

                                        <div className="vertical-timeline-content">
                                            <h5>{this.props.detail.writer}</h5>
                                            {
                                                this.props.detail.video==='-'?(<img src={this.props.detail.picture} alt="" style={{height:'200px',width:'100%',objectFit:"contain"}}/>
                                                ):(
                                                    <ReactPlayer
                                                        url={this.props.detail.video} width={'100%'}
                                                    />
                                                )
                                            }
                                            <p>{this.props.detail.caption}</p>
                                            <span className="vertical-date">{this.props.detail.jobs}<br/>
                                                <small>{moment(this.props.detail.created_at).format("lll")}</small>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="form-group" style={{textAlign:"right"}}>
                        <button style={{color:"white"}} type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle} ><i className="ti-close"/>Keluar</button>
                        {/*<button type="submit" classNameName="btn btn-primary mb-2 mr-2" onClick={this.handleSubmit} ><i classNameName="ti-save" />{!this.props.isLoadingPost?'Simpan':'Loading ......'}</button>*/}
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
        kategori:state.kategoriReducer.data,
        isLoadingPost: state.contentReducer.isLoadingPost,
        isError: state.contentReducer.isError,

    }
}
export default connect(mapStateToProps)(DetailTestimoni);