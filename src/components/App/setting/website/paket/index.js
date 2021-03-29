import React,{Component} from 'react';
import {connect} from "react-redux";
import {ToastQ} from "helper"
import {EditorState,convertToRaw, ContentState,convertFromHTML} from 'draft-js'
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import File64 from 'components/common/File64'

class Index extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            deskripsi: '',
            deskripsi1: '',
            deskripsi2: '',
            deskripsi3: '',
            newImage1:'',
            newImage2:'',
            newImage3:'',
            id:'',
            title:'',
            data:[],
            editorState: EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML('<p></p>')
                )
            ),
            editorState1: EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML('<p></p>')
                )
            ),
            editorState2: EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML('<p></p>')
                )
            ),
            editorState3: EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML('<p></p>')
                )
            ),
        };

        this.handleBtnSubmit = this.handleBtnSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
   
    static getDerivedStateFromProps(props, state) {
        if (props.data !== undefined && props.data.length !== 0) {
            if (props.data !== state.prevDataProps) {
                return {
                    prevDataProps: props.data,
                    editorState: EditorState.createWithContent(
                        ContentState.createFromBlockArray(
                            convertFromHTML(props.data.deskripsi)
                        )
                    ),
                    id:props.data.id,
                    title: props.data.title,  
                    step1: props.data.data[0],
                    step2: props.data.data[1],
                    step3: props.data.data[2],
                    editorState1: EditorState.createWithContent(
                        ContentState.createFromBlockArray(
                            convertFromHTML(props.data.data[0].deskripsi)
                        )
                    ),
                    editorState2: EditorState.createWithContent(
                        ContentState.createFromBlockArray(
                            convertFromHTML(props.data.data[1].deskripsi)
                        )
                    ),
                    editorState3: EditorState.createWithContent(
                        ContentState.createFromBlockArray(
                            convertFromHTML(props.data.data[2].deskripsi)
                        )
                    ),
                }

            }
        }
    }
    handleFile(files, name) {
        this.setState({
            [name]: files.base64
        });
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            deskripsi: ((draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))).replace('<p>', '<p class=\'lead\'>')),
            editorState,
        });
    };

    onEditorStateChange1 = (editorState) => {
        this.setState({
            deskripsi1: ((draftToHtml(convertToRaw(this.state.editorState1.getCurrentContent()))).replace('<p>', '<p class=\'lead\'>')),
            editorState1:editorState,
        });
    };
    onEditorStateChange2 = (editorState) => {
        this.setState({
            deskripsi2: ((draftToHtml(convertToRaw(this.state.editorState2.getCurrentContent()))).replace('<p>', '<p class=\'lead\'>')),
            editorState2:editorState,
        });
    };
    onEditorStateChange3 = (editorState) => {
        this.setState({
            deskripsi3: ((draftToHtml(convertToRaw(this.state.editorState3.getCurrentContent()))).replace('<p>', '<p class=\'lead\'>')),
            editorState3:editorState,
        });
    };
    
    handleChange(e){
        const target = e.target.name;
        let res=[];
        if(target === 'title'){
            this.setState({
                title: e.target.value
            })
        } else {
            if (target === 'title1' || target === 'title2' || target === 'title3'){
                const data = target === 'title1' ? this.state.step1 : target === 'title2' ? this.state.step2 : this.state.step3;
                const datum= Object.assign({},data,{
                    title:e.target.value
                })
                this.setState({
                    [target === 'title1'?'step1':target === 'title2'?'step2':'step3']: datum
                })
            }else{
                const data = target === 'price1' ? this.state.step1 : target === 'price2' ? this.state.step2 : this.state.step3;
                const datum = Object.assign({}, data, {
                    price: e.target.value
                })
                this.setState({
                    [target === 'price1' ? 'step1' : target === 'price2' ? 'step2' : 'step3']: datum
                })
            }
        }
    }

    handleBtnSubmit(e,tipe){
        e.preventDefault();
        let data=null;
        let id='';
        const type = tipe.split("_");
        console.log(type);
        if(type[0]==='paket01'){
            console.log({title: this.state.step1});
            if (type[1] === 'deskripsi') {
                if (this.state.deskripsi1 === '') {
                    ToastQ.fire({
                        icon: 'error',
                        title: `Belum ada perubahan.`
                    });
                }else{
                    data={deskripsi:this.state.deskripsi1}
                }
            }else if (type[1]==='title') data={title:this.state.step1.title}
            else if (type[1]==='price') data={price:this.state.step1.price}
            else if (type[1] === 'gambar') {
                if (this.state.newImage1 === '') {
                    ToastQ.fire({
                        icon: 'error',
                        title: `Belum ada perubahan.`
                    });
                }else{
                    data={image:this.state.newImage1}
                }
            }
            id=this.state.step1.id;
        }else if(type[0]==='paket02'){
            if (type[1] === 'deskripsi') {
                if (this.state.deskripsi2 === '') {
                    ToastQ.fire({
                        icon: 'error',
                        title: `Belum ada perubahan.`
                    });
                }else{
                    data={deskripsi:this.state.deskripsi2}
                }
            }else if (type[1]==='title') data={title:this.state.step2.title}
            else if (type[1]==='price') data={price:this.state.step2.price}
            else if (type[1] === 'gambar') {
                if (this.state.newImage2 === '') {
                    ToastQ.fire({
                        icon: 'error',
                        title: `Belum ada perubahan.`
                    });
                }else{
                    data={image:this.state.newImage2}
                }
            }
            id=this.state.step2.id;
        }else if(type[0]==='paket03'){
            if (type[1] === 'deskripsi') {
                if (this.state.deskripsi3 === '') {
                    ToastQ.fire({
                        icon: 'error',
                        title: `Belum ada perubahan.`
                    });
                }else{
                    data={deskripsi:this.state.deskripsi3}
                }
            }else if (type[1]==='title') data={title:this.state.step3.title}
            else if (type[1]==='price') data={price:this.state.step3.price}
            else if (type[1] === 'gambar') {
                if (this.state.newImage3 === '') {
                    ToastQ.fire({
                        icon: 'error',
                        title: `Belum ada perubahan.`
                    });
                }else{
                    data={image:this.state.newImage3}
                }
            }
            id=this.state.step3.id;
        }else{
            if (type[0] === 'deskripsi') {
                if (this.state.deskripsi === '') {
                    ToastQ.fire({
                        icon: 'error',
                        title: `Belum ada perubahan.`
                    });
                }else{
                    data={deskripsi:this.state.deskripsi}
                }
            }else if (type[0]==='title') data={title:this.state.title}
            
            id=this.state.id;
        }

        if(data!==null){
            this.props.handleUpdate(e,data,id,type)
        }
    }


    render(){
        return(
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12">
                            <div className='form-group'>
                                    <label>Judul <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'title')}>Simpan</button></label>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                        </div>
                                        <input type="text" name='title' onChange={this.handleChange} value={this.state.title} className="form-control" placeholder="" />
                                    </div>
                                </div>
                            <div className='form-group'>
                                <label>Deskripsi <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'deskripsi')}>Simpan</button></label>
                                <Editor
                                    editorState={this.state.editorState}
                                    wrapperClassName="main-wrapper"
                                    editorClassName="main-editor"
                                    onEditorStateChange={this.onEditorStateChange}
                                />
                            </div>
                        </div>
                        
                        {/* 
                        * STEP SECTION
                        */}
                        <div className="col-md-4">
                            <h6 style={{marginTop:'20px'}}>Paket 1</h6>
                            <div className='form-group'>
                                <label>Judul <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'paket01_title')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='title1' onChange={this.handleChange} value={this.state.step1.title} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Harga <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'paket01_price')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='price1' onChange={this.handleChange} value={this.state.step1.price} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Gambar <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'paket01_gambar')}>Simpan</button></label>
                                <File64 multiple={ false }
                                        maxSize={2048} //in kb
                                        fileType='png, jpg' //pisahkan dengan koma
                                        className="mr-3 form-control-file"
                                        onDone={ (event)=>this.handleFile(event,'newImage1') }
                                        showPreview={true}
                                        lang='id'
                                        ids="paket01"
                                        previewLink={this.state.step1.image}
                                        previewConfig={{
                                            width:'100px',
                                            height:'100px'
                                        }}
                                    />
                            </div>
                            <div className='form-group'>
                                <label>Deskripsi <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'paket01_deskripsi')}>Simpan</button></label>
                                <Editor
                                    toolbarHidden
                                    editorState={this.state.editorState1}
                                    wrapperClassName="main-wrapper"
                                    editorClassName="small-editor"
                                    onEditorStateChange={this.onEditorStateChange1}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <h6 style={{marginTop:'20px'}}>Paket 2</h6>

                            <div className='form-group'>
                                <label>Judul <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'paket02_title')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='title2' onChange={this.handleChange} value={this.state.step2.title} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Harga <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'paket02_price')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='price2' onChange={this.handleChange} value={this.state.step2.price} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                    <label>Gambar <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'paket02_gambar')}>Simpan</button></label>
                                    <File64 multiple={ false }
                                            maxSize={2048} //in kb
                                            fileType='png, jpg' //pisahkan dengan koma
                                            className="mr-3 form-control-file"
                                            onDone={ (event)=>this.handleFile(event,'newImage2') }
                                            showPreview={true}
                                            lang='id'
                                            ids = "paket02"
                                            previewLink={this.state.step2.image}
                                            previewConfig={{
                                                width:'100px',
                                                height:'100px'
                                            }}
                                        />
                            </div>
                            <div className='form-group'>
                                <label>Deskripsi <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'paket02_deskripsi')}>Simpan</button></label>
                                <Editor
                                    toolbarHidden
                                    editorState={this.state.editorState2}
                                    wrapperClassName="main-wrapper"
                                    editorClassName="small-editor"
                                    onEditorStateChange={this.onEditorStateChange2}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <h6 style={{marginTop:'20px'}}>Paket 3</h6>

                            <div className='form-group'>
                                <label>Judul <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'paket03_title')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='title3' onChange={this.handleChange} value={this.state.step3.title} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label>Harga <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'paket02_price')}>Simpan</button></label>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                    </div>
                                    <input type="text" name='price3' onChange={this.handleChange} value={this.state.step3.price} className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className='form-group'>
                                    <label>Gambar <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'paket03_gambar')}>Simpan</button></label>
                                    <File64 multiple={ false }
                                            maxSize={2048} //in kb
                                            fileType='png, jpg' //pisahkan dengan koma
                                            className="mr-3 form-control-file"
                                            onDone={ (event)=>this.handleFile(event,'newImage3') }
                                            showPreview={true}
                                            lang='id'
                                            ids="paket03"
                                            previewLink={this.state.step3.image}
                                            previewConfig={{
                                                width:'100px',
                                                height:'100px'
                                            }}
                                        />
                            </div>
                            <div className='form-group'>
                                <label>Deskripsi <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'paket03_deskripsi')}>Simpan</button></label>
                                <Editor
                                    toolbarHidden
                                    editorState={this.state.editorState3}
                                    wrapperClassName="main-wrapper"
                                    editorClassName="small-editor"
                                    onEditorStateChange={this.onEditorStateChange3}
                                />
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;