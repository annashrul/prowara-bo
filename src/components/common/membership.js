
import React,{Component} from "react";
import {connect} from "react-redux";
import Select from 'react-select';
import Skeleton from 'react-loading-skeleton';
import {fetchKategori} from "../../redux/actions/kategori/kategori.action";

class Membership extends Component{

    constructor(props){
        super(props);
        this.state={
            kategori_data:[],
            kategori: "",
        };
        this.HandleChangeMembership=this.HandleChangeMembership.bind(this);
    }
    componentWillMount(){
        // this.getProps(this.props);
        this.props.dispatch(fetchKategori("membership"));
        this.getProps(this.props);
    }
    componentDidMount(){
        this.getProps(this.props);
    }
    getProps(props){
        if(props.id!==''){
            this.setState({kategori:props.id});
        }

    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
        let kategori_data=[];
        if(nextProps.id==='semua'){
            kategori_data.push({value:'-',label:'Semua'});
        }else{
            kategori_data=[];
        }
        if(nextProps.kategori.data!==undefined){
            nextProps.kategori.data.map((v,i)=>{
                kategori_data.push({value:v.id,label:v.title});
            });
        }
        this.setState({kategori_data:kategori_data});


    }
    HandleChangeMembership(val){
        this.setState({
            kategori:val.value
        });
        this.props.handleChange({value:val.value,label:val.label});
    }
    render(){
        return(
            this.state.kategori_data.length>0 ? (
                <Select
                    options={this.state.kategori_data}
                    placeholder="Pilih Membership"
                    onChange={this.HandleChangeMembership}
                    value={
                        this.state.kategori_data.find(op => {
                            return op.value === this.state.kategori
                        })
                    }
                />
            ) : <Skeleton height={40}/>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        kategori:state.kategoriReducer.data,

    }
}
export default connect(mapStateToProps)(Membership)
