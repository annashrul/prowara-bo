import React,{Component} from 'react';
import WrapperModal from "../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import {
    ModalBody,
    ModalHeader,
    ModalFooter
} from "reactstrap";
import {ModalToggle} from "../../../../redux/actions/modal.action";
import {getDetailLaporanSaldo} from "../../../../redux/actions/ewallet/saldo.action";
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import {NOTIF_ALERT} from "../../../../redux/actions/_constants";
import Paginationq,{toCurrency} from "../../../../helper";


class DetailLaporanSaldo extends Component{
    //MENU ACCESS MASTERDATA = 0-9
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handlePage = this.handlePage.bind(this);
    }


    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };
    componentWillMount(){
        this.props.dispatch(getDetailLaporanSaldo(`page=1&id_member=${this.props.detail.id}&perpage=10`));
    }
    handlePage(num){
        this.props.dispatch(getDetailLaporanSaldo(`page=${num}&id_member=${this.props.detail.id}&perpage=10`));
    }


    render(){
        const columnStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const numStyle ={verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
        const {
            total,
            per_page,
            offset,
            to,
            last_page,
            current_page,
            from,
            data,
            summary
        } = this.props.data;
        console.log(summary);
        let totTrxIn=0,totTrxOut=0,totSaldoAwal=0;
        console.log(data);



        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailLaporanSaldo"} size="lg">
                <ModalHeader toggle={this.toggle}>Detail Laporan Saldo {this.props.detail.nama}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        {
                            !this.props.isLoading?typeof data==='object'?data.length>0?data.map((v,i)=>{
                                return(
                                    <div className='col-md-12 col-sm-12 col-lg-12' key={i}>
                                        <div className="card rounded mb-2" style={{borderLeft:'8px solid #333'}}>
                                            <div className="card-body p-3">
                                                <div className="media">
                                                    <div className="media-body text-center mr-2" style={{maxWidth:'100px',minWidth:'100px'}}>
                                                        <h5 className="mb-1">{moment(v.created_at).format('HH:MM')}</h5>
                                                        <p className="mb-0 text-muted">
                                                            {moment(v.created_at).format('YYYY-DD-MM')}
                                                        </p>
                                                    </div>
                                                    <div className="media-body text-left" style={{marginLeft:'20px'}}>
                                                        <p className="mb-2 text-mute">{v.note}</p>
                                                        <h6 className="mb-1 text-black">{v.kd_trx}</h6>
                                                    </div>
                                                    <div className="media-body text-left ml-1" style={{maxWidth:'200px',minWidth:'200px'}}>
                                                        <h6 className="mb-1 text-success">+ {parseInt(v.trx_in,10)!==0?toCurrency(parseInt(v.trx_in,10)):0}</h6>
                                                        <p className="mb-0 text-danger">
                                                            - {parseInt(v.trx_out,10)!==0?toCurrency(parseInt(v.trx_out,10)):0}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }):(<div className={"col-md-12 text-center"}>
                                <img src={NOTIF_ALERT.NO_DATA} style={{verticalAlign:"middle"}} alt=""/>
                            </div>):(<div className={"col-md-12 text-center"}>
                                <img src={NOTIF_ALERT.NO_DATA} style={{verticalAlign:"middle"}} alt=""/>
                            </div>):(()=>{
                                let container =[];
                                for(let x=0; x<10; x++){
                                    container.push(
                                        <div className='col-md-12 col-sm-12 col-lg-12' key={x}>
                                            <div className="card rounded mb-2" style={{borderLeft:'8px solid #333'}}>
                                                <div className="card-body p-3">
                                                    <div className="media">
                                                        <div className="media-body text-center mr-2" style={{maxWidth:'100px',minWidth:'100px'}}>
                                                            <h5 className="mb-1"><Skeleton width='80px'/></h5>
                                                            <p className="mb-0 text-muted">
                                                                <Skeleton width='50px'/>
                                                            </p>
                                                        </div>
                                                        <div className="media-body text-left" style={{marginLeft:'20px'}}>
                                                            <p className="mb-2 text-mute"><Skeleton width='350px'/></p>
                                                            <h6 className="mb-1 text-black"><Skeleton width='200px'/></h6>
                                                        </div>
                                                        <div className="media-body text-left ml-1" style={{maxWidth:'200px',minWidth:'200px'}}>
                                                            <h6 className="mb-1 text-success"><Skeleton width='100px'/></h6>
                                                            <p className="mb-0 text-danger">
                                                                <Skeleton width='100px'/>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                return container;
                            })()
                        }

                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            {
                                <div style={{padding:'20px',"marginTop":"20px","marginBottom":"20px","float":"left"}}>
                                    <h5>Ringkasan</h5>
                                    <div className="table-responsive">
                                        <table className="table">
                                            <tr>
                                                <th>Saldo Awal</th>
                                                <td>:</td>
                                                <td className={"txtRed"}>{summary===undefined?0:toCurrency(summary.saldo_awal,true)}</td>
                                            </tr>
                                            <tr>
                                                <th>Saldo Masuk</th>
                                                <td>:</td>
                                                <td className={"txtRed"}>{summary===undefined?0:toCurrency(summary.trx_in,true)}</td>
                                            </tr>
                                            <tr>
                                                <th>Saldo Keluar</th>
                                                <td>:</td>
                                                <td className={"txtRed"}>{summary===undefined?0:toCurrency(summary.trx_out,true)}</td>
                                            </tr>
                                            <tr>
                                                <th>Saldo saat ini</th>
                                                <td>:</td>
                                                <td className={"txtRed"}> {
                                                    summary===undefined?0:toCurrency((parseInt(summary.saldo_awal, 10) + parseInt(summary.trx_in, 10)) - parseInt(summary.trx_out,10), true)
                                                } </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            }

                            <div style={{padding:'20px',"marginTop":"20px","marginBottom":"20px","float":"right"}}>
                                <Paginationq
                                    current_page={current_page}
                                    per_page={per_page}
                                    total={total}
                                    callback={this.handlePage}
                                />
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        data:state.saldoReducer.detail,
        isLoading:state.saldoReducer.isLoadingDetail
    }
}

export default connect(mapStateToProps)(DetailLaporanSaldo);
