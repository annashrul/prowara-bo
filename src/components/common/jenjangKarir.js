
import React,{Component} from "react";
import connect from "react-redux/es/connect/connect";
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import {fetchKarir} from "../../redux/actions/setting/general.action";
class JenjangKarir extends Component{

    constructor(props){
        super(props);
        this.state={
            data_karir:[],
            karir:''
        };
        this.HandleChangeKarir=this.HandleChangeKarir.bind(this);
    }
    componentWillMount(){
        this.getProps(this.props);
        this.props.dispatch(fetchKarir());
    }
    componentDidMount(){
        this.getProps(this.props);
    }
    getProps(props){
        if(props.id!==''){
            this.setState({karir:props.id});
        }
    }

    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
        let karir=[];
        if(nextProps.id==='semua'){
            karir.push({value:'-',label:'Semua'});
        }else{
            karir=[];
        }
        if(nextProps.karir!==undefined){
            if(nextProps.karir.length>0){
                nextProps.karir.map((v,i)=>{
                    karir.push({value:v.id,label:v.title});
                });
            }else{
                karir=[];
            }
        }
        this.setState({data_karir:karir});
    }
    HandleChangeKarir(val){
        this.setState({
            karir:val.value
        });
        this.props.handleChange({value:val.value,label:val.label});
    }
    render(){
        return(
            typeof this.props.karir === 'object' ? (
                <Select
                    options={this.state.data_karir}
                    placeholder="Pilih Karir"
                    onChange={this.HandleChangeKarir}
                    value={
                        this.state.data_karir.find(op => {
                            return op.value === this.state.karir
                        })
                    }

                />
            ) : <Skeleton height={40}/>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        karir:state.generalReducer.karir
    }
}
export default connect(mapStateToProps)(JenjangKarir)
