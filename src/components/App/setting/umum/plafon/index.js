import React,{Component} from 'react';
import {connect} from "react-redux";
import {fetchPlafon,updatePlafon} from 'redux/actions/setting/general.action'
class Index extends Component{
    constructor(props){
        super(props);
        this.state={
        
        };
        this.handleChange = this.handleChange.bind(this)
        this.handleEnterSubmit = this.handleEnterSubmit.bind(this)
    }

    componentDidMount(){
        this.props.dispatch(fetchPlafon());
    }

    static getDerivedStateFromProps(props, state) {
        if(props.plafon!==undefined && props.plafon.length!==0){
            if (props.plafon !== state.prevplafonProps) {
                let data = state 
                data=Object.assign({}, data, {
                    prevplafonProps: props.plafon,
                });
                props.plafon.map(i=>{
                    data=Object.assign({}, data, {
                        [i.membership+'|plafon']: i.plafon,
                        [i.membership+'|flush_in']: i.flush_in
                    });
                })
                return data;
            }
        }

    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleEnterSubmit = (event, id, title) => {
        const key_data = event.target.name;
        const data = {
            [key_data.split('|')[1]]: event.target.value,
        }
        this.props.dispatch(updatePlafon(data, id,title))
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
                                    this.props.plafon.length>0?
                                        this.props.plafon.map(i=>(
                                             <div>
                                                <h6>Plafon {i.membership}</h6>
                                                <div className='form-group'>
                                                    <label>Plafon</label>
                                                    <div className="input-group mb-3">
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text" id="basic-addon4">Rp</span>
                                                        </div>
                                                        <input type="number" name={i.membership+'|plafon'} onKeyPress={
                                                                (event)=>{
                                                                    if (event.key === 'Enter')this.handleEnterSubmit(event,i.id,i.membership)
                                                                }
                                                            }
                                                            onChange={(event)=>this.handleChange(event)}
                                                            value={this.state[i.membership+'|plafon']}
                                                            className="form-control" 
                                                        />
                                                    </div>
                                                </div>
                                                <div className='form-group'>
                                                    <label>Flush In</label>
                                                    <div className="input-group mb-3">
                                                        <input type="number" name={i.membership+'|flush_in'} onKeyPress={
                                                                (event)=>{
                                                                    if (event.key === 'Enter')this.handleEnterSubmit(event,i.id,i.membership)
                                                                }
                                                            }
                                                            onChange={(event)=>this.handleChange(event)}
                                                            value={this.state[i.membership+'|flush_in']}
                                                            className="form-control" 
                                                        />
                                                        <div className="input-group-prepend">
                                                            <span className="input-group-text" id="basic-addon4">Pair</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr/>

                                            </div>

                                        ))
                                    :''
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
        isLoading: state.generalReducer.isLoading,
        isOpen:state.modalReducer,
        plafon:state.generalReducer.plafon,
    }
}


export default connect(mapStateToProps)(Index);