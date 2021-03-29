import React, { Component } from 'react';
import {Link} from "react-router-dom"
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom"
import { logoutUser } from "redux/actions/authActions";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import Preloader from "../../Preloader";
import SingleMenu from "../common/singleMenu";
import DoubleMenu from "../common/doubleMenu";
import ThirdMenu from "../common/thirdMenu";

class SideMenu extends Component {
    constructor(props){
        super(props);
        this.state ={
            aksesMember:[],
        }
    }

    menuChange(argument){
        let arr = this.state.aksesMember;
        arr.map((v,i)=>{
            if(argument.parent===v.label&&argument.child==='')v.isToggle=!v.isToggle;
            if(v.sub!==undefined){
                v.sub.map((row,idx)=>{
                    if(argument.parent===v.label&&argument.child!==''){
                        if(argument.child===row.label){
                            v.isToggle=true;
                            row.isToggle=!row.isToggle;
                        }
                    }
                })
            }
        });
        this.setState({aksesMember:arr})
    }

    handleToggle(props,array){
        const path = props.location.pathname;
        array.map((v,i)=>{
            if(v.sub!==undefined){
                v.sub.map((val,key)=>{
                    if(val.sub===undefined){
                        if(`/${val.label.replaceAll(" ","_")}`=== path) {
                            if(val.parent===v.label)v.isToggle=!v.isToggle;
                        }
                    }
                    if(val.sub!==undefined){
                        val.sub.map((row,idx)=>{
                            if(`/${row.label.replaceAll(" ","_")}`=== path)v.isToggle=true;val.isToggle=true;
                        })
                    }

                })
            }
        });
        this.setState({aksesMember:array})
    }

    getProps(param){
        if (param.auth.user) {
            if(param.auth.user!==undefined){
                let akses = param.auth.user.access_level;
                if(akses!==undefined)this.handleToggle(param,akses);
            }

        }
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    componentDidMount(){
        this.getProps(this.props);
    }
    componentWillReceiveProps = (nextProps) => {
        this.getProps(nextProps);
    }
    handleLogout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Apakah anda yakin akan logout aplikasi?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya!'
        }).then((result) => {
            if (result.value) {
                this.props.logoutUser();
            }
        })
    };

    render() {
        const path = this.props.location.pathname;
        const {
            aksesMember
        }=this.state;
        return (
            <nav>
                {
                    this.props.auth.user.access_level===undefined?<Preloader/>:(
                        <ul className="sidebar-menu" data-widget="tree">
                            <SingleMenu display={'1'} isActive={path==='/'?"active":''} path={"/"} icon={"fa fa-dashboard"} label={"Dashboard"}/>
                            {
                                (()=>{
                                    let child =[];
                                    aksesMember.map((val,idx)=>{
                                        if(val.sub===undefined&&val.otherSub===undefined){
                                            child.push(
                                                <SingleMenu key={idx} display={val.isChecked} isActive={path===val.path?'active':''} path={val.path} icon={"fa fa-dashboard"} label={val.label}/>
                                            )
                                        }
                                        else if(val.sub!==undefined&&val.otherSub===undefined){
                                            child.push(
                                                <DoubleMenu
                                                    key={idx}
                                                    changeMenu={this.menuChange.bind(this)}
                                                    isActive={val.isToggle}
                                                    isDisplay={val.isChecked}
                                                    arg1={val.label}
                                                    arg2={''}
                                                    icon={'zmdi zmdi-receipt'}
                                                    label={val.label}
                                                    path={path}
                                                    data={
                                                        (()=>{
                                                            let subChild =[];
                                                            val.sub.map(menuVal=>{
                                                                if(menuVal.label!==''){
                                                                    subChild.push(
                                                                        {path:menuVal.path,display:menuVal.isChecked,label:menuVal.label}
                                                                    )
                                                                }
                                                                return null;
                                                            });
                                                            return subChild;
                                                        })()
                                                    }
                                                />
                                            )
                                        }
                                        else{
                                            child.push(
                                                <ThirdMenu
                                                    key={idx}
                                                    changeMenu={this.menuChange.bind(this)}
                                                    changeSubMenu={this.menuChange.bind(this)}
                                                    isActive={val.isToggle}
                                                    isDisplay={val.isChecked}
                                                    arg1={val.label}
                                                    arg2={''}
                                                    label={val.label}
                                                    path={path}
                                                    data={
                                                        (()=>{
                                                            let subChild =[];
                                                            val.sub.map(valKey=>{
                                                                subChild.push(
                                                                    {
                                                                        isActive:valKey.isToggle, isDisplay:valKey.isChecked, arg1:valKey.label, label:valKey.label.replaceAll("_"," ").toLowerCase(), path:``,
                                                                        data:(()=>{
                                                                            let thirdSub=[];
                                                                            valKey.sub.map((row,idx)=>{
                                                                                thirdSub.push({isDisplay:row.isChecked,label:row.label,path:row.path});
                                                                                return null;
                                                                            });
                                                                            return thirdSub
                                                                        })()
                                                                    }
                                                                )

                                                            })
                                                            return subChild;
                                                        })()
                                                    }
                                                />
                                            );
                                        }
                                        return null;
                                    });
                                    return child;
                                })()

                            }

                            {/* ===================================LOGOUT MODUL START */}
                            <li><a href={null} style={{cursor:'pointer',color:'#a6b6d0'}} onClick={(event)=>this.handleLogout(event)}> <i className="fa fa-sign-out" /><span> Logout</span></a></li>
                            {/* ===================================LOGOUT MODUL END=================================== */}
                        </ul>
                    )
                }

            </nav>
        )
    }
}
SideMenu.propTypes = {
    logoutUser: PropTypes.func.isRequired
};
const mapStateToProps = (state) => {
    return{
        auth: state.auth
    }
}

export default withRouter(connect(mapStateToProps,{logoutUser})(SideMenu))