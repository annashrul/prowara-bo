import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import Paginationq, {rangeDate, toCurrency, toRp} from "../../../helper";
import {NOTIF_ALERT} from "../../../redux/actions/_constants";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import Skeleton from 'react-loading-skeleton';
import {getPin} from "../../../redux/actions/paket/pin.action";
import moment from "moment";
import GeneratePin from "../modals/pin/generate_pin"


class IndexPin extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            any:"",
            type:0,
            last:'',
            dateFrom:moment(new Date()).format("yyyy-MM-DD"),
            dateTo:moment(new Date()).format("yyyy-MM-DD")
        };
        this.handleChange   = this.handleChange.bind(this);
        this.handlePage     = this.handlePage.bind(this);
        this.handleSearch   = this.handleSearch.bind(this);
        this.handleAdd      = this.handleAdd.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        const path = nextProps.match.params.pin
        if(path!==this.state.last){
            console.log('pin!',path);
            if(path==='ro'){
                this.setState({type:1,last:path})
                this.props.dispatch(getPin(`page=1&type=1`));
            }else{
                this.setState({type:0,last:path})
                this.props.dispatch(getPin(`page=1&type=0`));
            }

        }
    }

    componentDidMount() {
        const path = this.props.match.params.pin
        if (path === 'ro') {
            this.setState({
                type: 1,
                last: path
            })
            this.props.dispatch(getPin(`page=1&type=1`));
        } else {
            this.setState({
                type: 0,
                last: path
            })
            this.props.dispatch(getPin(`page=1&type=0`));
        }
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleValidate(){
        let where="";
        let page = localStorage.getItem("pagePin");
        let any = this.state.any;

        if(page!==null&&page!==undefined&&page!==""){
            where+=`page=${page}`;
        }else{
            where+="page=1";
        }

        if(any!==null&&any!==undefined&&any!==""){
            localStorage.setItem('pagePin',1)
            where= "page=1";
            where+=`&q=${any}`;
        }
        return where += `&type=${this.state.type}`;

    }

    handlePage(pageNumber){
        localStorage.setItem("pagePin",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(getPin(where));

    }
   
    handleSearch(e){
        e.preventDefault();
        let where = this.handleValidate();
        this.props.dispatch(getPin(where));
    }

    handleAdd(e){
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("generatePin"));
        this.setState({detail:{}});
    }


    render(){
        const columnStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        const {
            total,
            per_page,
            current_page,
            data
        } = this.props.data;


        return(
            <Layout page={"PIN"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">PIN</h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 box-margin">
                        <div className="card">
                            <div className="card-body">
                                <div className="row" style={{zoom:"90%"}}>
                                    <div className="col-12 col-xs-12 col-md-3">
                                        <div className="form-group">
                                            <label>Cari</label>
                                            <input type="text" className="form-control" name="any" placeholder={"cari disini"} defaultValue={this.state.any} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                        </div>
                                    </div>
                                    <div className="col-2 col-xs-2 col-md-4">
                                        <div className="form-group">
                                            <button style={{marginTop:"27px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                            <button style={{marginTop:"27px",marginLeft:"5px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleAdd(e)}><i className="fa fa-plus"/> Generate PIN</button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{overflowX: "auto",zoom:"80%"}}>
                                    <table className="table table-hover">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" style={columnStyle}>No</th>
                                            <th className="text-black" style={columnStyle}>Kode</th>
                                            <th className="text-black" style={columnStyle}>Pemilik</th>
                                            <th className="text-black" style={columnStyle}>Harga</th>
                                            <th className="text-black" style={columnStyle}>Tipe</th>
                                            <th className="text-black" style={columnStyle}>Status</th>
                                            <th className="text-black" style={columnStyle}>Tanggal Dibuat</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            typeof data === 'object' ? data.length > 0 ?
                                                data.map((v, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td style={columnStyle}>
                                                                <span className="circle">{i+1 + (10 * (parseInt(current_page,10)-1))}</span>
                                                            </td>
                                                            <td style={columnStyle}>{v.kode}</td>
                                                            <td style={columnStyle}>{v.pemilik}</td>
                                                            <td style={columnStyle}>Rp {toCurrency(v.harga)} .-</td>
                                                            <td style={columnStyle}>{v.type===0?<span className='btn btn-success btn-sm'>AKTIVASI</span>:<span className='btn btn-dark btn-sm'>RO</span>}</td>
                                                            <td style={columnStyle}>{(v.status===0?<span className='btn btn-success btn-sm'>TERSEDIA</span>:(v.status===1?<span className='btn btn-info btn-sm'>DIBELI</span>:(v.status===2?<span className='btn btn-dark btn-sm'>TELAH DIGUNAKAN</span>:<span className='btn btn-warning btn-sm'>PENDING TRX</span>)))}</td>
                                                            <td style={columnStyle}>{moment(v.created_at).locale('id').format("ddd, Do MMM YYYY hh:mm:ss")}</td>
                                                        </tr>
                                                    );
                                                })
                                                : <tr>
                                                    <td colSpan={9} style={columnStyle}><img src={NOTIF_ALERT.NO_DATA}/></td>
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
                    this.props.isOpen===true?<GeneratePin
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
        data:state.pinReducer.data,
    }
}


export default connect(mapStateToProps)(IndexPin);