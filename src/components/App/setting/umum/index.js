import React,{Component} from 'react';
import {connect} from "react-redux";
import Layout from 'components/Layout';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import moment from 'moment'
import General from './general'
import Bonus from './bonus'
import Plafon from './plafon'
import Karir from './karir'
import PoinKelipatanRo from './poin_kelipatan_ro'
import Stokis from './stokis'
import Kurir from './kurir'

class IndexPin extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{},
            any:"",
            type:0,
            last:'',
            dateFrom:moment().format("yyyy-MM-DD"),
            dateTo:moment().format("yyyy-MM-DD")
        };
    }
   


    render(){
        return(
            <Layout page={"Pengaturan Umum"}>
                <div className="row">
                    <div className="col-12 box-margin">
                        
                            <Tabs>
                            <TabList style={{margin:'0px'}}>
                                <Tab>General</Tab>
                                <Tab>Konfigurasi Bonus</Tab>
                                <Tab>Konfigurasi Plafon</Tab>
                                <Tab>Konfigurasi Karir</Tab>
                                <Tab>Poin Kelipatan RO</Tab>
                                <Tab>Konfigurasi Stokis</Tab>
                                <Tab>Kurir</Tab>
                            </TabList>

                            <TabPanel>
                                <General/>
                            </TabPanel>
                            <TabPanel>
                                <Bonus/>
                            </TabPanel>
                            <TabPanel>
                                <Plafon/>
                            </TabPanel>
                            <TabPanel>
                                <Karir/>
                            </TabPanel>
                            <TabPanel>
                                <PoinKelipatanRo/>
                            </TabPanel>
                                <TabPanel>
                                    <Stokis/>
                                </TabPanel>
                                <TabPanel>
                                    <Kurir/>
                                </TabPanel>
                        </Tabs>
                    </div>
                </div>
                
            </Layout>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        isLoading: state.pinReducer.isLoading,
        isOpen:state.modalReducer,
        data:state.pinReducer.data,
    }
}


export default connect(mapStateToProps)(IndexPin);