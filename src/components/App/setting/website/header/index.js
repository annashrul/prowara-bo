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
            deskripsi:'',
            editorState: EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML('<p></p>')
                )
            ),
            id:'',
            image:'',
            background:'',
            newImage:'',
            newBackground:''
        };
        this.handleFile = this.handleFile.bind(this)
        this.handleBtnSubmit = this.handleBtnSubmit.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data !== undefined && props.data.length !== 0) {
            if (props.data !== state.prevDataProps) {
                return {
                    prevDataProps: props.data,
                    editorState: EditorState.createWithContent(
                        ContentState.createFromBlockArray(
                            convertFromHTML('<div>' + props.data.title + '</div>')
                        )
                    ),
                    id:props.data.id,
                    image:props.data.image,
                    background:props.data.background
                    
                }

            }
        }
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            deskripsi:((draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))).replace('<p>','<div>')).replace('</p>','</div>'),
            editorState,
        });
    };

    handleFile(files,name) {
        this.setState({
            [name]: files.base64
        });
    }

    handleBtnSubmit(e,type){
        e.preventDefault();
        let data=null;
        if (type === 'tagline') {
            if (this.state.deskripsi === '') {
                ToastQ.fire({
                    icon: 'error',
                    title: `Belum ada perubahan.`
                });
            }else{
                data={title:this.state.deskripsi}
            }
        }else if (type==='handphone') {
            if (this.state.newImage === '') {
                ToastQ.fire({
                    icon: 'error',
                    title: `Belum ada perubahan.`
                });
            }else{
                data={image:this.state.newImage}
            }
        }else if (type==='background') {
            if (this.state.newBackground === '') {
                ToastQ.fire({
                    icon: 'error',
                    title: `Belum ada perubahan.`
                });
            }else{
                data={background:this.state.newBackground}
            }
        }
        if(data!==null){
            this.props.handleUpdate(e,data,this.state.id,type)
        }
    }


    render(){
        return(
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12">
                            <div className='form-group'>
                                <label>Tag Line Header <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'tagline')}>Simpan</button></label>
                                <Editor
                                    toolbarHidden
                                    editorState={this.state.editorState}
                                    wrapperClassName="main-wrapper"
                                    editorClassName="small-editor"
                                    onEditorStateChange={this.onEditorStateChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className='form-group'>
                                    <label>Handphone <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'handphone')}>Simpan</button></label>
                                    <File64 multiple={ false }
                                            maxSize={2048} //in kb
                                            fileType='png, jpg' //pisahkan dengan koma
                                            className="mr-3 form-control-file"
                                            onDone={(event)=>this.handleFile(event,'newImage') }
                                            showPreview={true}
                                            lang='id'
                                            previewLink={this.state.image}
                                            previewConfig={{
                                                width: '100%',
                                                height: '400px'
                                            }}
                                        />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className='form-group'>
                                    <label>Background <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'background')}>Simpan</button></label>
                                    <File64 multiple={ false }
                                            maxSize={2048} //in kb
                                            fileType='png, jpg' //pisahkan dengan koma
                                            className="mr-3 form-control-file"
                                            onDone={(event)=>this.handleFile(event,'newBackground') }
                                            showPreview={true}
                                            lang='id'
                                            ids="Banner"
                                            previewLink={this.state.background}
                                            previewConfig={{
                                                width: '100%',
                                                height: '200px'
                                            }}
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