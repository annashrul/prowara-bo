import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import Skeleton from 'react-loading-skeleton';
import {NOTIF_ALERT} from "../../../redux/actions/_constants";
import Paginationq,{toCurrency} from "../../../helper";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import FormBarangReward from "../modals/reward/form_barang_reward"
import * as Swal from "sweetalert2";
import {deleteBarangReward, fetchBarangReward} from "../../../redux/actions/paket/barang_reward.action";
import BgAuth from "assets/logo.png"
import moment from "moment";

class IndexBarangReward extends Component{
    constructor(props){
        super(props);
        this.state={
            any:'',
            detail:{},
            status:'',

        };
        this.handleChange   = this.handleChange.bind(this);
        this.handleModal      = this.handleModal.bind(this);
        this.handleDelete      = this.handleDelete.bind(this);
        this.handleSearch      = this.handleSearch.bind(this);
        this.handlePage      = this.handlePage.bind(this);
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps);
    }
    handlePage(num){
        let where = this.handleValidate();
        where+=`&page=${num}`;
        this.props.dispatch(fetchBarangReward(where));
    }
    handleValidate(){
        this.setState({
            isLoading:true
        });
        let where=`perpage=9`;
        let any = this.state.any;
        if(any!==null&&any!==undefined&&any!==""){
            where+=`&q=${any}`;
        }
        return where;

    }
    componentWillMount(){
        let where = this.handleValidate();
        this.props.dispatch(fetchBarangReward(where));
    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    handleModal(e,i){
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formBarangReward"));
        if(i!==''){
            this.setState({detail:{
                id:this.props.data.data[i].id,
                title:this.props.data.data[i].title,
                caption:this.props.data.data[i].caption,
                id_karir:this.props.data.data[i].id_karir,
                gambar:this.props.data.data[i].gambar,

            }});
        }
        else{
            this.setState({detail:{id:''}});

        }
    }
    handleDelete(e,id){
        e.preventDefault();
        Swal.fire({
            title: 'Perhatian !!!',
            html:`anda yakin akan menghapus data ini ??`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Oke, Hapus`,
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(deleteBarangReward(id));

            }
        })
    }
    handleSearch(e){
        e.preventDefault();
        let where = this.handleValidate();
        this.props.dispatch(fetchBarangReward(where));
    }

    render(){
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
        console.log(localStorage.getItem("logos"));
        return(
            <Layout page={"Barang Reward"}>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Barang Reward</h5>
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
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            {
                                !this.props.isLoading?typeof data==='object'?data.length>0?data.map((v,i)=>{
                                    return(
                                        <div className="col-md-6 box-margin" key={i}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="mb-3">
                                                        <div className="row align-items-center">
                                                            <div className="col-auto">
                                                                <a href="#!" className="avatar">
                                                                    <img src={v.gambar} alt="..." className="product-thumb" style={{height:"80px",objectFit:"contain"}}/>
                                                                </a>
                                                            </div>
                                                            <div className="col ml-n2">
                                                                <h4 className="card-title mb-1">
                                                                    {v.title}
                                                                </h4>
                                                                <p className="card-text txtGreen">
                                                                    <span className="fe fe-clock"/> <time dateTime="2019-08-24">{v.karir}</time>
                                                                </p>
                                                            </div>

                                                            <div className="col-auto">
                                                                <button style={{marginRight:"5px"}} className={"btn btn-primary"} onClick={(e)=>this.handleModal(e,i)} ><i className={"fa fa-pencil"}/></button>
                                                                <button className={"btn btn-danger"} onClick={(e)=>this.handleDelete(e,v.id)}><i className={"fa fa-trash"}/></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="mb-3">{v.caption} </p>
                                                    <p className="card-text text-right txtRed">
                                                        <i className="fa fa-clock-o"/> <time dateTime="2019-08-24">{moment(v.created_at).startOf('day').fromNow()}</time>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                    }): <div className="row align-items-center"><img src={NOTIF_ALERT.NO_DATA} alt=""/></div>: <div className="row align-items-center"><img className={"text-center"} src={NOTIF_ALERT.NO_DATA} alt=""/></div>:
                                    (()=>{
                                        let container =[];
                                        for(let x=0; x<8; x++){
                                            container.push(
                                                <div className="col-md-6" key={x}>
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="mb-3">
                                                                <div className="row align-items-center">
                                                                    <div className="col-auto">
                                                                        <a href="#!" className="avatar">
                                                                            <Skeleton circle={true} height={40} width={40}/>
                                                                        </a>
                                                                    </div>
                                                                    <div className="col ml-n2">
                                                                        <h4 className="card-title mb-1">
                                                                            <Skeleton/>
                                                                        </h4>
                                                                        <p className="card-text">
                                                                            <Skeleton/>
                                                                        </p>
                                                                    </div>


                                                                </div>
                                                            </div>
                                                            <p className="mb-3"><Skeleton/> </p>
                                                        </div>
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
                    this.props.isOpen===true?<FormBarangReward
                        detail={this.state.detail}
                    />:null
                }
            </Layout>
        );

    }
}
const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        isOpen:state.modalReducer,
        isLoading: state.barangRewardReducer.isLoading,
        data:state.barangRewardReducer.data,
    }
}


export default connect(mapStateToProps)(IndexBarangReward);