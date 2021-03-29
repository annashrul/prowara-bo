import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import {DateRangePicker} from "react-bootstrap-daterangepicker";
import Paginationq, {rangeDate,noImage, rmComma, ToastQ, toCurrency, toRp} from "../../../helper";
import {NOTIF_ALERT} from "../../../redux/actions/_constants";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import Skeleton from 'react-loading-skeleton';
import moment from "moment";
import GeneratePin from "../modals/pin/generate_pin"
import {getBonus, postPenarikan} from "../../../redux/actions/laporan/bonus.action";
import FormPenarikanBonus from '../modals/laporan/form_penarikan_bonus';

class IndexBonus extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            any:"",
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD"),
            data:[],
            isLoading:true,
            tipe:'aktivasi'
        };
        this.handleModal = this.handleModal.bind(this);
        this.handleTipe = this.handleTipe.bind(this);

    }
    componentWillMount(){
        this.props.dispatch(getBonus(`page=1`));
    }
    componentWillReceiveProps(nextProps){
        let isLoading=true;
        let data=[];
        if(nextProps.data.length>0){
           for(let i=0;i<nextProps.data.length;i++){
               data.push(nextProps.data[i]);
           }
           isLoading=false;
        }
        else{
            data=[];
        }
        this.setState({isLoading:isLoading,data:data});
    }



    handleModal(e,kode){
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formPenarikanBonus"));
        this.setState({detail:{kode:kode}});
    }

    handleTipe(e, type) {
        e.preventDefault();
        this.setState({
            tipe: type
        })
        const tipe=type==='aktivasi'?'':'&type=ro'
        this.props.dispatch(getBonus(`page=1${tipe}`));
    }


    render(){
        const columnStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        return(
            <Layout page={"Transaksi Bonus"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Transaksi Bonus</h5>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3" style={{textAlign:'right'}}>
                            <button style={{marginTop:"27px"}} type="button" className={this.state.tipe==='aktivasi'?"btn btn-success mb-2 mr-2":"btn btn-outline-success mb-2 mr-2"} onClick={(e)=>this.handleTipe(e,'aktivasi')}>Bonus Aktivasi/Registrasi</button>
                            <button style={{marginTop:"27px"}} type="button" className={this.state.tipe==='ro'?"btn btn-success mb-2 mr-2":"btn btn-outline-success mb-2 mr-2"}  onClick={(e)=>this.handleTipe(e,'ro')}>Bonus Royalti/Repeat Order</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <table className='table table-bordered'>
                                    <thead className="thead-light">
                                        <tr>
                                            <th rowSpan={2} style={columnStyle}>Jenis</th>
                                            <th rowSpan={2} style={columnStyle}>Persentase</th>
                                            <th colSpan={3} style={columnStyle}>Transaksi</th>
                                            <th rowSpan={2} style={columnStyle}>Aksi</th>
                                        </tr>
                                        <tr>
                                            <th>Masuk</th>
                                            <th>Keluar</th>
                                            <th>Saldo saat ini</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                         {
                                            this.state.isLoading===false ? this.state.data.length > 0 ?
                                                this.state.data.map((v, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{v.note.toUpperCase()}</td>
                                                            <td>{v.percentage} %</td>
                                                            <td>{parseInt(v.trx_in)===0?0:toCurrency(v.trx_in)}</td>
                                                            <td>{parseInt(v.trx_out)===0?0:toCurrency(v.trx_out)}</td>
                                                            <td>{parseInt(v.total)===0?0:toCurrency(v.total)}</td>
                                                            <td><button onClick={(e)=>this.handleModal(e,v.kode)} className={"btn btn-primary btn-block"}>Tarik Saldo</button></td>
                                                        </tr>
                                                    );
                                                })
                                                : <tr>
                                                    <td colSpan={7} style={columnStyle}><img src={NOTIF_ALERT.NO_DATA}/></td>
                                                </tr>
                                                :(()=>{
                                                    let container =[];
                                                    for(let x=0; x<10; x++){
                                                        container.push(
                                                        <tr key={x}>
                                                            <td><Skeleton/></td>
                                                            <td><Skeleton/></td>
                                                            <td><Skeleton/></td>
                                                            <td><Skeleton/></td>
                                                            <td><Skeleton/></td>
                                                            <td><Skeleton/></td>
                                                        </tr>
                                                        )
                                                    }
                                                    return container;
                                                })()
                                        }
                                                            
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.props.isOpen===true?<FormPenarikanBonus
                        detail={this.state.detail}
                    />:null
                }
                {/*<FormPaket/>*/}
            </Layout>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        isLoading: state.pinReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.bonusReducer.data,
    }
}


export default connect(mapStateToProps)(IndexBonus);