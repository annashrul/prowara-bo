import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import Paginationq, {myDate, rangeDate, toCurrency, toRp} from "../../../helper";
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

    }
    componentWillMount(){
        this.props.dispatch(getPin(`page=1&perpage=12`));

    }


    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleValidate(){
        let where="perpage=12";
        let page = localStorage.getItem("pagePin");
        let any = this.state.any;

        if(page!==null&&page!==undefined&&page!==""){
            where+=`&page=${page}`;
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
            data,
            total_pin
        } = this.props.data;
        console.log(total_pin);

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
                        <div className="row">
                            <div className="col-md-4">
                                <div className="social-widget">
                                    <div className="bg-primary p-3 text-center text-white font-30">
                                        TERSEDIA <br/>
                                        {total_pin!==undefined?total_pin.tersedia:<Skeleton/>}
                                    </div>

                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="social-widget">
                                    <div className="bg-dark p-3 text-center text-white font-30">
                                        DIMILIKI MEMBER <br/>
                                        {total_pin!==undefined?total_pin.dimiliki_member:<Skeleton/>}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="social-widget">
                                    <div className="bg-danger p-3 text-center text-white font-30">
                                        DIPAKAI <br/>
                                        {total_pin!==undefined?total_pin.dipakai:<Skeleton/>}
                                    </div>

                                </div>
                            </div>
                        </div>
                        <br/>

                        <div className="row">
                            {
                                !this.props.isLoading? typeof data === 'object' ? data.length > 0 ?

                                    data.map((v, i) => {
                                        let status = '';
                                        let colStatus = '';
                                        if(v.status===0){status='Tersedia';colStatus='text-primary';}
                                        if(v.status===1){status='Dimiliki Member';colStatus='text-warning';}
                                        if(v.status===2){status='Dipakai';colStatus='text-danger';}
                                        return (
                                            <div key={i} className="col-12 col-sm-6 col-xl-3 box-margin">
                                                <div className="card widget-new-content p-3 bg-white">
                                                    <div className="widget---stats d-flex justify-content-between align-items-center mb-15">
                                                        <div className="widget---content-text">
                                                            <h6>{v.kode}</h6>
                                                            <p className={`mb-0 ${colStatus}`}>{status}</p>
                                                        </div>
                                                        <h6 className={`mb-0 txtGreen`}>{toCurrency(v.price)}</h6>
                                                    </div>
                                                    <div className="progress h-5">
                                                        <div className="progress-bar w-100 bg-dark" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"/>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                    : <tr>
                                        <td colSpan={9} style={columnStyle}><img src={NOTIF_ALERT.NO_DATA}/></td>
                                    </tr>
                                    : <tr>
                                        <td colSpan={9} style={columnStyle}><img src={NOTIF_ALERT.NO_DATA}/></td>
                                    </tr>
                                    :(()=>{
                                        let container =[];
                                        for(let x=0; x<10; x++){
                                            container.push(
                                                <div key={x} className="col-12 col-sm-6 col-xl-4 box-margin">
                                                    <div className="card widget-new-content p-3 bg-white">
                                                        <span className="progress-description mt-2"><Skeleton width={100}/></span>
                                                        <span className="progress-description mt-2"><Skeleton width={200}/></span>
                                                        <span className="progress-description mt-2"><Skeleton/></span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return container;
                                    })()

                            }
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