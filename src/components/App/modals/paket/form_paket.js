import React, {Component} from 'react'
import { connect } from 'react-redux'
import WrapperModal from '../_wrapper.modal'
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import {ModalToggle} from "../../../../redux/actions/modal.action";
import  { rmComma, ToastQ, toCurrency} from "../../../../helper";
import {postPaket, putPaket} from "../../../../redux/actions/paket/paket.action";
import File64 from "components/common/File64";
import {NOTIF_ALERT} from "../../../../redux/actions/_constants";
import {fetchBarang} from "../../../../redux/actions/paket/barang.action";
import Membership from "../../../common/membership";

import * as Swal from "sweetalert2";

class FormPaket extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.handleChangeDynamic = this.handleChangeDynamic.bind(this);
        this.handleAddBarang = this.handleAddBarang.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.state={
            any:'',
            isSelected:false,
            kategori_data:[],
            kategori: "",
            id:"",
            title:"",
            harga:0,
            deskripsi:"",
            foto:"",
            ppn:'',
            status:"",
            point_volume:"1",
            type:0,
            barang_data:[],
            detail:[],
            perpage:10,
            isScroll:false,
            scrollPage:0,
        }
    }
    handleSearch(e){
        e.preventDefault();
        this.props.dispatch(fetchBarang(`page=1&q=${this.state.any}`));
    }
    componentWillMount(){
        this.props.dispatch(fetchBarang(`page=1&perpage=${this.state.perpage}`));
    }

    handleChangeDynamic(e,i){
        // e.preventDefault();
        this.setState({
            isScroll:false
        })
        let column = e.target.name;
        let value = e.target.value;
        let checked = e.target.checked;
        let hrg=parseInt(this.state.harga,10);
        let detail = [...this.state.detail];
        if(column === 'checked'){
            detail[i] = {...detail[i], [column]: checked};
            if(detail[i].checked===true){
                hrg=hrg-parseInt(detail[i].harga,10);
            }
            else{
                hrg=hrg+parseInt(detail[i].harga,10);
            }
            this.setState({detail:detail,harga:hrg});
        }
        else{
            detail[i] = {...detail[i], [column]: value};
            this.setState({detail:detail,harga:hrg});
        }


    }

    getProps(param){
        let barang=[];

        if(typeof param.barang.data==='object'){
            console.log("data",param.barang.data);
            if(param.barang.data.length>0){
                for(let i=0;i<param.barang.data.length;i++){
                    barang.push({
                        checked:false,
                        qty:"0",
                        id:param.barang.data[i].id,
                        title:param.barang.data[i].title,
                        bonus:"0",
                        harga:param.barang.data[i].harga,
                    });

                }
                let perpage=this.state.perpage;
                if(param.barang.data.length === perpage){
                    this.setState({
                        perpage:perpage+10
                    });
                }
            }
            else{
                barang=[];
            }

        }

        else{
            barang = [];
        }

        if(param.detail.id!==''){
            if(param.paketDetail.detail!==undefined){
                if(param.paketDetail.detail.length>0){
                    let valDetail = [];
                    for(let x=0;x<param.paketDetail.detail.length;x++){
                        valDetail.push({
                            checked:param.paketDetail.detail[x].isbonus === 1,
                            qty:param.paketDetail.detail[x].qty,
                            id:param.paketDetail.detail[x].id_barang,
                            title:param.paketDetail.detail[x].barang,
                            bonus:param.paketDetail.detail[x].isbonus,
                            harga:param.paketDetail.detail[x].harga,
                        });
                    }
                    this.setState({detail:valDetail});
                }
            }
            this.setState({
                kategori:param.paketDetail.id_kategori,
                id:param.paketDetail.id,
                title:param.paketDetail.title,
                harga:param.paketDetail.harga,
                deskripsi:param.paketDetail.deskripsi,
                foto:"",
                status:param.paketDetail.status,
                point_volume:param.paketDetail.point_volume,
                type:param.paketDetail.type,
            });
        }


        this.setState({
            barang_data:barang,
        });

    }
    componentWillReceiveProps(nextProps){
        if(this.state.isSelected===false) this.getProps(nextProps);
    }
    HandleChangeCategory(val){
        this.setState({
            kategori:val.value,
        });
    }
    clearState(){
        this.setState({
            any:'',
            isSelected:false,
            kategori_data:[],
            kategori:"",
            id:"",
            title:"",
            harga:0,
            deskripsi:"",
            foto:"",
            status:"",
            point_volume:"",
            type:"",
            barang_data:[],
            detail:[],
            perpage:10,
            isScroll:false,
            scrollPage:0,

        });
    }
    toggle = (e) => {
        e.preventDefault();

        this.clearState();

        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));

    };
    handleChange = (event) => {
        let err = Object.assign({}, this.state.error, {
            [event.target.name]: ""
        });
        this.setState({
            [event.target.name]: event.target.value,
            error: err,
            isSelected:false,
        });
        if (event.target.name==='type'){
            this.setState({
                kategori: "3a385e1d-21f7-4c73-9554-c818f0078c6f",
                point_volume: "1",
            })

        }
    }
    handleValidation(e){
        e.preventDefault();
        let detail=[];
        let parseData = {};
        parseData['title'] = this.state.title;
        parseData['harga'] = rmComma(this.state.harga);
        parseData['deskripsi'] = this.state.deskripsi;
        parseData['id_kategori'] = this.state.kategori;
        parseData['status'] = this.state.status;
        parseData['point_volume'] = this.state.point_volume;
        parseData['type'] = this.state.type;
        parseData['foto'] = this.state.foto!==""?this.state.foto.base64:'-';
        if(this.state.detail.length<1){
            ToastQ.fire({icon:'error',title:`belum ada barang yang dipilih`});
            return;
        }
        for(let i=0;i<this.state.detail.length;i++){
            if(this.state.detail[i].qty==="0"){
                ToastQ.fire({icon:'error',title:`qty ${this.state.detail[i].title} harus lebih dari nol`});
                return;
            }
            detail.push({
                "id_barang":this.state.detail[i].id,
                "qty":rmComma(this.state.detail[i].qty),
                "isbonus":this.state.detail[i].checked===true?1:0
            });
        }
        if(parseData['title']===''){
            ToastQ.fire({icon:'error',title:`title tidak boleh kosong`});
            return;
        }
        if(parseData['harga']===''){
            ToastQ.fire({icon:'error',title:`harga tidak boleh kosong`});
            return;
        }
        if(parseData['deskripsi']===''){
            ToastQ.fire({icon:'error',title:`deskripsi tidak boleh kosong`});
            return;
        }
        if(parseData['id_kategori']===''){
            ToastQ.fire({icon:'error',title:`kategori tidak boleh kosong`});
            return;
        }
        if(parseData['status']===''){
            ToastQ.fire({icon:'error',title:`status tidak boleh kosong`});
            return;
        }
        if(parseData['point_volume']===''||parseData['point_volume']==='0'){
            ToastQ.fire({icon:'error',title:`PV tidak boleh kosong`});
            return;
        }
        if(parseData['type']===''){
            ToastQ.fire({icon:'error',title:`tipe tidak boleh kosong`});
            return;
        }

        parseData['detail'] = detail;
        if(this.props.detail.id!==''){
            this.props.dispatch(putPaket(parseData,this.props.detail.id));
        }
        else{
            this.props.dispatch(postPaket(parseData));
        }
        // this.props.dispatch(postPaket(parseData));
        if(this.props.isError===true){
            this.clearState();
        }

    }
    handleAddBarang(e,i){
        e.preventDefault();
        this.setState({
            isSelected:true,
            isScroll:false
        });
        let data = this.state.detail;
        let hrg=parseInt(this.state.harga,10);

        for(let x=0;x<data.length;x++){
            if(data[x].id===this.state.barang_data[i].id){
                let someArray = this.removeItemOnce(data,this.state.barang_data[i]);
                hrg = hrg-parseInt(this.state.barang_data[i].harga,10);
                this.setState({detail:someArray,harga:hrg});
                return;
            }
        }
        hrg = hrg+parseInt(this.state.barang_data[i].harga,10);
        data.push({
            checked:false,
            qty:"1",
            id:this.props.barang.data[i].id,
            title:this.props.barang.data[i].title,
            bonus:"0",
            harga:this.props.barang.data[i].harga,
        });
        this.setState({detail:data,harga:hrg});

    }
    removeItemOnce(arr, value) {
        let someArray = arr;
        let arrayToRemove=value;
        return someArray.filter((e)=>e.id !==arrayToRemove.id);
    }
    handleRemove(e,i){
        let someArray=this.removeItemOnce(this.state.detail,this.state.detail[i]);
        let hrg=parseInt(this.state.harga,10);
        hrg = hrg-parseInt(this.state.detail[i].harga,10);
        this.setState({
            detail:someArray,
            harga:hrg
        })
    }
    handleFile(files) {
        this.setState({foto: files});
    }
    handleLoadMore(){
        this.setState({
            isScroll:true,
            isSelected:false
        });
        let perpage = parseInt(this.props.barang.per_page,10);
        let lengthBrg = parseInt(this.props.barang.data.length,10);

        if(perpage===lengthBrg || perpage<lengthBrg){
            this.props.dispatch(fetchBarang(`page=1&perpage=${this.state.perpage}`));
            this.setState({scrollPage:this.state.scrollPage+10});
        }

        else{
            Swal.fire({
                allowOutsideClick: false,
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
        // this.setState({
        //     isScroll:false,
        // });
    }


    render(){
        console.log("FORM PAKET",this.state.kategori);

        if(this.state.isScroll===true)this.handleScroll();
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formPaket"} size="lg"  className="custom-map-modal">
                <ModalHeader toggle={this.toggle}>{this.props.detail.id===''?"Tambah Paket":"Ubah Paket"}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-5 col-xs-5 col-md-3 ">
                            <div className="form-group">
                                <label>Pilih Barang</label>
                                <div className="input-group mb-2">
                                    <input type="text" className="form-control" name="any" placeholder={"cari berdasarkan nama barang"} value={this.state.any} onChange={this.handleChange}  onKeyPress={event=>{if(event.key==='Enter'){this.handleSearch(event);}}} />
                                    <div className="input-group-prepend">
                                        <button className="btn btn-primary" onClick={(event)=>this.handleSearch(event)}>
                                            <i className="fa fa-search"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="people-list" style={{zoom:"80%",height:'615px',maxHeight:'100%',overflowY:'auto'}}>
                                <div id="chat_user_2">
                                    <ul className="chat-list list-unstyled">
                                        {
                                            this.state.barang_data.length>0?this.state.barang_data.map((v,i)=>{
                                                let bg={backgroundColor:'transparent'};
                                                let titleColor='black';
                                                let descColor='#a1887f';
                                                let isCheck='fa-check';
                                                this.state.detail.map((x,y)=>{
                                                    if(v.id===x.id){
                                                        bg={backgroundColor:'green'};
                                                        titleColor='white';
                                                        descColor='white';
                                                        isCheck='fa-close';
                                                    }
                                                    return null;
                                                });

                                                return (
                                                    <li style={bg} onClick={(event)=>this.handleAddBarang(event,i)} id={`item${i}`} className="clearfix" key={i}>
                                                        <span className="circle" style={{float:"left"}}>{i + 1}</span>
                                                        <span className="circle" style={{float:"right"}}><i className={`fa ${isCheck}`}/></span>

                                                        <div className="about">
                                                            <div className="status" style={{color:titleColor,fontWeight:"bold", wordBreak:"break-all", fontSize:"12px"}}>{v.title}</div>
                                                            <div className="status" style={{color:descColor,fontWeight:"bold", wordBreak:"break-all", fontSize:"12px"}}>Rp {toCurrency(v.harga)} .-</div>
                                                        </div>
                                                    </li>
                                                );
                                            }):<center><img className={"img img-fluid"} style={{width:"100%",height:"300px"}} src={NOTIF_ALERT.NO_DATA} alt=""/></center>
                                        }
                                    </ul>
                                </div>
                            </div>
                            <hr/>
                            <div className="form-group">
                                <button className={"btn btn-primary"} style={{width:"100%"}} onClick={this.handleLoadMore}>{this.props.loadingbrg?'tunggu sebentar ...':'tampilkan lebih banyak'}</button>

                                {/*<button className={"btn btn-primary"} style={{width:"100%"}} onClick={this.handleLoadMore}>tampilkan lebih banyak</button>*/}
                            </div>


                        </div>
                        <div className="col-7 col-xs-7 col-md-5">
                            <div  style={{zoom:"90%",height:'678px',maxHeight:'100%',overflowY:'auto'}}>
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th style={columnStyle}>No</th>
                                        <th style={columnStyle}>Bonus</th>
                                        <th style={columnStyle}>Nama</th>
                                        <th style={columnStyle}>Qty</th>
                                        <th style={columnStyle}>Harga</th>
                                        <th style={columnStyle}>#</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.detail.length>0?this.state.detail.map((v,i)=>{
                                            let errQty='';
                                            // let isRead=true;
                                            // if(v.isSelected==='1'){
                                            //     isRead=false;
                                            if(v.qty<1){
                                                errQty="qty tidak boleh kosong";
                                            }
                                            // }
                                            return (
                                                <tr key={i}>
                                                    <td style={columnStyle}>
                                                        <span className="circle" style={v.isSelected==="1"?{background:"#5d78ff",color:"white"}:{background:"#e3e3e3"}}>{i+1}</span>
                                                    </td>
                                                    <td style={columnStyle}>
                                                        <input type="checkbox" name="checked" checked={v.checked} onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                    </td>
                                                    <td style={columnStyle}> {v.title}</td>
                                                    <td style={columnStyle}>
                                                        <input style={{textAlign:"center",width:'100px'}} type="text" name="qty" className="form-control" value={toCurrency(v.qty)} onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                        {
                                                            <small style={{color:"red",fontWeight:'bold'}}>{errQty}</small>
                                                        }
                                                    </td>
                                                    <td style={columnStyle}> Rp {toCurrency(v.harga)} .-</td>
                                                    <td style={columnStyle}>
                                                        <button className={"btn btn-sm btn-danger"} onClick={(event)=>this.handleRemove(event,i)}>
                                                            <i className={"fa fa-close"}/>
                                                        </button>
                                                    </td>

                                                </tr>
                                            );
                                        }):(
                                            <tr>
                                                <td colSpan={6}>
                                                    <center><img src={NOTIF_ALERT.NO_DATA} alt=""/></center>
                                                </td>
                                            </tr>
                                        )
                                    }

                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-group">
                                <label>title</label>
                                <input type="text" className="form-control" name="title" value={this.state.title} onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Tipe</label>
                                <select className="form-control form-control-lg" name="type" value={this.state.type} onChange={this.handleChange} defaultValue={this.state.type}>
                                    <option value="">=== Pilih ===</option>
                                    <option value="0">Aktivasi</option>
                                    <option value="1">Repeat Order</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Harga</label>
                                <input type="text" className="form-control" name="harga" value={toCurrency(this.state.harga)} onChange={this.handleChange} />
                            </div>

                            <div className="row">
                                <div className={parseInt(this.state.type,10)===0?"col-md-6 col-sm-12":"col-md-12 col-sm-12"}>
                                <div className="form-group">
                                    <label>Deskripsi</label>
                                    <textarea type="text" rows="6" className="form-control" name="deskripsi" onChange={this.handleChange} >
                                        {this.state.deskripsi} 
                                    </textarea>
                                </div>
                                </div>
                                <div className="col-md-6 col-sm-12" style={parseInt(this.state.type,10)===0?{display:'block'}:{display:'none'}}>
                                    <div className="row">
                                        <div className="col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>Jenis Membership</label>
                                                <Membership handleChange={this.HandleChangeCategory.bind(this)} id={this.state.kategori}/>
                                                {/*{*/}
                                                    {/*typeof this.props.kategori.data === 'object' ?*/}
                                                        {/*(*/}
                                                            {/*<Select*/}
                                                                {/*options={this.state.kategori_data}*/}
                                                                {/*placeholder="Pilih Membership"*/}
                                                                {/*onChange={this.HandleChangeCategory}*/}
                                                                {/*value={*/}
                                                                {/*this.state.kategori_data.find(op => {*/}
                                                                    {/*return op.value === this.state.kategori*/}
                                                                {/*})*/}
                                                            {/*}*/}

                                                            {/*/>*/}
                                                        {/*)*/}
                                                    {/*: <Skeleton height={40}/>*/}
                                                {/*}*/}

                                            </div>
                                        </div>
                                        <div className="col-md-12 col-sm-12">
                                            <div className="form-group">
                                                <label>PV</label>
                                                <input type="number" className="form-control" name="point_volume" value={this.state.point_volume} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                     <div className="form-group">
                                        <label>PPN</label>
                                        <input type="number" className={"form-control"} name={"ppn"} value={this.state.ppn} onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select className="form-control form-control-lg" name="status" value={this.state.status} onChange={this.handleChange} defaultValue={this.state.status}>
                                            <option value="">=== Pilih ===</option>
                                            <option value="1">Aktif</option>
                                            <option value="0">Tidak Aktif</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Gambar <small style={{color:"red",fontWeight:"bold"}}>{this.props.detail.id!==''?"( kosongkan apabila tidak akan diubah )":""}</small></label><br/>
                                <File64 multiple={ false }
                                    maxSize={2048} //in kb
                                    fileType='png, jpg' //pisahkan dengan koma
                                    className="mr-3 form-control-file"
                                    onDone={ this.handleFile.bind(this) }
                                    showPreview={true}
                                    lang='id'
                                    previewLink={this.state.prev}
                                    previewConfig={{
                                        width:'100px',
                                        height: '100px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="form-group" style={{textAlign:"right"}}>
                        <button style={{color:"white"}} type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle} ><i className="ti-close"/>Keluar</button>
                        <button type="submit" className="btn btn-primary mb-2 mr-2" onClick={this.handleValidation} ><i className="ti-save" />{!this.props.isLoadingPost?'Simpan':'Loading ......'}</button>
                    </div>
                </ModalFooter>
            </WrapperModal>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        isLoadingPost: state.paketReducer.isLoadingPost,
        // isLoading: state.barangReducer.isLoading,
        // isLoadingDetail: state.paketReducer.isLoadingDetail,
        isError: state.paketReducer.isError,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        // paketDetail:state.paketReducer.detail,
        loadingbrg: state.barangReducer.isLoading,

        // kategori:state.kategoriReducer.data,
        // barang:state.barangReducer.data,
        // dataDetail:state.paketReducer.detail
        barang:state.barangReducer.data,


    }
}
export default connect(mapStateToProps)(FormPaket);