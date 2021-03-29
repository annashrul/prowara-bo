import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import {DateRangePicker} from "react-bootstrap-daterangepicker";
import Paginationq, {noImage, rangeDate, statusQ, toCurrency, toRp} from "helper";
import {NOTIF_ALERT} from "redux/actions/_constants";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Skeleton from 'react-loading-skeleton';
import moment from "moment";
import * as Swal from "sweetalert2";
import {getListApproval,putMember} from "redux/actions/masterdata/member.action";


class IndexUserList extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            any:"",
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD")
        };
        this.handleEvent    = this.handleEvent.bind(this);
        this.handleChange   = this.handleChange.bind(this);
        this.handlePage     = this.handlePage.bind(this);
        this.handleSearch   = this.handleSearch.bind(this);
        this.handleApproval = this.handleApproval.bind(this);

    }

    componentWillMount(){
        this.props.dispatch(getListApproval(`page=1`));
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleValidate(){
        let where="";
        let page = localStorage.getItem("pageUserList");
        let dateFrom = this.state.dateFrom;
        let dateTo = this.state.dateTo;
        let any = this.state.any;
        localStorage.setItem("dateFromUserList",`${dateFrom}`);
        localStorage.setItem("dateToUserList",`${dateTo}`);

        if(page!==null&&page!==undefined&&page!==""){
            where+=`page=${page}`;
        }else{
            where+="page=1";
        }
        if(dateFrom!==null&&dateFrom!==undefined&&dateFrom!==""){
            where+=`&datefrom=${dateFrom}&dateto=${dateTo}`;
        }

        if(any!==null&&any!==undefined&&any!==""){
            where+=`&q=${any}`;
        }
        return where;

    }

    handlePage(pageNumber){
        localStorage.setItem("pageUserList",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(getListApproval(where));

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
        this.props.dispatch(getListApproval(where));
    }

    handlePaymentSlip(e,title,image) {
        e.preventDefault();
        Swal.fire({
            title: 'KTP',
            text: title,
            imageUrl: image,
            imageAlt: 'gambar tidak tersedia',
            showClass   : {popup: 'animate__animated animate__fadeInDown'},
            hideClass   : {popup: 'animate__animated animate__fadeOutUp'},
        })
    }

    handleApproval(e,id,status){
        e.preventDefault();
        Swal.fire({
            title: 'Perhatian !!!',
            html: `Apakah anda yakin akan ${status==0?'Menolak':'Memverifikasi'} KTP member ini?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Oke, ${status==0?'Tolak':'Verifikasi'}`,
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(putMember({
                    valid_id_card: status
                }, id));
            }
        })
    }

    render(){
        console.log("this.props.approval", this.props.approval);

        const headStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const {
            total,
            per_page,
            current_page,
            data
        } = this.props.approval;
        return(
            <Layout page={"User List"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Approval KTP Member</h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="card">
                            <div className="card-body">
                                <div className="row" style={{zoom:"90%"}}>
                                    <div className="col-6 col-xs-6 col-md-2">
                                        <div className="form-group">
                                            <label>Periode </label>
                                            <DateRangePicker
                                                autoUpdateInput={true} showDropdowns={true} style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onApply={this.handleEvent}>
                                                <input type="text" readOnly={true} className="form-control" value={`${this.state.dateFrom} to ${this.state.dateTo}`}/>
                                            </DateRangePicker>
                                        </div>
                                    </div>

                                    <div className="col-12 col-xs-12 col-md-3">
                                        <div className="form-group">
                                            <label>Cari</label>
                                            <input type="text" className="form-control" name="any" placeholder={"cari disini"} defaultValue={this.state.any} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                        </div>
                                    </div>
                                    <div className="col-2 col-xs-2 col-md-4">
                                        <div className="form-group">
                                            <button style={{marginTop:"27px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{overflowX: "auto",zoom:"80%"}}>
                                    <table className="table table-hover">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" style={headStyle}>NO</th>
                                            <th className="text-black" style={headStyle}>#</th>
                                            <th className="text-black" style={headStyle}>KTP</th>
                                            <th className="text-black" style={headStyle}>Nama</th>
                                            <th className="text-black" style={headStyle}>No. HP</th>
                                            <th className="text-black" style={headStyle}>Status</th>
                                            <th className="text-black" style={headStyle}>Tanggal Pengajuan</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.props.isLoading?(()=>{
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
                                                            </tr>
                                                        )
                                                    }
                                                    return container;
                                                })():
                                            typeof data === 'object' && data.length > 0 ?
                                                data.map((v, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td style={headStyle}>
                                                                <span className="circle">{i+1 + (10 * (parseInt(current_page,10)-1))}</span>
                                                            </td>
                                                            <td style={headStyle}>
                                                                <button onClick={(e)=>this.handleApproval(e,v.id,1)} className={"btn btn-success btn-sm"} style={{marginRight:"10px"}}><i className={"fa fa-check"}/></button>
                                                                <button onClick={(e)=>this.handleApproval(e,v.id,2)} className={"btn btn-danger btn-sm"}><i className={"fa fa-close"}/></button>
                                                            </td>
                                                            <td>
                                                                <img src={v.id_card} width={100} onClick={event=>this.handlePaymentSlip(event,v.full_name,v.id_card)} style={{cursor:'pointer'}} />    
                                                            </td>
                                                            <td style={headStyle}>{v.full_name}</td>
                                                            <td style={headStyle}>{v.mobile_no}</td>
                                                            <td style={headStyle}>{v.valid_id_card===0?<span className="badge badge-danger" style={{padding:'10px'}}>Belum divalidasi</span>:<span className="badge badge-success" style={{padding:'10px'}}>Terverifikasi</span>}</td>
                                                            <td style={headStyle}>{moment(v.updated_at).locale('id').format("ddd, Do MMM YYYY hh:mm:ss")}</td>
                                                        </tr>
                                                    );
                                                })
                                                : <tr>
                                                    <td colSpan={7} style={headStyle}><img src={NOTIF_ALERT.NO_DATA}/></td>
                                                </tr>
                                                

                                        }
                                        </tbody>
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
                
            </Layout>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        isLoading: state.memberReducer.isLoading,
        isOpen:state.modalReducer,
        approval: state.memberReducer.approval,
    }
}


export default connect(mapStateToProps)(IndexUserList);