import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";

import {
    ModalBody,
    ModalHeader,
    ModalFooter
} from "reactstrap";
import {ModalToggle} from "../../../../../redux/actions/modal.action";
import {stringifyFormData,ToastQ} from "../../../../../helper";
import {postUserLevel, putUserLevel} from "../../../../../redux/actions/masterdata/user_level.action";
import Preloader from "../../../../../Preloader";


class FormUserLevel extends Component{
    //MENU ACCESS MASTERDATA = 0-9
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            menu:[
                {label:"member",path:"/member",isChecked:false,isToggle:false,sub:undefined},
                {label:"pin",path:"/pin",isChecked:false,isToggle:false,sub:undefined},
                // {label:"konten",path:"",isChecked:false,isToggle:false,sub:[
                //     {label:"testimoni",path:"/testimoni",parent:'konten',isChecked:false},
                //     {label:"berita",path:"/berita",parent:'konten',isChecked:false},
                // ]},
                {label:"pengguna",path:"",isChecked:false,isToggle:false,sub:[
                    {label:"daftar pengguna",path:"/daftar_pengguna",parent:'pengguna',isChecked:false},
                    {label:"akses pengguna",path:"/akses_pengguna",parent:'pengguna',isChecked:false},
                ]},
                // {label:"e-wallet",path:"",isChecked:false,isToggle:false,sub:[
                //     {label:"deposit",path:"/deposit",parent:'e-wallet',isChecked:false},
                //     {label:"penarikan",path:"/penarikan",parent:'e-wallet',isChecked:false},
                //     {label:"transfer",path:"/transfer",parent:'e-wallet',isChecked:false},
                // ]},
                {label:"laporan",path:"",isChecked:false,isToggle:false,sub:[
                    {label:"transaksi",path:"/laporan/transaksi",parent:'laporan',isChecked:false},
                    {label:"penjualan",path:"",parent:'laporan',isChecked:false,sub:[
                        {label:"paket",path:"/laporan/paket",parent:'penjualan',isChecked:false,sub:undefined},
                        {label:"pin",path:"/laporan/pin",parent:'penjualan',isChecked:false,sub:undefined},
                    ]},
                    {label:"e-wallet",path:"",parent:'laporan',isChecked:false,sub:[
                        {label:"deposit",path:"/laporan/deposit",parent:'e-wallet',isChecked:false,sub:undefined},
                        {label:"penarikan",path:"/laporan/penarikan",parent:'e-wallet',isChecked:false,sub:undefined},
                        {label:"transfer",path:"/laporan/transfer",parent:'e-wallet',isChecked:false,sub:undefined},
                    ]},

                ],otherSub:true},
                {label:"berita",path:"/berita",isChecked:false,isToggle:false,sub:undefined},

                {label:"pengaturan",path:"",isChecked:false,isToggle:false,sub:[
                    {label:"umum",path:"/pengaturan/umum",parent:'pengaturan',isChecked:false},
                    {label:"bank",path:"/pengaturan/bank",parent:'pengaturan',isChecked:false},
                ]},
            ],
            lvl    : "",
        }
    }

    getProps(param){
        if (param.detail.id !== '') {
            // this.setState({lvl:param.detail.lvl,menu:param.detail.access});
            this.setState({lvl:param.detail.lvl,menu:this.state.menu});
        }
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
    };
    handleAllChecked = (event,param) => {
        let menu = this.state.menu;
        menu.map((val,key)=>{
            if(param===val.label){
                val.isChecked=event.target.checked;
            }
            if(val.sub!==undefined){
                val.sub.map((row,i)=>{
                    if(param===val.label||param===row.label){
                        row.isChecked=event.target.checked;
                    }
                    if(row.sub!==undefined){
                        row.sub.map((res,idx)=>{
                            if(param===val.label||param===row.label&&param===res.label){
                                res.isChecked=event.target.checked;
                            }
                        })
                    }

                })
            }
        });
        this.setState({menu:menu});
    };
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        let err = Object.assign({}, this.state.error, {[event.target.name]: ""});
        this.setState({error: err});
    };
    handleSubmit(e){
        e.preventDefault();
        let parseData   = {};
        parseData['level']    = this.state.lvl;
        parseData['access_level'] = JSON.stringify(this.state.menu);
        console.log(parseData);
        if(parseData['level']===''||parseData['level']===undefined){
            ToastQ.fire({icon:'error',title:`silahkan beri nama untuk akses pengguna ini`});
            return;
        }
        if(this.props.detail.id===''){
            this.props.dispatch(postUserLevel(parseData))
        }
        else{
            this.props.dispatch(putUserLevel(parseData,this.props.detail.id));
        }
    }
    render(){
        const {menu} = this.state;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formUserLevel"} size="lg">
                <ModalHeader toggle={this.toggle}>{this.props.detail.id===''?"Tambah":"Ubah"} Akses Pengguna</ModalHeader>
                {this.props.isLoadingPost?<Preloader/>:null}
                <ModalBody>
                    <div className="row">
                        <div className="col-12">
                            <div className="form-group">
                                <label>Nama Akses</label>
                                <input type="text" className="form-control" name="lvl" value={this.state.lvl}  onChange={(e)=>this.handleChange(e)} />
                            </div>
                        </div>
                        {
                            menu.map((val,key)=>{
                                if(val.sub===undefined){
                                    return(
                                        <div className="col-md-12" key={key}>
                                            <div className="form-group">
                                                <input type="checkbox" checked={val.isChecked} onChange={(e)=>this.handleAllChecked(e,val.label)}  value="checkedall" /> <b style={{color:'red'}}>{val.label.replace('_',' ').toUpperCase()}</b>
                                            </div>
                                            <hr style={{border:"1px solid #343a40"}}/>
                                        </div>
                                    );
                                }
                                else{
                                    return(
                                        <div className="col-md-12" key={key}>
                                            <div className="form-group">
                                                <input type="checkbox" checked={val.isChecked} onChange={(e)=>this.handleAllChecked(e,val.label)}  value="checkedall" /> <b style={{color:'red'}}>{val.label.replace('_',' ').toUpperCase()}</b>
                                            </div>
                                            <hr style={{border:"1px solid #343a40"}}/>
                                            <div className="row">
                                                {
                                                    val.sub.map((row,idx)=>{

                                                        return(
                                                            <div className={`${row.sub!==undefined?'col-md-12':'col-md-3'}`} key={idx}  style={{marginLeft:"9px"}}>
                                                                <div className="form-group">
                                                                    <input onChange={(e)=>this.handleAllChecked(e,row.label)} id={row.label} className={row.label} type="checkbox" checked={row.isChecked} value={row.value} /> <b style={{color:'green'}}>{row.label.replace('_',' ').toUpperCase()}</b>
                                                                </div>
                                                                <hr style={{border:"1px solid #343a40"}}/>
                                                                <div className="row" style={{marginLeft:"3px"}}>
                                                                    {
                                                                        (()=> {
                                                                            let child = [];
                                                                            if(row.sub!==undefined){
                                                                                row.sub.map((res,i)=>{
                                                                                    child.push(
                                                                                        <div className="col-md-3">
                                                                                            <div className="form-group">
                                                                                                <input onChange={(e)=>this.handleAllChecked(e,res.label)} id={res.label} className={res.label} type="checkbox" checked={res.isChecked} value={res.value} /> <b style={{color:'orange'}}>{res.label.replace('_',' ').toUpperCase()}</b>
                                                                                            </div>
                                                                                            <hr style={{border:"1px solid #343a40"}}/>
                                                                                        </div>

                                                                                    );
                                                                                })

                                                                            }
                                                                            return child;
                                                                        })()
                                                                    }
                                                                </div>
                                                            </div>
                                                        );


                                                    })
                                                }
                                            </div>
                                        </div>
                                    );

                                }

                            })
                        }
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="form-group" style={{textAlign:"right"}}>
                        <button style={{color:"white"}} type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle} ><i className="ti-close"/>Keluar</button>
                        <button type="submit" className="btn btn-primary mb-2 mr-2" onClick={this.handleSubmit} ><i className="ti-save" />Simpan </button>
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
        isLoadingPost: state.userLevelReducer.isLoadingPost,
        isError: state.userLevelReducer.isError,
    }
}

export default connect(mapStateToProps)(FormUserLevel);
