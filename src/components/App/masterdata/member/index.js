import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import Paginationq, {noImage, rangeDate, statusQ, toCurrency, toRp} from "helper";
import {NOTIF_ALERT} from "redux/actions/_constants";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import moment from "moment";
import DetailAlamat from "../../modals/masterdata/member/detail_alamat"
import DetailBank from "../../modals/masterdata/member/detail_bank"
import DetailInvesment from "../../modals/masterdata/member/detail_invesment"
import {getMember, putMember} from "redux/actions/masterdata/member.action";
import UncontrolledButtonDropdown from "reactstrap/es/UncontrolledButtonDropdown";
import DropdownToggle from "reactstrap/es/DropdownToggle";
import DropdownMenu from "reactstrap/es/DropdownMenu";
import DropdownItem from "reactstrap/es/DropdownItem";
import {fetchKategori} from "../../../../redux/actions/kategori/kategori.action";
import Select from 'react-select';
import {getExcelMember, getInvesment} from "../../../../redux/actions/masterdata/member.action";
import {toExcel} from "../../../../helper";
import Preloader from "../../../../Preloader";
import {getDetailBank} from "../../../../redux/actions/masterdata/bank.action";
import {getDetailAlamat} from "../../../../redux/actions/masterdata/alamat.action";
import * as Swal from "sweetalert2";

