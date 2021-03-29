import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import {DateRangePicker} from "react-bootstrap-daterangepicker";
import Paginationq, {noImage, rangeDate, statusQ, toCurrency, toRp} from "helper";
import {NOTIF_ALERT} from "redux/actions/_constants";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Skeleton from 'react-loading-skeleton';
import moment from "moment";
import DetailAlamat from "../../modals/masterdata/member/detail_alamat"
import DetailBank from "../../modals/masterdata/member/detail_bank"
import DetailTransaksi from "../../modals/masterdata/member/detail_transaksi"
import {getMember, putMember} from "redux/actions/masterdata/member.action";
import UncontrolledButtonDropdown from "reactstrap/es/UncontrolledButtonDropdown";
import DropdownToggle from "reactstrap/es/DropdownToggle";
import DropdownMenu from "reactstrap/es/DropdownMenu";
import DropdownItem from "reactstrap/es/DropdownItem";
import {getDetailAlamat} from "redux/actions/masterdata/alamat.action";
import {getDetailBank} from "redux/actions/masterdata/bank.action";
import * as Swal from "sweetalert2";
import {fetchKategori} from "../../../../redux/actions/kategori/kategori.action";
import Select from 'react-select';
import {getExcelMember} from "../../../../redux/actions/masterdata/member.action";
import {toExcel} from "../../../../helper";
import Membership from "../../../common/membership";
import JenjangKarir from "../../../common/jenjangKarir";

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
        this.handleKarir      = this.handleKarir.bind(this);
        this.handleMembership      = this.handleMembership.bind(this);
        this.handleStatus      = this.handleStatus.bind(this);
    }
    handleKarir(val){
        this.setState({jenjangKarir:val.label});
    }
    handleMembership(val){
        this.setState({membership:val.label});
    }
    handleStatus(val){
        this.setState({status:val.value});
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.dataExcel.data!==this.props.dataExcel.data){
            this.getExcel(this.props);
        }
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
        console.log(val.value);
        this.setState({
            searchBy:val.value,
        })
    }
    componentWillReceiveProps(nextProps){
        let membership=[];
        if(nextProps.kategori.data!==undefined){
            if(nextProps.kategori.data.length>0){
                nextProps.kategori.data.map((v,i)=>{
                    membership.push({value:v.title,label:v.title});
                })
            }else {
                membership = [];
            }
            this.setState({membership_data:membership});
        }
    }
    componentWillMount(){
        localStorage.removeItem("isAlamat");
        localStorage.removeItem("isBank");
        localStorage.removeItem("isDetail");
        this.props.dispatch(getMember(`page=1`));
        this.props.dispatch(fetchKategori(`membership`));

    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    handleValidate(){
        let where="";
        let page = localStorage.getItem("pageMember");
        let dateFrom = this.state.dateFrom;
        let dateTo = this.state.dateTo;
        let any = this.state.any;
        let searchBy = this.state.searchBy;
        let membership = this.state.membership;
        let status = this.state.status;
        let jenjang_karir = this.state.jenjangKarir;
        localStorage.setItem("dateFromMember",`${dateFrom}`);
        localStorage.setItem("dateToMember",`${dateTo}`);
        if(page!==null&&page!==undefined&&page!==""){
            where+=`page=${page}`;
        }else{
            where+="page=1";
        }
        if(dateFrom!==null&&dateFrom!==undefined&&dateFrom!==""){
            where+=`&datefrom=${dateFrom}&dateto=${dateTo}`;
        }
        if(searchBy!==null&&searchBy!==undefined&&searchBy!==""){
            where+=`&searchby=${searchBy}`;
        }
        if(jenjang_karir!==null&&jenjang_karir!==undefined&&jenjang_karir!==""&&jenjang_karir!=="Semua"){
            where+=`&karir=${jenjang_karir}`;
        }
        if(membership!==null&&membership!==undefined&&membership!==""&&membership!=="Semua"){
            where+=`&membership=${membership}`;
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
        console.log(where);
        this.props.dispatch(getMember(where));
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
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Member</h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-10">
                                        <div className="row">
                                            <div className="col-12 col-xs-12 col-md-2">
                                                <div className="form-group">
                                                    <label htmlFor="">Kolom</label>
                                                    <Select
                                                        options={this.state.searchByData}
                                                        placeholder="Kolom"
                                                        onChange={this.handleSearchBy}
                                                        value={
                                                            this.state.searchByData.find(op => {
                                                                return op.value === this.state.searchBy
                                                            })
                                                        }
                                                    />

                                                </div>

                                            </div>
                                            <div className="col-12 col-xs-12 col-md-2" style={{display:this.state.searchBy==='status'?'block':'none'}}>
                                                <div className="form-group">
                                                    <label>Status</label>
                                                    <Select
                                                        options={this.state.statusData}
                                                        placeholder="Status"
                                                        onChange={this.handleStatus}
                                                        value={
                                                            this.state.statusData.find(op => {
                                                                return op.value === this.state.status
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 col-xs-12 col-md-4" style={{display:this.state.searchBy==='status'?'none':'block'}}>
                                                <div className="form-group">
                                                    <label>Tulis Pencarian Disini</label>
                                                    <input type="text" className="form-control" name="any" placeholder={"Tulis Pencarian Disini"} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-xs-6 col-md-2" style={{textAlign:"right"}}>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary"  onClick={this.handleSearch}>
                                                        <i className="fa fa-search"/>
                                                    </button>
                                                    <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary"  onClick={(e => this.printDocumentXLsx(e,per_page*last_page))}>
                                                        <i className="fa fa-print"/> {!this.props.isLoadingExcel?'Export':'loading...'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                                <div style={{overflowX: "auto"}}>
                                    <table className="table table-hover table-bordered">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" rowSpan="2" style={headStyle}>No</th>
                                            <th className="text-black" rowSpan="2" style={headStyle}>Nama</th>
                                            <th className="text-black" rowSpan="2" style={headStyle}>Referral</th>
                                            <th className="text-black" rowSpan="2" style={headStyle}>No.Telepon</th>
                                            <th className="text-black" rowSpan="2" style={headStyle}>Saldo</th>
                                            <th className="text-black" colSpan="2" style={headStyle}>Jumlah</th>
                                            <th className="text-black" rowSpan="2" style={headStyle}>Status</th>

                                        </tr>
                                        <tr>
                                            <th className="text-black" style={headStyle}>Sponsor</th>
                                            <th className="text-black" style={headStyle}>Pin</th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            !this.props.isLoading?typeof data === 'object' ? data.length > 0 ?
                                                data.map((v, i) => {
                                                totSaldo+=parseInt(v.saldo,10);
                                                totPin+=parseInt(v.pin,10);
                                                totSponsor+=parseInt(v.sponsor,10);

                                                    return (
                                                        <tr key={i}>
                                                            <td style={headStyle}>
                                                                <span className="circle">{i+1 + (10 * (parseInt(current_page,10)-1))}</span>
                                                            </td>


                                                            <td style={headStyle}>{v.fullname}</td>
                                                            <td style={headStyle}>{v.referral}</td>
                                                            <td style={headStyle}>{v.mobile_no}</td>

                                                            <td style={numberStyle}>Rp {v.saldo==='0'?0:toCurrency(parseInt(v.saldo,10))} .-</td>
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
                                                :(()=>{
                                                    let container =[];
                                                    for(let x=0; x<10; x++){
                                                        container.push(
                                                            <tr key={x}>
                                                                <td>{<Skeleton/>}</td>
                                                                <td>{<Skeleton/>}</td>
                                                                <td>{<Skeleton/>}</td>
                                                                <td>{<Skeleton/>}</td>
                                                                <td>{<Skeleton/>}</td>
                                                                <td>{<Skeleton/>}</td>
                                                                <td>{<Skeleton/>}</td>
                                                                <td>{<Skeleton/>}</td>
                                                            </tr>
                                                        )
                                                    }
                                                    return container;
                                                })()

                                        }
                                        </tbody>
                                        <tfoot style={{backgroundColor:"#EEEEEE"}}>
                                        <tr>
                                            <td colSpan={4}>TOTAL PERHALAMAN</td>
                                            <td style={numberStyle}>Rp {totSaldo===0?0:toCurrency(totSaldo)} .-</td>
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
                    </div>
                </div>
                {
                    localStorage.isAlamat === "true" ? <DetailAlamat
                        detail={this.props.detailAlamat}
                    /> : null
                }
                {
                    localStorage.isBank === "true"?<DetailBank
                    detail={this.props.detailBank}
                    />:null
                }
                {
                    localStorage.isDetail === "true"?<DetailTransaksi
                        detail={this.props.detailAlamat}
                    />:null
                }
            </Layout>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        isLoading: state.memberReducer.isLoading,
        isLoadingExcel: state.memberReducer.isLoadingExcel,
        isOpen:state.modalReducer,
        data:state.memberReducer.data,
        dataExcel:state.memberReducer.excel,
        detailAlamat:state.alamatReducer.data,
        detailBank:state.bankReducer.data,
        kategori:state.kategoriReducer.data,


    }
}


export default connect(mapStateToProps)(IndexMember);