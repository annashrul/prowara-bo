import React,{Component} from 'react';
import {connect} from "react-redux";
import File64 from 'components/common/File64'
import Select from 'react-select';
import {fetchGeneral, updateGeneral} from 'redux/actions/setting/general.action'
import {fetchKecamatan,fetchKota,fetchProvinsi} from 'redux/actions/setting/kurir.action'

class Index extends Component{
    constructor(props){
        super(props);
        this.state={
            title:"",
            logo:"",
            address:"",
            email:"",
            no_telp:"",
            fax:"",
            kecamatan_asal:"",
            legalitas:"",
            fb:"",
            twt:"",
            ig:"",
            yt:"",
            website:"",
            data_kec:[],
            data_kota:[],
            data_prov:[],
            wd_charge:0,
            tf_charge:0,
            max_lvl_sponsor:0,
            dp_min: 0,
            wd_min: 0,
            tf_min: 0,
            otp_message:"",
            aktivasi_message: "",
            transaksi_message: "",
            prev:"",
            id_kota:'',
            id_prov:'',
            dataTipeOTP:[{
                value:'gabungan',
                label:'Gabungan'
            }, {
                value: 'single',
                label: 'Single Provider'
            }],
            type_otp: 'gabungan',
            dataProvider:[{
                value:'whatsapp',
                label:'Whatsapp'
            }, {
                value: 'sms',
                label: 'SMS'
            }],
            provider_otp: 'whatsapp'
        };
        this.handleChange = this.handleChange.bind(this)
        this.handleChangeKota = this.handleChangeKota.bind(this)
        this.handleChangeProvinsi = this.handleChangeProvinsi.bind(this)
        this.handleChangeKecamatan = this.handleChangeKecamatan.bind(this)
        this.handleEnterSubmit = this.handleEnterSubmit.bind(this)
        this.handleBtnSubmit = this.handleBtnSubmit.bind(this)
        this.handleTypeOtp = this.handleTypeOtp.bind(this)
        this.handleProviderOtp = this.handleProviderOtp.bind(this)
    }

    componentDidMount(){
        this.props.dispatch(fetchGeneral('page=1'));
        this.props.dispatch(fetchProvinsi());
    }

    static getDerivedStateFromProps(props, state) {
        if(props.data!==undefined && props.data.length!==0){
            if (props.data !== state.prevDataProps) {
                props.dispatch(fetchKota(props.data[0].id_prov));
                props.dispatch(fetchKecamatan(props.data[0].id_kota));

                return {
                    prevDataProps:props.data,
                    title: props.data[0].title,
                    prev: props.data[0].logo,
                    address: props.data[0].address,
                    email: props.data[0].email,
                    no_telp: props.data[0].no_telp,
                    fax: props.data[0].fax,
                    kecamatan_asal: props.data[0].kecamatan_asal,
                    legalitas: props.data[0].legalitas,
                    fb: props.data[0].fb,
                    twt: props.data[0].twt,
                    ig: props.data[0].ig,
                    yt: props.data[0].yt,
                    website: props.data[0].website,
                    id_kota: props.data[0].id_kota,
                    id_prov: props.data[0].id_prov,
                    wd_charge: props.data[1].wd_charge,
                    tf_charge: props.data[1].tf_charge,
                    max_lvl_sponsor: props.data[1].max_lvl_sponsor,
                    dp_min: props.data[1].dp_min,
                    wd_min: props.data[1].wd_min,
                    tf_min: props.data[1].tf_min,
                    otp_message: props.data[1].otp_message,
                    aktivasi_message: props.data[1].aktivasi_message,
                    transaksi_message: props.data[1].transaksi_message,
                    type_otp: props.data[0].type_otp,
                    provider_otp: props.data[0].provider_otp
                }

            }
        }
        if (props.kec !== undefined && props.kec.length !== 0) {
            if (props.kec !== state.prevkecProps) {
                const kecamatan=[];
                props.kec.map((v, i) => {
                        kecamatan.push({
                            value: v.id,
                            label: v.kecamatan
                        });
                })

                return {
                    prevkecProps: props.kec,
                    data_kec: kecamatan
                }

            }
        }

        if (props.kota !== undefined && props.kota.length !== 0) {
            if (props.kota !== state.prevkotaProps) {
                const kota = [];
                props.kota.map((v, i) => {
                    kota.push({
                        value: v.id,
                        label: v.name
                    });
                })

                return {
                    prevkotaProps: props.kota,
                    data_kota: kota
                }

            }
        }

        if (props.provinsi !== undefined && props.provinsi.length !== 0) {
            if (props.provinsi !== state.prevprovinsiProps) {
                const provinsi = [];
                props.provinsi.map((v, i) => {
                    provinsi.push({
                        value: v.id,
                        label: v.name
                    });
                })
                return {
                    prevprovinsiProps: props.provinsi,
                    data_prov: provinsi
                }

            }
        }
    }

