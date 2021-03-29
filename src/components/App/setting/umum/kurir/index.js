import React,{Component} from 'react';
import {connect} from "react-redux";
import {fetchPlafon,updatePlafon} from 'redux/actions/setting/general.action'
import {fetchKonfigurasiStokis, updateKonfigurasiStokis} from "../../../../../redux/actions/setting/stokis.action";
import Preloader from "../../../../../Preloader";
import {rmComma, toCurrency} from "../../../../../helper";
import {fetchKurir, updateKurir} from "../../../../../redux/actions/setting/general.action";
import * as Swal from "sweetalert2";
class Index extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[]
        };
        this.handleUpdate = this.handleUpdate.bind(this)
    }

    componentDidMount(){
        this.props.dispatch(fetchKurir());
    }



    handleUpdate = (e,stat, id,txt) => {
        e.preventDefault();
        Swal.fire({
            title: 'Perhatian !!!',
            html:`anda yakin akan ${txt} ??`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Oke`,
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(updateKurir({"status":stat},id));
            }
        })
    }


    render(){
        const headStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};
        console.log(this.props.data);
        return(
            <div className="card">
                <div className="card-body">
                    <div className="row" >
                        <div className="col-md-12">
                            <div className="alert bg-secondary text-light">
                                Setelah melakukan perubahan silahkan <span style={{fontWeight:'800', color:'yellow'}}>tekan tombol "Enter"</span> untuk melakukan update, tidak berlaku jika terdapat tombol simpan diatasnya.
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className='col-sm-12'>
                            <div style={{overflowX: "auto"}}>
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th className="text-black" style={headStyle}>No</th>
                                        <th className="text-black" style={headStyle}>#</th>
                                        <th className="text-black" style={headStyle}>Gambar</th>
                                        <th className="text-black" style={headStyle}>Title</th>
                                        <th className="text-black" style={headStyle}>Kurir</th>
                                        <th className="text-black" style={headStyle}>Deskripsi</th>
                                        <th className="text-black" style={headStyle}>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        typeof this.props.data==='object'?this.props.data.length>0?this.props.data.map((v,i)=>{
                                            let btn='';
                                            let txtBtn='';
                                            let iconBtn='';
                                            let iconStatus='';
                                            let stat=0;
                                            let txtStat='';
                                            if(v.status===1){
                                                stat=0;
                                                txtStat='Menonaktifkan status kurir '+v.kurir;
                                                btn="btn-success";
                                                txtBtn='Aktif';
                                                iconStatus="fa-close";
                                                iconBtn='btn-danger';
                                            }else{
                                                stat=1;
                                                txtStat='Mengaktifkan status kurir '+v.kurir;
                                                btn="btn-danger";
                                                txtBtn='Tidak Aktif';
                                                iconStatus="fa-check";
                                                iconBtn='btn-success';
                                            }
                                            return(
                                                <tr key={i}>
                                                    <td style={headStyle}>{i+1}</td>
                                                    <td style={headStyle}>
                                                        <button className={`btn ${iconBtn} btn-sm`} onClick={(e)=>this.handleUpdate(e,stat,v.id,txtStat)}><i className={`fa ${iconStatus}`}/></button>
                                                    </td>
                                                    <td style={headStyle}>
                                                        <img style={{height:"40px"}} src={v.gambar} alt=""/>
                                                    </td>
                                                    <td style={headStyle}>
                                                        {v.title}
                                                    </td>
                                                    <td style={headStyle}>
                                                        {v.kurir}
                                                    </td>
                                                    <td style={headStyle}>
                                                        {v.deskripsi}
                                                    </td>
                                                    <td style={headStyle}>

                                                        <button className={`btn ${btn} btn-sm`}>{txtBtn}</button>
                                                    </td>
                                                </tr>
                                            );
                                        }):"":<Preloader/>
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        );
    }
}
const mapStateToProps = (state) => {
    console.log("NU AINF",state.kurirReducer);

    return {
        isLoading: state.kurirReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.kurirReducer.data,
    }
}


export default connect(mapStateToProps)(Index);