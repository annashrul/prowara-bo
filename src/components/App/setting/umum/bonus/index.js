import React,{Component} from 'react';
import {connect} from "react-redux";
import {fetchBonus,fetchBonusRo,updateBonus,updateBonusRo} from "redux/actions/setting/bonus.action"
import Preloader from 'Preloader'
class Index extends Component{
    constructor(props){
        super(props);
        this.state={BS:0,RD:0,PJ:0,BP:0,PD:0,MS:0,SF:0,IT:0,CS:0,DV:0,GP:0,PR:0,RO_PP:0,RO_RR:0,RO_MT:0,RO_SE:0,RO_SF:0,RO_PJ:0,RO_CS:0,RO_PO:0,RO_PB:0,RO_DV:0,RO_GP:0,RO_SN:0,RO_BN:0,RO_SS:0,RO_BG:0};
        this.handleChange = this.handleChange.bind(this)
        this.handleEnterSubmit = this.handleEnterSubmit.bind(this)
        this.handleEnterSubmitRo = this.handleEnterSubmitRo.bind(this)
    }

    componentDidMount(){
        this.props.dispatch(fetchBonus());
        this.props.dispatch(fetchBonusRo());
    }

    static getDerivedStateFromProps(props, state) {
        if(props.bonus!==undefined && props.bonus.length!==0){
            if (props.bonus !== state.prevbonusProps) {
                let data = state 
                data=Object.assign({}, data, {
                    prevbonusProps: props.bonus,
                });
                props.bonus.map(i=>{
                    data=Object.assign({}, data, {
                        [i.kode]: i.kode === 'PR' ? i.flat : i.percentage
                    });
                })
                return data;
            }
        }

        if (props.bonus_ro !== undefined && props.bonus_ro.length !== 0) {
            if (props.bonus_ro !== state.prevbonus_roProps) {
                let data = state
                data = Object.assign({}, data, {
                    prevbonus_roProps: props.bonus_ro,
                });
                props.bonus_ro.map(i => {
                    data = Object.assign({}, data, {
                        ["RO_"+i.kode]: i.kode === 'BN' ||i.kode === 'BG' ? i.flat : i.percentage
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

    handleEnterSubmit = (event,name, note,id) => {
        event.preventDefault();
        const data = name==='PR'?{flat:this.state[name]}:{percentage: this.state[name]};
        this.props.dispatch(updateBonus(data, id, note))
    }

    handleEnterSubmitRo = (event,name, note,id) => {
        event.preventDefault();
        const data = name==='RO_BN' || name==='RO_BG'?{flat:this.state[name]}:{percentage: this.state[name]};
        this.props.dispatch(updateBonusRo(data, id, note))
    }


    render(){
        return(
            <div className="card">
                <div className="card-body">
                        {
                            this.props.isLoading?<Preloader/>:(
                                <div>

                                    <div className="row" >
                                            <div className="col-md-12">
                                            <div className="alert bg-secondary text-light">
                                                Setelah melakukan perubahan silahkan <span style={{fontWeight:'800', color:'yellow'}}>tekan tombol "Enter"</span> untuk melakukan update, tidak berlaku jika terdapat tombol simpan diatasnya.
                                            </div>

                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className='col-md-6 col-sm-12'>
                                            <h4 className="margin-bottom-20" style={{marginTop:'30px',marginBottom:'20px'}}>Konfigurasi Bonus Aktivasi/Registrasi</h4>
                                            {
                                                this.props.bonus.length>0?
                                                    this.props.bonus.map(i=>(
                                                        <div className='form-group' key={i}>
                                                            <label>{i.note}</label>
                                                            <div className="input-group mb-3">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text" id="basic-addon4">{i.kode}</span>
                                                                </div>
                                                                <input type="text" name={i.kode} onKeyPress={
                                                                        (event)=>{
                                                                            if (event.key === 'Enter')this.handleEnterSubmit(event,i.kode,i.note,i.id)
                                                                        }
                                                                    }
                                                                    onChange={(event)=>this.handleChange(event)}
                                                                    value={this.state[i.kode]}
                                                                    className="form-control" 
                                                                />
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text" id="basic-addon4">{i.kode!=='PR'?'%':'Rupiah'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    ))
                                                :''
                                            }
                                    
                                        </div>
                                        <div className='col-md-6 col-sm-12'>
                                            <h4 className="margin-bottom-20" style={{marginTop:'30px',marginBottom:'20px'}}>Konfigurasi Bonus Royalti Generasi/Repeat Order</h4>

                                            {
                                                this.props.bonus_ro.length>0?
                                                    this.props.bonus_ro.map(i=>(
                                                        <div className='form-group' key={i}>
                                                            <label>{i.note}</label>
                                                            <div className="input-group mb-3">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text" id="basic-addon4">{i.kode}</span>
                                                                </div>
                                                                <input type="text" name={'RO_'+i.kode} onKeyPress={
                                                                        (event)=>{
                                                                            if (event.key === 'Enter') this.handleEnterSubmitRo(event,'RO_'+i.kode,i.note,i.id)
                                                                        }
                                                                    }
                                                                    onChange={(event)=>this.handleChange(event)}
                                                                    value={this.state['RO_'+i.kode]}
                                                                    className="form-control" 
                                                                />
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text" id="basic-addon4">{i.kode === 'BN' ||i.kode === 'BG'?'Rupiah':'%'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    ))
                                                :''
                                            }
                                    
                                        </div>
                                    </div>
                                </div>
                                
                            )
                        }
                            
                        
                 </div>
            </div>


        );
    }
}
const mapStateToProps = (state) => {
    return {
        isLoading: state.bonusSettingReducer.isLoading,
        isOpen:state.modalReducer,
        bonus:state.bonusSettingReducer.bonus,
        bonus_ro:state.bonusSettingReducer.bonus_ro
    }
}


export default connect(mapStateToProps)(Index);