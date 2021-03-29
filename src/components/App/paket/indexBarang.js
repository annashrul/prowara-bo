import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import {DateRangePicker} from "react-bootstrap-daterangepicker";
import Paginationq, {rangeDate, toCurrency, toRp} from "../../../helper";
import moment from "moment";
import {NOTIF_ALERT} from "../../../redux/actions/_constants";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import {deleteBarang, fetchBarang} from "../../../redux/actions/paket/barang.action";
import Skeleton from 'react-loading-skeleton';
import FormBarang from "../modals/barang/form_barang"
import FormAdjusment from "../modals/barang/form_adjusment"
import * as Swal from "sweetalert2";

class IndexBarang extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            any:"",
            isPage:'',
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD")
        };
        this.handleEvent    = this.handleEvent.bind(this);
        this.handleChange   = this.handleChange.bind(this);
        this.handlePage     = this.handlePage.bind(this);
        this.handleSearch   = this.handleSearch.bind(this);
        this.handleModal      = this.handleModal.bind(this);
        this.handleDelete      = this.handleDelete.bind(this);
        this.handleAdjusment      = this.handleAdjusment.bind(this);

    }
    componentDidMount(){
        console.log('componentDidMount');

    }
    componentWillMount(){
        console.log('componentWillMount');
        this.props.dispatch(fetchBarang(`page=1`));
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleValidate(){
        let where="";
        let page = localStorage.getItem("pageBarang");
        let dateFrom = this.state.dateFrom;
        let dateTo = this.state.dateTo;
        let any = this.state.any;
        localStorage.setItem("dateFromBarang",`${dateFrom}`);
        localStorage.setItem("dateToBarang",`${dateTo}`);

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
        localStorage.setItem("pageBarang",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(fetchBarang(where));

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
        this.props.dispatch(fetchBarang(where));
    }
    getDetail(i){
        return {
            id:this.props.data.data[i].id,
            title:this.props.data.data[i].title,
            stock:this.props.data.data[i].stock_barang,
            status:this.props.data.data[i].status,
            harga:this.props.data.data[i].harga,
            ppn:this.props.data.data[i].ppn,
            satuan:this.props.data.data[i].satuan,
            berat:this.props.data.data[i].berat,
        };
    }
    handleModal(e,i){
        const bool = !this.props.isOpen;
        this.setState({isPage:'formBarang'});
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formBarang"));
        if(i!==''){
            this.setState({detail:this.getDetail(i)});
        }
        else{
            this.setState({detail:{id:''}});

        }
    }
    handleAdjusment(e,i){
        const bool = !this.props.isOpen;
        this.setState({isPage:'formAdjusment'});
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formAdjusment"));
        this.setState({detail:this.getDetail(i)});
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
                this.props.dispatch(deleteBarang(id));

            }
        })
    }


    render(){
        const headStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const numberStyle ={verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
        const stringStyle ={verticalAlign: "middle", textAlign: "left",whiteSpace: "nowrap"};
        const {
            total,
            per_page,
            offset,
            to,
            last_page,
            current_page,
            from,
            data
        } = this.props.data;


        return(
            <Layout page={"Barang"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Barang</h5>
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
                                            <input type="text" className="form-control" name="any" placeholder={"cari disini"} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                        </div>
                                    </div>
                                    <div className="col-2 col-xs-2 col-md-4">
                                        <div className="form-group">
                                            <button style={{marginTop:"27px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                            <button style={{marginTop:"27px",marginLeft:"5px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleModal(e,'')}><i className="fa fa-plus"/></button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{overflowX: "auto",zoom:"80%"}}>
                                    <table className="table table-hover">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" style={headStyle}>NO</th>
                                            <th className="text-black" style={headStyle}>#</th>
                                            <th className="text-black" style={headStyle}>NAMA</th>
                                            <th className="text-black" style={headStyle}>HARGA</th>
                                            <th className="text-black" style={headStyle}>STOK</th>
                                            <th className="text-black" style={headStyle}>SATUAN</th>
                                            <th className="text-black" style={headStyle}>BERAT</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            typeof data === 'object' ? data.length > 0 ?
                                                data.map((v, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td style={headStyle}>
                                                                <span className="circle">{i+1 + (10 * (parseInt(current_page,10)-1))}</span>
                                                            </td>
                                                            <td style={headStyle}>
                                                                <button style={{marginRight:"5px"}} className={"btn btn-danger btn-sm"} onClick={(e)=>this.handleDelete(e,v.id)}><i className={"fa fa-trash"}/></button>
                                                                <button style={{marginRight:"5px"}} className={"btn btn-info btn-sm"} onClick={(e)=>this.handleModal(e,i)}><i className={"fa fa-pencil"}/></button>
                                                                <button style={{marginRight:"5px"}} className={"btn btn-secondary btn-sm"} onClick={(e)=>this.handleAdjusment(e,i)}><i className={"fa fa-tasks"}/></button>
                                                            </td>
                                                            <td style={headStyle}>{v.title}</td>
                                                            <td style={headStyle}>Rp {toCurrency(v.harga)} .-</td>
                                                            <td style={headStyle}>{toCurrency(v.stock_barang)}</td>
                                                            <td style={headStyle}>{v.satuan}</td>
                                                            <td style={headStyle}>{toCurrency(v.berat)} (gram)</td>
                                                        </tr>
                                                    );
                                                })
                                                : <tr>
                                                    <td colSpan={7} style={headStyle}><img src={NOTIF_ALERT.NO_DATA}/></td>
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
                    this.state.isPage==='formBarang'?<FormBarang
                        detail={this.state.detail}
                    />:null
                }
                {
                    this.state.isPage==='formAdjusment'?<FormAdjusment
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
        isLoading: state.barangReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.barangReducer.data,
    }
}


export default connect(mapStateToProps)(IndexBarang);