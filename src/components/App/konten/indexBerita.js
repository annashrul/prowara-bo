import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import {myDate, noImage, rmHtml, ToastQ, toCurrency} from "../../../helper";
import Skeleton from 'react-loading-skeleton';
import moment from "moment";
import {
    UncontrolledButtonDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle, Dropdown
} from 'reactstrap';
import {deleteContent, getContent} from "../../../redux/actions/konten/konten.action";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import FormBerita from "../modals/konten/berita/form_berita"
import * as Swal from "sweetalert2";
import {
    deleteKategori, fetchKategori, postKategori,
    putKategori
} from "../../../redux/actions/kategori/kategori.action";
import StickyBox from "react-sticky-box";
import {BrowserView, MobileView,isBrowser, isMobile} from 'react-device-detect';
import {NOTIF_ALERT} from "../../../redux/actions/_constants";
import Preloader from "../../../Preloader";

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
        };
        this.handleChange   = this.handleChange.bind(this);
        this.handlePage     = this.handlePage.bind(this);
        this.handleSearch   = this.handleSearch.bind(this);
        this.handleDelete   = this.handleDelete.bind(this);
        this.handleActionKategori   = this.handleActionKategori.bind(this);
        this.handleLoadMore   = this.handleLoadMore.bind(this);

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
        this.props.dispatch(getContent('berita',`page=1`));
        this.props.dispatch(fetchKategori(`berita?page=1`));

    }
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleValidate(){
        let where="";
        let page = localStorage.getItem("pageBerita");
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

    handlePage(pageNumber){
        localStorage.setItem("pageBerita",pageNumber);
        let where = this.handleValidate();
        this.props.dispatch(getContent('berita',where));

    }
    handleSearch(e){
        e.preventDefault();
        let where = this.handleValidate();
        this.props.dispatch(getContent('berita',where));
    }
    handleModal(e,par){
        if(par!==''){
            this.setState({
                detail:{
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
                }
            })
        }
        else{
            this.setState({
                detail:{
                    id:''
                }
            })
        }
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formBerita"));
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
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(deleteContent(id,'berita'));
            }
        })
    }
    clearState(){
        this.setState({
            title:'',
            id:''
        })
    }
    handleActionKategori(e,param,i){
        e.preventDefault();
        this.setState({
            isScroll:false
        });
        let parsedata={title:this.state.title,type:1};
        if(param==='tambah'){
            if(this.state.title===''){
                ToastQ.fire({icon:'error',title:`inputan tidak boleh kosong`});
                return;
            }
            else{
                if(this.state.id===''){
                    this.props.dispatch(postKategori(parsedata,'berita'));


                }
                else{
                    this.props.dispatch(putKategori(this.state.id,parsedata,'berita'));

                }
                this.clearState();
            }
        }
        if(param==='edit'){
            this.setState({
                title:this.props.kategori.data[i].title,
                id:this.props.kategori.data[i].id,
            })
        }
        if(param==='hapus'){
            Swal.fire({
                title: 'Perhatian !!!',
                html:`anda yakin akan menghapus data ini ??`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: `Oke, Hapus`,
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.value) {
                    this.props.dispatch(deleteKategori(this.props.kategori.data[i].id,'berita'));
                }
            })
        }
    }
    handleLoadMore(){
        this.setState({
            isScroll:true
        });
        let perpage = parseInt(this.props.kategori.per_page,10);
        let lengthBrg = parseInt(this.props.kategori.data.length,10);
        console.log("perpage",perpage);
        console.log("lengthBrg",lengthBrg);
        if(perpage===lengthBrg || perpage<lengthBrg){
            this.props.dispatch(fetchKategori(`berita?page=1&perpage=${this.state.perpage}`));
            this.setState({scrollPage:this.state.scrollPage+5});
        }
        else{
            Swal.fire({allowOutsideClick: false,
                title: 'Perhatian',
                icon: 'warning',
                text: 'Tidak ada data.',
            });
        }

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
            <Layout page={"Berita"}>
                <div className="row">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Berita</h5>
                        </div>
                    </div>
                </div>
                {
                    this.props.isLoading?<Preloader/>:null
                }
                <div className="row">
                    <div style={{width:"75%",display: 'flex', alignItems: 'flex-start',marginRight:'5px'}}>
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-8 col-xs-8 col-md-3">
                                    <div className="form-group">
                                        <label>Cari</label>
                                        <input type="text" className="form-control" name="any" placeholder={"cari disini"} defaultValue={this.state.any} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}}/>
                                    </div>
                                </div>
                                <div className="col-4 col-xs-4 col-md-4">
                                    <div className="form-group">
                                        <button style={{marginTop:"27px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleSearch(e)}><i className="fa fa-search"/></button>
                                        <button style={{marginTop:"27px",marginLeft:"5px"}} type="button" className="btn btn-primary" onClick={(e)=>this.handleModal(e,'')}><i className="fa fa-plus"/></button>
                                    </div>
                                </div>
                                <br/>
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <main>
                                                {
                                                    typeof data==='object'?data.length>0?data.map((v,i)=>{
                                                        return(
                                                            <article key={i}>
                                                                <div className="box-margin">
                                                                    <div className="coupon" style={{
                                                                        borderRadius:"15px",
                                                                        margin:"0 auto",
                                                                        breakInside: 'avoid-column'
                                                                    }}>
                                                                        <div className="ribbon-wrapper card">
                                                                            <div className="ribbon ribbon-bookmark ribbon-success">{v.category}</div>
                                                                            <img src={v.picture} style={{width:'100%'}} onError={(e)=>{e.target.onerror = noImage(); e.target.src=`${noImage()}`}} alt="member image"/>
                                                                            <br/>
                                                                            <div className="row">
                                                                                <div className="col-md-12" style={{padding:"5"}}>
                                                                                    {myDate(v.created_at)}
                                                                                    <h4 className="txtRed">{v.title}</h4>
                                                                                    <p>
                                                                                        <div dangerouslySetInnerHTML={{__html: String(v.caption).substr(0,200)}} />
                                                                                    </p>
                                                                                </div>
                                                                                <div className="col-md-12">
                                                                                    <div className="btn-group btn-block" style={{textAlign:"right"}}>
                                                                                        <UncontrolledButtonDropdown nav>
                                                                                            <DropdownToggle caret className="myDropdown">
                                                                                                Pilihan
                                                                                            </DropdownToggle>
                                                                                            <DropdownMenu>
                                                                                                <DropdownItem onClick={(e)=>this.handleModal(e,i)}>Ubah</DropdownItem>
                                                                                                <DropdownItem onClick={(e)=>this.handleDelete(e,v.id)}>Hapus</DropdownItem>
                                                                                            </DropdownMenu>
                                                                                        </UncontrolledButtonDropdown>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </article>
                                                        );
                                                    }):"":""
                                                }
                                            </main>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div style={{width:"24%"}}>
                        <StickyBox offsetTop={150} offsetBottom={20}>

                                    <div className="widgets-todo-list-area" style={{marginTop:"24px"}}>
                                        <form id="form-add-todo" className="form-add-todo d-flex">
                                            <div className="row">
                                                <div className="col-md-9">
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" name="title" value={this.state.title} onChange={this.handleChange}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <button className={"btn btn-primary"} onClick={(event)=>this.handleActionKategori(event,'tambah','')}>
                                                            {!this.props.isLoadingPost?<i className={"fa fa-send"}/>:<i className="fa fa-circle-o-notch fa-spin"/>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        {
                                            !this.props.isLoadingKategori?typeof this.props.kategori.data==='object'? this.props.kategori.data.length>0?this.props.kategori.data.map((v,i)=>{
                                                return(
                                                    <div className="card box-margin">
                                                        <div className="card-body">
                                                            <h5 style={{fontSize:'12px'}}>{v.title}</h5>
                                                            <hr/>
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <button className={"btn btn-primary"} onClick={(event)=>this.handleActionKategori(event,'edit',i)}><i className={"todo-item-done fa fa-pencil"}/></button>
                                                                    <button style={{marginLeft:"5px"}} className={"btn btn-primary"} onClick={(event)=>this.handleActionKategori(event,'hapus',i)}><i className={"todo-item-done fa fa-close"}/></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }):"":"":(()=>{
                                                let container =[];
                                                for(let x=0; x<8; x++){
                                                    container.push(
                                                        <li key={x}>
                                                            <Skeleton width={150}/>
                                                        </li>
                                                    )
                                                }
                                                return container;
                                            })()
                                        }
                                        <div className="form-group">
                                            <button className={"btn btn-primary"} style={{width:"100%"}} onClick={this.handleLoadMore}>{this.props.isLoadingKategori?'tunggu sebentar ...':'tampilkan lebih banyak'}</button>
                                        </div>
                                    </div>


                        </StickyBox>
                    </div>
                </div>
                {
                    this.props.isOpen===true?<FormBerita detail={this.state.detail}/>:null
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