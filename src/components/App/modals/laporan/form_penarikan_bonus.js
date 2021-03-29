import React,{Component} from 'react';
import WrapperModal from "../_wrapper.modal";
import connect from "react-redux/es/connect/connect";

import {
    ModalBody,
    ModalHeader,
    ModalFooter
} from "reactstrap";
import {ModalToggle} from "../../../../redux/actions/modal.action";
import {stringifyFormData, ToastQ, rmComma, toCurrency} from "../../../../helper";
import {postPenarikanBonus} from "../../../../redux/actions/laporan/bonus.action";


class FormPenarikanBonus extends Component{
    //MENU ACCESS MASTERDATA = 0-9
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            kode: '',
            amount:'0',
        }
    }
    clearState(){
        this.setState({
            kode: '',
            amount:'0',
        })
    }
    getProps(param){
        this.setState({kode:param.detail.kode});
    }
    componentWillReceiveProps(nextProps) {
        this.getProps(nextProps);
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.clearState();
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        let err = Object.assign({}, this.state.error, {[event.target.name]: ""});
        this.setState({error: err});
    };
    handleSubmit(e){
        e.preventDefault();
        if(this.state.amount===''||this.state.amount==='0'){
            ToastQ.fire({icon:'error',title:`silahkan masukan nominal yang akan ditarik`});
            return;
        }
        else{
            this.props.dispatch(postPenarikanBonus({
                "kode":this.state.kode,
                "amount":rmComma(this.state.amount)
            }));
        }
    }
    render(){
        const {array_modul} = this.state;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formPenarikanBonus"} size="md">
                <ModalHeader toggle={this.toggle}>Penarikan Bonus ({this.state.kode})</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-12">
                            <div className="form-group">
                                <label>Nominal</label>
                                <input type="text" className="form-control" name="amount" value={toCurrency(this.state.amount)}  onChange={(e)=>this.handleChange(e)} />
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
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        isLoadingPost: state.bonusReducer.isLoadingPost,
        isError: state.bonusReducer.isError,
    }
}

export default connect(mapStateToProps)(FormPenarikanBonus);
