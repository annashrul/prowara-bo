import React,{Component} from 'react';
import {connect} from "react-redux";
import {fetchPlafon,updatePlafon} from 'redux/actions/setting/general.action'
import {
    deleteDataPoinKeliparanRO,
    fetchDataPoinKeliparanRO, insertDataPoinKeliparanRO,
    updateDataPoinKeliparanRO
} from "../../../../../redux/actions/setting/poin_kelipatan_ro.action";
import Preloader from "../../../../../Preloader";
import {rmComma, toCurrency,ToastQ} from "../../../../../helper";
import * as Swal from "sweetalert2";
class Index extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[],
            qty:'0',
            nilai_poin:'0'
        };
        this.handleChange = this.handleChange.bind(this)
        this.handleEnterSubmit = this.handleEnterSubmit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }

    componentDidMount(){
        this.props.dispatch(fetchDataPoinKeliparanRO());
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.data!==undefined||nextProps.data.length>0){
            this.setState({data:[...nextProps.data]});
        }
    }


    handleChange = (e,i) => {
        let column = e.target.name;
        let value = e.target.value;
        if(i!==null){
            let data = [...this.state.data];
            data[i] = {...data[i], [column]: value};
            this.setState({data:data});
        }else{
            this.setState({
                [column]:value
            })
        }


    }

    handleEnterSubmit = (event,i) => {
        console.log("anying")
        if(i!==null){
            let data = [...this.state.data];
            let parseData={
                [event.target.name]:rmComma(event.target.value)
            }
            this.props.dispatch(updateDataPoinKeliparanRO(parseData,data[i].id));
        }
        else{

            let parseData={
                "qty":rmComma(this.state.qty),
                "nilai_poin":rmComma(this.state.nilai_poin),
            }
            if(isNaN(parseData['qty'])){
                ToastQ.fire({icon:'error',title:`qty tidak boleh kosong`});
                return;
            }
            if(isNaN(parseData['nilai_poin'])){
                ToastQ.fire({icon:'error',title:`nilai poin tidak boleh kosong`});
                return;
            }
            this.props.dispatch(insertDataPoinKeliparanRO(parseData));
            this.setState({qty:'0',nilai_poin:'0'});
            console.log(parseData)
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
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(deleteDataPoinKeliparanRO(id));
            }
        })
    }


    render(){
        const headStyle ={verticalAlign: "middle", textAlign: "center",whiteSpace: "nowrap"};

        return(
            <div className="card">
                <div className="card-body">
                    <div className="row" >
                        <div className="col-md-12">
                            <div className="alert bg-secondary text-light">
                                khusus untuk edit data eetelah melakukan perubahan silahkan <span style={{fontWeight:'800', color:'yellow'}}>tekan tombol "Enter"</span> untuk melakukan update, tidak berlaku jika terdapat tombol simpan diatasnya.
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className='col-sm-12'>
                            <div style={{overflowX: "auto"}}>
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th className="text-black" style={headStyle}>Qty</th>
                                        <th className="text-black" style={headStyle}>Nilai Poin</th>
                                        <th className="text-black" style={headStyle}>#</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <div>
                                                <input type="text" className="form-control" name={"qty"} value={toCurrency(this.state.qty)} onChange={(event)=>this.handleChange(event,null)}/>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <input type="text" className="form-control" name={"nilai_poin"} value={toCurrency(this.state.nilai_poin)} onChange={(event)=>this.handleChange(event,null)}/>

                                            </div>
                                        </td>
                                        <td style={headStyle}>
                                            <div>
                                                <button className="btn btn-primary btn-sm" onClick={(event)=>this.handleEnterSubmit(event,null)}><i className="fa fa-paper-plane"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                    {
                                        typeof this.state.data==='object'?this.state.data.length>0?this.state.data.map((v,i)=>{
                                            return(
                                                <tr key={i}>
                                                    <td>
                                                        <input type="text" className="form-control" name={"qty"} value={toCurrency(v.qty)} onChange={(event)=>this.handleChange(event,i)}
                                                               onKeyPress={
                                                                   (event)=>{
                                                                       if (event.key === 'Enter')this.handleEnterSubmit(event,i)
                                                                   }
                                                               }
                                                        />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" name={"nilai_poin"} value={toCurrency(v.nilai_poin)} onChange={(event)=>this.handleChange(event,i)}
                                                               onKeyPress={
                                                                   (event)=>{
                                                                       if (event.key === 'Enter')this.handleEnterSubmit(event,i)
                                                                   }
                                                               }

                                                        />
                                                    </td>
                                                    <td style={headStyle}>
                                                        <button className="btn btn-danger btn-sm" onClick={(event)=>this.handleDelete(event,v.id)}><i className="fa fa-trash"/></button>
                                                    </td>
                                                </tr>
                                            );
                                        }):"":<div><Preloader/></div>
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
    // console.log("STATE AING",state);
    return {
        isLoading: state.poinKelipatanRoReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.poinKelipatanRoReducer.data,
    }
}


export default connect(mapStateToProps)(Index);