class IndexMember extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            any:"",
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD"),
            searchBy:'fullname',
            searchByData:[
                {value:'fullname',label:'Nama'},
                {value:'referral',label:'Referral'},
                {value:'mobile_no',label:'Telepon'},
                {value:'status',label:'Status'},

            ],
            membership:'',
            jenjangKarir:'',
            status:'',
            statusData:[{value:'-',label:"Semua"},{value:0,label:"Tidak Aktif"},{value:1,label:"Aktif"}]

        };
        this.handleEvent    = this.handleEvent.bind(this);
        this.handleChange   = this.handleChange.bind(this);
        this.handlePage     = this.handlePage.bind(this);
        this.handleSearch   = this.handleSearch.bind(this);
        this.handleSearchBy      = this.handleSearchBy.bind(this);
        this.printDocumentXLsx      = this.printDocumentXLsx.bind(this);
        this.handleStatus      = this.handleStatus.bind(this);
        this.handleInvestment      = this.handleInvestment.bind(this);
        this.handleAlamat      = this.handleAlamat.bind(this);
        this.handleBank      = this.handleBank.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.dataExcel.data!==this.props.dataExcel.data){
            this.getExcel(this.props);
        }
        // if(prevProps.isShowModalBank!==this.props.isShowModalBank){
        //
        // }
        // if(prevProps.isShowModalAlamat!==this.props.isShowModalAlamat){
        //
        // }
        // if(prevProps.isShowModalInvesment!==this.props.isShowModalInvesment){
        //
        // }

    }
    componentWillMount(){
        localStorage.removeItem("isAlamat");
        localStorage.removeItem("isBank");
        localStorage.removeItem("isDetail");
        this.props.dispatch(getMember(`page=1`));
        this.props.dispatch(fetchKategori(`membership`));

    }
    getExcel(props){
        if(props.dataExcel.data!==undefined){
            if(props.dataExcel.data.length>0){
                let content=[];
                props.dataExcel.data.map((v,i)=>{
                    content.push([
                        v.fullname,
                        v.referral,
                        v.mobile_no,
                        parseInt(v.saldo,10),
                        parseInt(v.sponsor,10),
                        parseInt(v.pin,10),
                        v.status===0?'Tidak Aktif':'Aktif',
                    ]);
                });
                toExcel(
                    'LAPORAN MEMBER',
                    `SEMUA PERIODE`,
                    [
                        'NAMA',
                        'REFERRAL',
                        'NO.TELEPON',
                        'SALDO',
                        'SPONSOR',
                        'PIN',
                        'STATUS',
                    ],
                    content,
                )
            }
        }

    }
    printDocumentXLsx(e,param){
        e.preventDefault();
        let where=this.handleValidate();
        this.props.dispatch(getExcelMember(`perpage=${param}&${where}`));
    }
    handleSearchBy(val){
        this.setState({
            searchBy:val.value,
        })
    }
    handleStatus(val){
        this.setState({status:val.value});
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
        this.state.status= event.target.value;
        if(event.target.name==='status'){
            let where = this.handleValidate();
            this.props.dispatch(getMember(where));
        }
    }
    handleValidate(){
        let where="";
        let page = localStorage.getItem("pageMember");
        let any = this.state.any;
        let searchBy = this.state.searchBy;
        let status = this.state.status;
        if(page!==null&&page!==undefined&&page!==""){
            where+=`page=${page}`;
        }else{
            where+="page=1";
        }

        if(searchBy!==null&&searchBy!==undefined&&searchBy!==""){
            where+=`&searchby=${searchBy}`;
        }
        if(status!==null&&status!==undefined&&status!==""&&status!=="-"){
            where+=`&status=${status}`;
        }
        if(any!==null&&any!==undefined&&any!==""){
            where+="&page=1";
            where+=`&q=${any}`;
        }

        return where;

    }
    handlePage(pageNumber){
        localStorage.setItem("pageMember",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(getMember(where));

    }
    handleEvent = (event, picker) => {
        const from = moment(picker.startDate._d).format('YYYY-MM-DD');
        const to = moment(picker.endDate._d).format('YYYY-MM-DD');
        this.setState({
            dateFrom:from,
            dateTo:to
        });
    };
    handleSearch(e){
        e.preventDefault();
        let where = this.handleValidate();
        this.props.dispatch(getMember(where));
    }
    handleInvestment(e,val){
        e.preventDefault();
        // this.props.dispatch(getInvesment(`page=1&id_member=${val.id}`));
        this.setState({detail:val})
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailInvesment"));

    }
    handleAlamat(e,id){
        e.preventDefault();
        this.props.dispatch(getDetailAlamat(id));

    }
    handleBank(e,id){
        e.preventDefault();
        this.props.dispatch(getDetailBank(id));
    }
    handleUpdate(e,val){
        e.preventDefault();
        Swal.fire({
            title: 'Perhatian !!!',
            html: `anda yakin akan ${val.status===1?'Menonaktifkan':'Mengaktifkan'} ${val.fullname} ??`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Oke, ${val.status===1?'Nonaktifkan':'Aktifkan'}`,
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(putMember({status:val.status===0?'1':'0'},val.id));
            }
        })
    }


    render(){
        const headStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const numberStyle ={verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
        const {
            last_page,
            total,
            per_page,
            current_page,
            data
        } = this.props.data;

        let totSaldo=0;
        let totPin=0;
        let totSponsor=0;
        return(
            <Layout page={"Member"}>
                {this.props.isLoadingExcel||this.props.isLoading||this.props.isLoadingBank||this.props.isLoadingAlamat ?<Preloader/>:null}
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="row">
                            <div className="col-md-10">
                                <div className="row">
                                    <div className="col-12 col-xs-12 col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="">Kolom</label>
                                            <select name="searchBy" className="form-control" value={this.state.searchBy} onChange={this.handleChange}>
                                                {
                                                    this.state.searchByData.map((v,i)=>{
                                                        return(
                                                            <option key={i} value={v.value}>{v.label}</option>
                                                        );
                                                    })
                                                }
                                            </select>


                                        </div>

                                    </div>
                                    <div className="col-12 col-xs-12 col-md-3" style={{display:this.state.searchBy==='status'?'block':'none'}}>
                                        <div className="form-group">
                                            <label>Status</label>
                                            <select name="status" className="form-control" value={this.state.status} onChange={this.handleChange}>
                                                {
                                                    this.state.statusData.map((v,i)=>{
                                                        return(
                                                            <option key={i} value={v.value}>{v.label}</option>
                                                        );
                                                    })
                                                }
                                            </select>

                                        </div>
                                    </div>
                                    <div className="col-12 col-xs-12 col-md-3" style={{display:this.state.searchBy==='status'?'none':'block'}}>
                                        <div className="form-group">
                                            <label>Tulis Pencarian Disini</label>
                                            <input type="text" className="form-control" name="any" placeholder={"Tulis Pencarian Disini"} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-xs-12 col-md-2" style={{textAlign:"right"}}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary"  onClick={this.handleSearch}>
                                                <i className="fa fa-search"/>
                                            </button>
                                            <button style={{marginTop:"28px"}} className="btn btn-primary"  onClick={(e => this.printDocumentXLsx(e,per_page*last_page))}>
                                                <i className="fa fa-print"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div style={{overflowX: "auto"}}>
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                <tr>
                                    <th rowSpan="2" style={headStyle}>No</th>
                                    <th rowSpan="2" style={headStyle}>#</th>
                                    <th rowSpan="2" style={headStyle}>Nama</th>
                                    <th rowSpan="2" style={headStyle}>Referral</th>
                                    <th rowSpan="2" style={headStyle}>No.Telepon</th>
                                    <th rowSpan="2" style={headStyle}>Saldo</th>
                                    <th colSpan="2" style={headStyle}>Jumlah</th>
                                    <th rowSpan="2" style={headStyle}>Status</th>

                                </tr>
                                <tr>
                                    <th style={headStyle}>Sponsor</th>
                                    <th style={headStyle}>Pin</th>

                                </tr>
                                </thead>
                                <tbody>
                                {
                                    typeof data === 'object' ? data.length > 0 ?
                                        data.map((v, i) => {
                                        totSaldo+=parseInt(v.saldo,10);
                                        totPin+=parseInt(v.pin,10);
                                        totSponsor+=parseInt(v.sponsor,10);

                                            return (
                                                <tr key={i}>
                                                    <td style={headStyle}>{i+1 + (10 * (parseInt(current_page,10)-1))}</td>
                                                    <td style={headStyle}>
                                                        <div className="btn-group">
                                                            <UncontrolledButtonDropdown nav>
                                                                <DropdownToggle caret className="myDropdown">
                                                                    Pilihan
                                                                </DropdownToggle>
                                                                <DropdownMenu>
                                                                    <DropdownItem onClick={(e)=>this.handleInvestment(e,v)}>Invesment</DropdownItem>
                                                                    <DropdownItem onClick={(e)=>this.handleAlamat(e,v.id)}>Alamat</DropdownItem>
                                                                    <DropdownItem onClick={(e)=>this.handleBank(e,v.id)}>Bank</DropdownItem>
                                                                    <DropdownItem onClick={(e)=>this.handleUpdate(e,v)}>{v.status===0?'Aktifkan':'Non-aktifkan'}</DropdownItem>
                                                                </DropdownMenu>
                                                            </UncontrolledButtonDropdown>
                                                        </div>
                                                    </td>
                                                    <td style={headStyle}>{v.fullname}</td>
                                                    <td style={headStyle}>{v.referral}</td>
                                                    <td style={headStyle}>{v.mobile_no}</td>
                                                    <td style={numberStyle} className="txtGreen">Rp {v.saldo==='0'?0:toCurrency(parseInt(v.saldo,10))} .-</td>
                                                    <td style={numberStyle}>{v.sponsor==='0'?0:toCurrency(parseInt(v.sponsor,10))}</td>
                                                    <td style={numberStyle}>{v.pin==='0'?0:toCurrency(parseInt(v.pin,10))}</td>
                                                    <td style={headStyle}>{(v.status===0?<span className="badge badge-danger" style={{padding:'5px'}}>Tidak Aktif</span>:<span className="badge badge-success" style={{padding:'5px'}}>Aktif</span>)}</td>

                                                </tr>
                                            );
                                        })
                                        : <tr>
                                            <td colSpan={19} style={headStyle}><img src={NOTIF_ALERT.NO_DATA}/></td>
                                        </tr>
                                    : <tr>
                                        <td colSpan={19} style={headStyle}><img src={NOTIF_ALERT.NO_DATA}/></td>
                                    </tr>
                                }
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colSpan={5}>TOTAL PERHALAMAN</td>
                                    <td style={numberStyle} className="txtGreen">Rp {totSaldo===0?0:toCurrency(totSaldo)} .-</td>
                                    <td style={numberStyle}>{totSponsor===0?0:toCurrency(totSponsor)}</td>
                                    <td style={numberStyle}>{totPin===0?0:toCurrency(totPin)}</td>
                                    <td/>

                                </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div style={{"marginTop":"20px","marginBottom":"20px","float":"right"}}>
                            <Paginationq
                                current_page={current_page}
                                per_page={per_page}
                                total={total}
                                callback={this.handlePage}
                            />
                        </div>
                    </div>
                </div>

                {
                    this.props.isShowModalBank?<DetailBank
                        detail={this.props.detailBank}
                    />:null
                }
                {
                    this.props.isShowModalAlamat ? <DetailAlamat
                        detail={this.props.detailAlamat}
                    /> : null
                }
                {
                    this.props.isOpen ? <DetailInvesment
                        // data={this.props.invesment}
                        detail={this.state.detail}
                    /> : null
                }
                {/*{*/}
                    {/*localStorage.isBank === "true"?<DetailBank*/}
                    {/*detail={this.props.detailBank}*/}
                    {/*/>:null*/}
                {/*}*/}
                {/*{*/}
                    {/*localStorage.isDetail === "true"?<DetailTransaksi*/}
                        {/*detail={this.props.detailAlamat}*/}
                    {/*/>:null*/}
                {/*}*/}
            </Layout>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        isOpen:state.modalReducer,

        // isLoadingInvesment:state.memberReducer.isLoadingInvesment,
        // isShowModalInvesment:state.memberReducer.isShowModal,
        // invesment:state.memberReducer.invesment,

        isLoading: state.memberReducer.isLoading,
        data:state.memberReducer.data,

        isLoadingExcel: state.memberReducer.isLoadingExcel,
        dataExcel:state.memberReducer.excel,

        isLoadingAlamat: state.alamatReducer.isLoadingDetail,
        isShowModalAlamat: state.alamatReducer.isShowModal,
        detailAlamat:state.alamatReducer.data,

        isLoadingBank: state.bankReducer.isLoadingDetail,
        isShowModalBank: state.bankReducer.isShowModal,
        detailBank:state.bankReducer.data,



    }
}


export default connect(mapStateToProps)(IndexMember);