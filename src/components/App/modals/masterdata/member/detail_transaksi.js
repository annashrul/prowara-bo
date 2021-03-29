import React, {Component} from 'react'
import { connect } from 'react-redux'
import WrapperModal from '../../_wrapper.modal'
import {
    ModalHeader,
    ModalBody,
} from 'reactstrap';
import {ModalToggle} from "../../../../../redux/actions/modal.action";

class DetailTransaksi extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
    }
    toggle = (e) => {
        e.preventDefault();
        localStorage.removeItem("isAlamat");
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };

    componentWillReceiveProps(nextProps){
        console.log("props alamat",nextProps);
    }



    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailTransaksi"} size="lg">
                <ModalHeader toggle={this.toggle}>Detail Transaksi</ModalHeader>
                <ModalBody>


                </ModalBody>
            </WrapperModal>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(DetailTransaksi);