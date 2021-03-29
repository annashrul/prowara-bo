import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import Paginationq from "helper";
import Skeleton from 'react-loading-skeleton';
import moment from "moment";
import {putContent, getContent} from "redux/actions/konten/konten.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import FormTestimoni from "../modals/konten/testimoni/form_testimoni"
import DetailTestimoni from "../modals/konten/testimoni/detailTestimoni"
import * as Swal from "sweetalert2";
import {NOTIF_ALERT} from "../../../redux/actions/_constants";

moment.locale('id');// en

class IndexBerita extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            any:"",
            title:'',
            id:'',
            perpage:10,
            scrollPage:0,
            isScroll:false,
            isModal:'form',
        };
        this.handleChange   = this.handleChange.bind(this);
        this.handlePage     = this.handlePage.bind(this);
        this.handleSearch   = this.handleSearch.bind(this);
        this.handleApprove   = this.handleApprove.bind(this);
        this.handleDetail   = this.handleDetail.bind(this);
        // this.handleData   = this.handleData.bind(this);

    }

    componentWillReceiveProps(nextProps){
       if(this.state.isScroll===true){
           let perpage=this.state.perpage;
           if(nextProps.kategori.data!==undefined){
               if(nextProps.kategori.data.length === perpage){
                   this.setState({
                       perpage:perpage+10
                   });
               }
           }
       }
    }
    componentWillMount(){
        this.props.dispatch(getContent('testimoni',`page=1`));

    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleValidate(){
        let where="";
        let page = localStorage.getItem("pageTestimoni");
        let any = this.state.any;

        if(page!==null&&page!==undefined&&page!==""){
            where+=`page=${page}`;
        }else{
            where+="page=1";
        }
        if(any!==null&&any!==undefined&&any!==""){
            where+=`&q=${any}`;
        }
        return where;

    }

    handleApprove(e,id,status){
        e.preventDefault()
        Swal.fire({
            title: 'Perhatian !!!',
            html: `anda yakin akan ${status===0?'Me-nonaktifkan':"Mengaktifkan"} testimoni ini?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Ya, ubah`,
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(putContent(id, {
                    status: status
                }, 'testimoni'));
            }
        })
        

    }

    handlePage(pageNumber){
        localStorage.setItem("pageTestimoni",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(getContent('testimoni',where));

    }
    handleSearch(e){
        e.preventDefault();
        let where = this.handleValidate();
        this.props.dispatch(getContent('testimoni',where));
    }
    handleData(par){
        return {
            jobs: this.props.data.data[par].jobs,
            caption: this.props.data.data[par].caption,
            id_category: this.props.data.data[par].id_category,
            category: this.props.data.data[par].category,
            created_at: this.props.data.data[par].created_at,
            id: this.props.data.data[par].id,
            picture: this.props.data.data[par].picture,
            title:this.props.data.data[par].title,
            type:this.props.data.data[par].type,
            type_no:this.props.data.data[par].type_no,
            updated_at:this.props.data.data[par].updated_at,
            video:this.props.data.data[par].video,
            writer:this.props.data.data[par].writer,
        };
    }
    handleModal(e,par){
        if(par!==''){
            this.setState({
                isModal:'form',
                detail:this.handleData(par)
            })
        }
        else{
            this.setState({
                isModal:'form',
                detail:{
                    id:''
                }
            })
        }
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formTestimoni"));
    }
    handleDetail(e,par){
        e.preventDefault();
        this.setState({
            isModal:'detail',
            detail:this.handleData(par)
        });
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailTestimoni"));
    }

    clearState(){
        this.setState({
            title:'',
            id:''
        })
    }
    
    handleScroll(){
        let divToScrollTo;
        divToScrollTo = document.getElementById(`item${this.state.scrollPage}`);
        if (divToScrollTo) {
            divToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' })
        }
    }
    render(){
        if(this.state.isScroll===true)this.handleScroll();
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
        console.log(data);
        return(
            <Layout page={"Testimoni"}>
                <div className="row">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Testimoni</h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className='col-md-12' style={{zoom:'100%'}}>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 col-xs-12 col-md-3">
                                        <div className="form-group">
                                            <label>Cari</label>
                                            <input type="text" className="form-control" name="any" placeholder={"cari disini"} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                        </div>
                                    </div>
                                    <div className="col-2 col-xs-2 col-md-4">
                                        <div className="form-group">
                                            <button style={{marginTop:"27px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                            {/* <button style={{marginTop:"27px",marginLeft:"5px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleModal(e,'')}><i className="fa fa-plus"/></button> */}
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-12 col-sm-12 col-lg-12">
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th style={{width:'1%'}}>No</th>
                                                        <th  style={{width:'15%'}}>Penulis</th>
                                                        <th  style={{width:'5%'}}>Pekerjaan</th>
                                                        <th  style={{width:'40%'}}>Pesan</th>
                                                        <th  style={{width:'10%'}}>Status</th>
                                                        <th  style={{width:'15%'}}>Dibuat Pada</th>
                                                        <th  style={{width:'10%'}}>Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    !this.props.isLoading?typeof data === 'object' ? data.length>0 ? data.map((v,i)=>{
                                                        return(
                                                            <tr key={i}>
                                                                <td style={{textAlign:'center'}}>
                                                                    {i+1 + (10 * (parseInt(current_page,10)-1))}
                                                                </td>
                                                                <td>{v.writer}</td>
                                                                <td>{v.jobs}</td>
                                                                <td>{v.caption}</td>
                                                                <td>{v.status===0?<span style={{padding:'5px'}} className="badge badge-danger">Tidak Aktif</span>:<span style={{padding:'5px'}} className="badge badge-success">Aktif/Terpublikasi</span>}</td>
                                                                <td>{moment(v.created_at).format("lll")}</td>
                                                                <td>
                                                                    <button onClick={(e)=>this.handleDetail(e,i)} className={"btn btn-secondary btn-sm"} style={{marginRight:"10px"}}><i className={"fa fa-eye"}/></button>
                                                                    {v.status === 0?
                                                                        <button onClick={(e)=>this.handleApprove(e,v.id,1)} className={"btn btn-success btn-sm"}><i className={"fa fa-check"}/></button>
                                                                        :
                                                                        <button onClick={(e)=>this.handleApprove(e,v.id,0)} className={"btn btn-danger btn-sm"}><i className={"fa fa-close"}/></button>
                                                                    }
                                                                </td>

                                                            </tr>
                                                        );
                                                    }):<tr><td colSpan={7}><img src={NOTIF_ALERT.NO_DATA} alt=""/></td></tr>:<tr><td colSpan={7}><img src={NOTIF_ALERT.NO_DATA} alt=""/></td></tr>:(()=>{
                                                        let container =[];
                                                        for(let x=0; x<8; x++){
                                                            container.push(
                                                                <tr key={x}>
                                                                    <td><Skeleton/></td>
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
                </div>
                {
                    this.state.isModal==='form'?<FormTestimoni detail={this.state.detail}/>:null
                }
                {
                    this.state.isModal==='detail'?<DetailTestimoni detail={this.state.detail}/>:null

                }

            </Layout>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        isLoading: state.contentReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.contentReducer.data,
        kategori:state.kategoriReducer.data,
        isLoadingPost: state.kategoriReducer.isLoadingPost,
        isError: state.kategoriReducer.isError,
        isLoadingKategori: state.kategoriReducer.isLoading,
    }
}


export default connect(mapStateToProps)(IndexBerita);