import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import {DateRangePicker} from "react-bootstrap-daterangepicker";
import Paginationq, {noImage, rangeDate, statusQ, toCurrency} from "../../../helper";
import moment from "moment";
import {deletePaket, detailPaket, fetchPaket} from "../../../redux/actions/paket/paket.action";
import {NOTIF_ALERT} from "../../../redux/actions/_constants";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import FormPaket from "../modals/paket/form_paket"
import Skeleton from 'react-loading-skeleton';
import * as Swal from "sweetalert2";
import {BrowserView, MobileView,isBrowser, isMobile} from 'react-device-detect';

class IndexPaket extends Component{
    constructor(props){
        super(props);
        this.state={
            isShow:false,
            detail:{},
            status:"",
            any:"",
            tipe:'aktivasi',
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD")
        };
        this.handleEvent    = this.handleEvent.bind(this);
        this.handleChange   = this.handleChange.bind(this);
        this.handlePage     = this.handlePage.bind(this);
        this.handleSearch   = this.handleSearch.bind(this);
        this.handleModal      = this.handleModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleTipe = this.handleTipe.bind(this);

    }
    componentWillMount(){
        this.props.dispatch(fetchPaket(`page=1&tipe=${this.state.tipe}`));
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    handleTipe(e,type){
        e.preventDefault();
        this.setState({
            tipe: type
        })
        this.props.dispatch(fetchPaket(`page=1&tipe=${type}`));
    }

    handleValidate(){
        let where="";
        let page = localStorage.getItem("pagePaket");
        let dateFrom = this.state.dateFrom;
        let dateTo = this.state.dateTo;
        let status = this.state.status;
        let any = this.state.any;
        localStorage.setItem("dateFromPaket",`${dateFrom}`);
        localStorage.setItem("dateToPaket",`${dateTo}`);

        if(page!==null&&page!==undefined&&page!==""){
            where+=`page=${page}&tipe=${this.state.tipe}`;
        }else{
            where+=`page=1&tipe=${this.state.tipe}`;
        }
        if(dateFrom!==null&&dateFrom!==undefined&&dateFrom!==""){
            where+=`&datefrom=${dateFrom}&dateto=${dateTo}`;
        }
        if(status!==null&&status!==undefined&&status!==""){
            where+=`&status=${status}`;
        }
        if(any!==null&&any!==undefined&&any!==""){
            where+=`&q=${any}`;
        }
        return where;

    }

    handlePage(pageNumber){
        localStorage.setItem("pagePaket",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(fetchPaket(where));

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
        this.props.dispatch(fetchPaket(where));
    }

    handleModal(e,param){
        this.setState({isShow:true,detail:{id:param}});
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formPaket"));
        // this.props.dispatch(fetchKategori("membership"));
        if(param!==''){
            this.props.dispatch(detailPaket(param));
        }
    }
    handleDelete(e,id){
        e.preventDefault();
        Swal.fire({
            title: 'Perhatian !!!',
            html:`anda yakin akan menghapus paket ini ??`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Oke, Hapus`,
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(deletePaket(id));
            }
        })
    }


    render(){
        const {
            total,
            per_page,
            current_page,
            data
        } = this.props.data;
        const headStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const numberStyle ={verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
        const stringStyle ={verticalAlign: "middle", textAlign: "left",whiteSpace: "nowrap"};
        let jmlBarang=0;
        let jmlPin=0;
        let jmlPV=0;
        return(
            <Layout page={"Paket"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Paket</h5>
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
                                            <label>Periode {this.props.isOpen}</label>
                                            <DateRangePicker
                                                autoUpdateInput={true} showDropdowns={true} style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onApply={this.handleEvent}>
                                                <input type="text" readOnly={true} className="form-control" value={`${this.state.dateFrom} to ${this.state.dateTo}`}/>
                                            </DateRangePicker>
                                        </div>
                                    </div>
                                   
                                    <div className="col-9 col-xs-9 col-md-3">
                                        <div className="form-group">
                                            <label>Type something here ..</label>
                                            <input type="text" className="form-control" name="any" placeholder={"search by amount,wallet address"} defaultValue={this.state.any} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                        </div>
                                    </div>
                                    <div className="col-3 col-xs-3 col-md-4">
                                        <BrowserView>
                                            <div className="form-group">
                                                <button style={{marginTop:"27px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                                <button style={{marginTop:"27px",marginLeft:"5px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleModal(e,'')}><i className="fa fa-plus"/></button>
                                            </div>
                                        </BrowserView>
                                        <MobileView>
                                            <div className="form-group text-right">
                                                <button style={{marginTop:"27px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                                <button style={{marginTop:"27px"}} type="button" className="btn-fixed-bottom btn btn-primary" onClick={(e)=>this.handleModal(e,'')}><i className="fa fa-plus"/></button>
                                            </div>
                                        </MobileView>
                                    </div>
                                    <div className="col-9 col-xs-9 col-md-3">
                                        <div className="form-group text-right">
                                                <button style={{marginTop:"27px"}} type="button" className={this.state.tipe==='aktivasi'?"btn btn-success mb-2 mr-2":"btn btn-outline-success mb-2 mr-2"} onClick={(e)=>this.handleTipe(e,'aktivasi')}>Aktivasi</button>
                                                <button style={{marginTop:"27px"}} type="button" className={this.state.tipe==='ro'?"btn btn-success mb-2 mr-2":"btn btn-outline-success mb-2 mr-2"}  onClick={(e)=>this.handleTipe(e,'ro')}>Repeat Order</button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{overflowX: "auto",zoom:"80%"}}>
                                    <table className="table table-hover">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" style={headStyle}>NO</th>
                                            <th className="text-black" style={headStyle}>#</th>
                                            <th className="text-black" style={headStyle}>Gambar</th>
                                            <th className="text-black" style={headStyle}>Nama</th>
                                            <th className="text-black" style={headStyle}>Harga</th>
                                            <th className="text-black" style={headStyle}>PPN (%)</th>
                                            {
                                                this.state.tipe!=='ro'?(<th className="text-black" style={headStyle}>Membership</th>):''
                                            }
                                            {
                                                this.state.tipe!=='ro'?(<th className="text-black" style={headStyle}>PV</th>):''
                                            }
                                            <th className="text-black" style={headStyle}>Isi Paket</th>
                                            <th className="text-black" style={headStyle}>TIPE</th>
                                            <th className="text-black" style={headStyle}>STATUS</th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            typeof data === 'object' ? data.length > 0 ?
                                                data.map((v, i) => {
                                                jmlBarang = jmlBarang+parseInt(v.jumlah_barang);
                                                jmlPin = jmlPin+parseInt(v.jumlah_pin);
                                                jmlPV = jmlPV+parseInt(v.point_volume);
                                                    return (
                                                        <tr key={i}>
                                                            <td style={headStyle}>
                                                                <span className="circle">{i+1 + (10 * (parseInt(current_page,10)-1))}</span>
                                                            </td>
                                                            <td style={headStyle}>
                                                                <button style={{marginRight:"5px"}} className={"btn btn-danger btn-sm"} onClick={(e)=>this.handleDelete(e,v.id)}><i className={"fa fa-trash"}/></button>
                                                                <button style={{marginRight:"5px"}} className={"btn btn-info btn-sm"} onClick={(e)=>this.handleModal(e,v.id)}><i className={"fa fa-pencil"}/></button>
                                                            </td>
                                                            <td style={headStyle}>
                                                                <img className="img-fluid" src={v.foto} style={{height:"30px",width:"30px"}} onError={(e)=>{e.target.onerror = null; e.target.src=`${noImage()}`}} alt="member image"/>

                                                                {/*<img className="img-fluid" style={{height:"30px",width:"30px"}} src={NOTIF_ALERT.NO_DATA}/>*/}
                                                            </td>
                                                            <td style={headStyle}>{v.title}</td>
                                                            <td style={headStyle}>Rp {toCurrency(v.harga)}</td>
                                                            <td style={headStyle}>{v.ppn}</td>
                                                            {
                                                                this.state.tipe!=='ro'?(<td style={headStyle}>{v.kategori}</td>):''
                                                            }
                                                            {
                                                                this.state.tipe!=='ro'?(<td style={headStyle}>{v.point_volume}</td>):''
                                                            }
                                                            
                                                            <td style={headStyle}>{v.jumlah_barang} Item</td>
                                                            <td style={headStyle}>{v.type}</td>
                                                            <td style={headStyle}>{statusQ(v.status)}</td>
                                                        </tr>
                                                    );
                                                })
                                                : <tr>
                                                    <td colSpan={12} style={headStyle}><img src={NOTIF_ALERT.NO_DATA}/></td>
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
                    this.props.isOpen===true?<FormPaket
                        detail={this.state.detail}
                        paketDetail={this.props.dataDetail}
                        // barang={this.props.barang}
                        kategori={this.props.kategori}
                    />:null
                }
                {/*<FormPaket/>*/}
            </Layout>
        );



    }
}
const mapStateToProps = (state) => {
    return {
        isLoading: state.paketReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.paketReducer.data,
        dataDetail:state.paketReducer.detail,
    }
}


export default connect(mapStateToProps)(IndexPaket);