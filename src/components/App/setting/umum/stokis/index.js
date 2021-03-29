import React,{Component} from 'react';
import {connect} from "react-redux";
import {fetchPlafon,updatePlafon} from 'redux/actions/setting/general.action'
import {fetchKonfigurasiStokis, updateKonfigurasiStokis} from "../../../../../redux/actions/setting/stokis.action";
import Preloader from "../../../../../Preloader";
import {rmComma, toCurrency} from "../../../../../helper";
class Index extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[]
        };
        this.handleChange = this.handleChange.bind(this)
        this.handleEnterSubmit = this.handleEnterSubmit.bind(this)
    }

    componentDidMount(){
        this.props.dispatch(fetchKonfigurasiStokis());
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.data!==undefined||nextProps.data.length>0){
            this.setState({data:[...nextProps.data]});
        }
    }


    handleChange = (e,i) => {
        let column = e.target.name;
        let value = e.target.value;
        let data = [...this.state.data];
        data[i] = {...data[i], [column]: value};
        this.setState({data:data});

    }

    handleEnterSubmit = (event, id) => {
        const data = {
            [event.target.name]:rmComma(event.target.value),
        }
        this.props.dispatch(updateKonfigurasiStokis(data, id))
    }


    render(){
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
                        <div className='col-md-6 offset-md-3 col-sm-12'>

                            {
                                typeof this.state.data==='object'?this.state.data.length>0?this.state.data.map((v,i)=>{
                                    return (
                                        <div className="row" key={i}>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="">Tipe</label>
                                                    <input type="text" className="form-control" name={"type"} value={v.type===1?'Kota/Kabupate':'Kecamatan'} readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="">Potongan</label>
                                                    <input type="text" className="form-control" name={"potongan"} value={toCurrency(v.potongan)} onChange={(event)=>this.handleChange(event,i)}
                                                           onKeyPress={
                                                               (event)=>{
                                                                   if (event.key === 'Enter')this.handleEnterSubmit(event,v.id)
                                                               }
                                                           }

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }):"":<Preloader/>
                            }

                        </div>

                    </div>
                </div>
            </div>


        );
    }
}
const mapStateToProps = (state) => {
    return {
        isLoading: state.konfigurasiStokisReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.konfigurasiStokisReducer.data,
    }
}


export default connect(mapStateToProps)(Index);