    handleChange = (event) => {
        console.log(event.target);
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleEnterSubmit = (event) => {
        const key_data = event.target.name;
        let type = 'site'
        if (key_data === "wd_charge" ||
            key_data === "tf_charge" ||
            key_data === "max_lvl_sponsor" ||
            key_data === "dp_min" ||
            key_data === "wd_min" ||
            key_data === "tf_min") type = 'general'
        const data = {
            [key_data]: event.target.value,
        }
        this.props.dispatch(updateGeneral(data, type))
    }

    handleBtnSubmit = (event,names) => {
        event.preventDefault();
        let type = 'site'
        if (
            names === "otp_message" ||
            names === "aktivasi_message" ||
            names === "transaksi_message") type = 'general'
        const data = {
            [names]: this.state[names]
        }
        this.props.dispatch(updateGeneral(data, type))
    }

    
    
    handleTypeOtp(val) {
        this.props.dispatch(updateGeneral({
            type_otp: val.value
        }, 'site'))

        this.setState({
            type_otp: val.value,
        });
    }

    handleProviderOtp(val) {
        this.props.dispatch(updateGeneral({
            provider_otp: val.value
        }, 'site'))

        this.setState({
            provider_otp: val.value,
        });
    }

    handleChangeKecamatan(val) {
        this.props.dispatch(updateGeneral({
            kecamatan_asal: val.value
        }, 'site'))

        this.setState({
            kecamatan_asal: val.value,
        });
    }

    handleChangeKota(val) {
        this.props.dispatch(fetchKecamatan(val.value))
        this.setState({
            id_kota: val.value,
        });
    }

    handleChangeProvinsi(val) {
        this.props.dispatch(fetchKota(val.value))
        this.setState({
            id_prov: val.value,
            id_kota:'',
            kecamatan_asal: ''

        });
    }

    handleFile(files) {
        this.setState({
            logo: files.base64
        });
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
                        <h4 className="margin-bottom-20" style={{marginTop:'30px',marginBottom:'20px'}}>Konfigurasi Perusahaan</h4>
                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <div className='form-group'>
                                    <label>Nama Perusahaan</label>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon4"><i className="fa fa-building"/></span>
                                        </div>
                                        <input type="text" name='title' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={this.handleChange} value={this.state.title} className="form-control" placeholder="Nama Perusahaan" />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>Website</label>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon4"><i className="fa fa-desktop"/></span>
                                        </div>
                                        <input type="text" name='website' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={(event)=>this.handleChange(event)} value={this.state.website} className="form-control" placeholder="Website" />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>Email</label>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon4"><i className="fa fa-envelope"/></span>
                                        </div>
                                        <input type="text" name='email' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={(event)=>this.handleChange(event)} value={this.state.email} className="form-control" placeholder="Email" />
                                    </div>
                                </div>
                                
                                <div className='form-group'>
                                    <label>Logo Perusahaan <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'logo')}>Simpan</button></label>
                                    <File64 multiple={ false }
                                            maxSize={2048} //in kb
                                            fileType='png, jpg' //pisahkan dengan koma
                                            className="mr-3 form-control-file"
                                            onDone={ this.handleFile.bind(this) }
                                            showPreview={true}
                                            lang='id'
                                            previewLink={this.state.prev}
                                            previewConfig={{
                                                width:'200px',
                                                height: '200px'
                                            }}
                                        />
                                </div>
                                <div className='form-group'>
                                    <label>Alamat Perusahaan <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'address')}>Simpan</button></label>
                                    <textarea rows={6} className="form-control" onChange={(event)=>this.handleChange(event)} name="address" value={this.state.address}></textarea>
                                </div>
                                <div className='form-group'>
                                    <label>Legalitas Perusahaan <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'legalitas')}>Simpan</button></label>
                                    <textarea rows={7} className="form-control" onChange={(event)=>this.handleChange(event)} name="legalitas" value={this.state.legalitas}></textarea>
                                </div>
                            </div>

                            <div className='col-md-6 col-sm-12'>
                                
                                
                                <div className='form-group'>
                                    <label>Fax</label>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon4"><i className="fa fa-phone-square"/></span>
                                        </div>
                                        <input type="text" name='fax' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={(event)=>this.handleChange(event)} value={this.state.fax} className="form-control" placeholder="Fax" />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>Telepon</label>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon4"><i className="fa fa-phone"/></span>
                                        </div>
                                        <input type="text" name='no_telp' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={(event)=>this.handleChange(event)} value={this.state.no_telp} className="form-control" placeholder="Telepon" />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>Provinsi Pengiriman <small>(untuk expedisi)</small></label>
                                        <Select
                                            options={this.state.data_prov}
                                            placeholder="Pilih Provinsi Pengiriman"
                                            onChange={this.handleChangeProvinsi}
                                            value={
                                                this.state.data_prov.find(op => {
                                                    return op.value === this.state.id_prov
                                                })
                                            }

                                        />
                                </div>
                                <div className='form-group'>
                                    <label>Kota Pengiriman <small>(untuk expedisi)</small></label>
                                        <Select
                                            options={this.state.data_kota}
                                            placeholder="Pilih Kota Pengiriman"
                                            onChange={this.handleChangeKota}
                                            value={
                                                this.state.data_kota.find(op => {
                                                    return op.value === this.state.id_kota
                                                })
                                            }

                                        />
                                </div>
                                <div className='form-group'>
                                    <label>Kecamatan Pengiriman <small>(untuk expedisi)</small></label>
                                        <Select
                                            options={this.state.data_kec}
                                            placeholder="Pilih Kecamatan Pengiriman"
                                            onChange={this.handleChangeKecamatan}
                                            value={
                                                this.state.data_kec.find(op => {
                                                    return op.value === this.state.kecamatan_asal
                                                })
                                            }

                                        />
                                </div>

                                <div className='form-group'>
                                    <label>Tipe OTP</label>
                                        <Select
                                            options={this.state.dataTipeOTP}
                                            placeholder="Pilih Tipe OTP"
                                            onChange={this.handleTypeOtp}
                                            value={
                                                this.state.dataTipeOTP.find(op => {
                                                    return op.value === this.state.type_otp
                                                })
                                            }

                                        />
                                </div>

                                {
                                    this.state.type_otp!=='gabungan'?(
                                        <div className='form-group'>
                                            <label>Provider OTP</label>
                                                <Select
                                                    options={this.state.dataProvider}
                                                    placeholder="Pilih Provider OTP"
                                                    onChange={this.handleProviderOtp}
                                                    value={
                                                        this.state.dataProvider.find(op => {
                                                            return op.value === this.state.provider_otp
                                                        })
                                                    }

                                                />
                                        </div>
                                    ):''
                                }


                                
                                <div className='form-group'>
                                    <label>Facebook</label>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon4"><i className="fa fa-facebook-official"/></span>
                                        </div>
                                        <input type="text" name='fb' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={(event)=>this.handleChange(event)} value={this.state.fb} className="form-control" placeholder="Facebook" />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>Twitter</label>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon4"><i className="fa fa-twitter-square"/></span>
                                        </div>
                                        <input type="text" name='twt' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={(event)=>this.handleChange(event)} value={this.state.twt} className="form-control" placeholder="Twitter" />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>Instagram</label>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon4"><i className="fa fa-instagram"/></span>
                                        </div>
                                        <input type="text" name='ig' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={(event)=>this.handleChange(event)} value={this.state.ig} className="form-control" placeholder="Instagram" />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>YouTube</label>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon4"><i className="fa fa-youtube-square"/></span>
                                        </div>
                                        <input type="text" name='yt' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={(event)=>this.handleChange(event)} value={this.state.yt} className="form-control" placeholder="YouTube" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        

                        <h4 style={{marginTop:'30px',marginBottom:'20px'}}>Konfigurasi Umum</h4>
                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <div className='form-group'>
                                    <label>Pesan OTP <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'otp_message')}>Simpan</button></label>
                                    <textarea rows={4} className="form-control" onChange={(event)=>this.handleChange(event)} name="otp_message" value={this.state.otp_message}></textarea>
                                </div>
                                <div className='form-group'>
                                    <label>Pesan Kode Aktivasi <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'aktivasi_message')}>Simpan</button></label>
                                    <textarea rows={4} className="form-control" onChange={(event)=>this.handleChange(event)} name="aktivasi_message" value={this.state.aktivasi_message}></textarea>

                                </div>
                                <div className='form-group'>
                                    <label>Pesan Transaksi OTP <button className="badge badge-success" onClick={(event)=>this.handleBtnSubmit(event,'transaksi_message')}>Simpan</button></label>
                                    <textarea rows={4} className="form-control" onChange={(event)=>this.handleChange(event)} name="transaksi_message" value={this.state.transaksi_message}></textarea>
                                </div>
                                <div>
                                    <h6>Note:</h6>
                                    <ul>
                                        <li>- Gunakan [nama] untuk nama member secara dinamis.</li>
                                        <li>- Gunakan [otp] untuk mengeluarkan kode (otp/aktivasi) secara dinamis.</li>
                                        <li>- Untuk memberi <b>Bold</b> pada pesan gunakan tanda '*' pada awal dan akhir kalimat. <br/>Cth: *ini text bold*</li>
                                    </ul>
                                </div>

                            </div>
                        

                            <div className="col-md-6 col-sm-12">
                                <div className='form-group'>
                                    <label>Withdraw Charge</label>
                                    <div className="input-group">
                                        <input type="number" name='wd_charge' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={(event)=>this.handleChange(event)} value={this.state.wd_charge} className="form-control" placeholder="Withdraw Charge" />
                                        <div className="input-group-append">
                                            <span className="input-group-text">%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>Transfer Charge</label>
                                    <div className="input-group">
                                        <input type="number" name='tf_charge' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={(event)=>this.handleChange(event)} value={this.state.tf_charge} className="form-control" placeholder="Transfer Charge" />
                                        <div className="input-group-append">
                                            <span className="input-group-text">%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>Max Generasi <small>(Untuk pembagian bonus royalti RO)</small></label>
                                    <div className="input-group">
                                        <input type="number" name='max_lvl_sponsor' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={(event)=>this.handleChange(event)} value={this.state.max_lvl_sponsor} className="form-control" placeholder="Max level generasi" />
                                        <div className="input-group-append">
                                            <span className="input-group-text">Level</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>Minimal Deposit</label>
                                    <div className="input-group">
                                        <div className="input-group-append">
                                            <span className="input-group-text">Rp</span>
                                        </div>
                                        <input type="number" name='dp_min' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={(event)=>this.handleChange(event)} value={this.state.dp_min} className="form-control" placeholder="Minimal Deposit" />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>Minimal Withdrawal</label>
                                    <div className="input-group">
                                        <div className="input-group-append">
                                            <span className="input-group-text">Rp</span>
                                        </div>
                                        <input type="number" name='wd_min' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={(event)=>this.handleChange(event)} value={this.state.wd_min} className="form-control" placeholder="Minimal Withdrawal" />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>Minimal Transfer</label>
                                    <div className="input-group">
                                        <div className="input-group-append">
                                            <span className="input-group-text">Rp</span>
                                        </div>
                                        <input type="number" name='max_lvl_sponsor' onKeyPress={
                                            (event)=>{
                                                if (event.key === 'Enter')this.handleEnterSubmit(event)
                                            }
                                        } onChange={(event)=>this.handleChange(event)} value={this.state.max_lvl_sponsor} className="form-control" placeholder="Minimal Transer" />
                                    </div>
                                </div>
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
        data:state.generalReducer.data,
        kec: state.kurirReducer.kecamatan,
        kota: state.kurirReducer.kota,
        provinsi: state.kurirReducer.provinsi
    }
}


export default connect(mapStateToProps)(Index);