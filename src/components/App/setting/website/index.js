import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Header from './header'
import About from './about'
import How from './howit'
import Paket from './paket'
import Download from './download'
import Privacy from './privacy'
import Tos from './tos'
import {fetchLanding, updateLanding} from 'redux/actions/setting/general.action'
import Preloader from 'Preloader'

class Website extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            section:'header',
        };
        this.handleUpdate = this.handleUpdate.bind(this)
    }
    componentDidMount(){
        this.props.dispatch(fetchLanding());
    }

    handleOnchange(e,sct){
        this.setState({
            section:sct
        })
    }
    handleUpdate(e,data,id,type){
        this.props.dispatch(updateLanding(data,id,type))
    }
   

    render(){
        let header={};
        let about={};
        let howto={};
        let paket={};
        let download={};
        let privacy={};
        let terms={};
        if(this.props.landing!==undefined && this.props.landing.length>0){
            const snap=this.props.landing;
            const indexHeader = snap.findIndex(item => item.id === '6e3f5b5c-7afe-4f62-9e63-09e1c7d03e7b');
            const indexAbout = snap.findIndex(item => item.id === '2ba39c15-6924-4c17-9004-ccc237d1e996');
            const indexhowto = snap.findIndex(item => item.id === '8942fed8-939c-4e1b-b811-fc51cac69809');
            const howto1 = snap.findIndex(item => item.id === '30c3e7ba-a35e-4150-acdc-d4c558ec253c');
            const howto2 = snap.findIndex(item => item.id === '4a8cf54c-4d8b-428c-a8be-3d19a2fde998');
            const howto3 = snap.findIndex(item => item.id === 'bd90ab5b-cdea-422f-ba32-38c4dac9ced6');
            const indexpaket = snap.findIndex(item => item.id === '9a578d02-1787-4fb7-a426-a9520e45e61b');
            const paket1 = snap.findIndex(item => item.id === 'a3a53a90-2a3f-4f6f-b596-09617bc18527');
            const paket2 = snap.findIndex(item => item.id === '1525951b-b460-4caf-b1e5-c37013362835');
            const paket3 = snap.findIndex(item => item.id === '28b403ff-8ae8-45be-9b38-6b2b8c59bc5d');
            const indexdownload = snap.findIndex(item => item.id === '53f156d3-a46c-4644-99f5-bb0bf171b2d6');
            const indexprivacy = snap.findIndex(item => item.id === '016a53cc-318e-44c0-a378-5cde13d65ec9');
            const indexterms = snap.findIndex(item => item.id === '20a0f39e-af14-423f-bc7c-247cf02d3cc6');
            header={
                id: snap[indexHeader].id,
                title: snap[indexHeader].title,
                image: snap[indexHeader].image,
                background: snap[indexHeader].background
            }
            about={
                id: snap[indexAbout].id,
                title: snap[indexAbout].title,
                deskripsi: snap[indexAbout].deskripsi,
            }
            howto={
                id: snap[indexhowto].id,
                title: snap[indexhowto].title,
                deskripsi: snap[indexhowto].deskripsi,
                data: [{
                    id: snap[howto1].id,
                    title: snap[howto1].title,
                    deskripsi: snap[howto1].deskripsi,
                    image: snap[howto1].image
                }, {
                    id: snap[howto2].id,
                    title: snap[howto2].title,
                    deskripsi: snap[howto2].deskripsi,
                    image: snap[howto2].image
                }, {
                    id: snap[howto3].id,
                    title: snap[howto3].title,
                    deskripsi: snap[howto3].deskripsi,
                    image: snap[howto3].image
                }]
            }
            paket={
                id: snap[indexpaket].id,
                title: snap[indexpaket].title,
                deskripsi: snap[indexpaket].deskripsi,
                data: [{
                    id: snap[paket1].id,
                    title: snap[paket1].title,
                    deskripsi: snap[paket1].deskripsi,
                    price: (snap[paket1].price),
                    link: snap[paket1].link,
                    image: snap[paket1].image
                }, {
                    id: snap[paket2].id,
                    title: snap[paket2].title,
                    deskripsi: snap[paket2].deskripsi,
                    price: (snap[paket2].price),
                    link: snap[paket2].link,
                    image: snap[paket2].image
                }, {
                    id: snap[paket3].id,
                    title: snap[paket3].title,
                    deskripsi: snap[paket3].deskripsi,
                    price: (snap[paket3].price),
                    link: snap[paket3].link,
                    image: snap[paket3].image
                }]
            }
            download={
                id: snap[indexdownload].id,
                title: snap[indexdownload].title,
                deskripsi: snap[indexdownload].deskripsi,
                link: snap[indexdownload].link
            }
            privacy={
                id: snap[indexprivacy].id,
                title: snap[indexprivacy].title,
                deskripsi: snap[indexprivacy].deskripsi
            }
            terms={
                id: snap[indexterms].id,
                title: snap[indexterms].title,
                deskripsi: snap[indexterms].deskripsi
            }
        }
        return(
            <Layout page={"Pengaturan Umum"}>
                <div className="row">
                    <div className="col-md-3 box-margin">
                        <div className="card">
                            <div className="card-body">
                                <div className="nav flex-column nav-pills">
                                    <a className={this.state.section==='header'?"nav-link active":"nav-link"} onClick={(event)=>this.handleOnchange(event,'header')} href="#" >header</a>
                                    <a className={this.state.section==='about'?"nav-link active":"nav-link"}  onClick={(event)=>this.handleOnchange(event,'about')} href="#">about</a>
                                    <a className={this.state.section==='how'?"nav-link active":"nav-link"}  onClick={(event)=>this.handleOnchange(event,'how')} href="#" >how it work</a>
                                    <a className={this.state.section==='paket'?"nav-link active":"nav-link"}   onClick={(event)=>this.handleOnchange(event,'paket')} href="#">paket</a>
                                    <a className={this.state.section==='download'?"nav-link active":"nav-link"}   onClick={(event)=>this.handleOnchange(event,'download')} href="#">download</a>
                                    <a className={this.state.section==='privacy'?"nav-link active":"nav-link"}   onClick={(event)=>this.handleOnchange(event,'privacy')} href="#">Privacy Policy</a>
                                    <a className={this.state.section==='tos'?"nav-link active":"nav-link"}   onClick={(event)=>this.handleOnchange(event,'tos')} href="#">Terms and Conditions</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9 box-margin">
                        <div className="alert bg-secondary text-light">
                            Setelah melakukan perubahan silahkan <span style={{fontWeight:'800', color:'yellow'}}>tekan tombol <button onClick={e=>false} className="badge badge-success">simpan</button></span> untuk melakukan update sebelum merubah field yang lain.
                        </div>
                        <div className="card">
                            <div class="card-header">Section {this.state.section==='how'?"How it work":this.state.section.charAt(0).toUpperCase() + this.state.section.slice(1)}</div>
                            <div className="card-body">
                                {
                                    this.props.isLoading?
                                    <Preloader/>:
                                    this.state.section==='header'?
                                    <Header 
                                        data={header}
                                        handleUpdate={this.handleUpdate}
                                    />:
                                    this.state.section==='about'?
                                    <About 
                                        data={about}
                                        handleUpdate={this.handleUpdate}
                                    />:
                                    this.state.section==='how'?
                                    <How 
                                        data={howto}
                                        handleUpdate={this.handleUpdate}
                                    />:
                                    this.state.section==='paket'?
                                    <Paket 
                                        data={paket}
                                        handleUpdate={this.handleUpdate}
                                    />:
                                    this.state.section==='download'?
                                    <Download 
                                        data={download}
                                        handleUpdate={this.handleUpdate}
                                    />
                                    :
                                    this.state.section==='privacy'?
                                    <Privacy 
                                        data={privacy}
                                        handleUpdate={this.handleUpdate}
                                    />:
                                    this.state.section==='tos'?
                                    <Tos 
                                        data={terms}
                                        handleUpdate={this.handleUpdate}
                                    />
                                    :''


                                }
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
        isLoading: state.generalReducer.isLoading,
        isOpen:state.modalReducer,
        landing:state.generalReducer.landing,
    }
}


export default connect(mapStateToProps)(Website);