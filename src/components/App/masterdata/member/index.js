import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "../../../../components/Layout";
import Paginationq, {
  statusQ,
  ToastQ,
  toCurrency,
  toRp,
} from "../../../../helper";
import { NOTIF_ALERT } from "../../../../redux/actions/_constants";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import moment from "moment";
import DetailInvesment from "../../modals/masterdata/member/detail_invesment";
import {
  getMember,
  putMember,
  setInvesment,
} from "../../../../redux/actions/masterdata/member.action";
import UncontrolledButtonDropdown from "reactstrap/es/UncontrolledButtonDropdown";
import DropdownToggle from "reactstrap/es/DropdownToggle";
import DropdownMenu from "reactstrap/es/DropdownMenu";
import DropdownItem from "reactstrap/es/DropdownItem";
import { fetchKategori } from "../../../../redux/actions/kategori/kategori.action";
import { getExcelMember } from "../../../../redux/actions/masterdata/member.action";
import { toExcel } from "../../../../helper";
import {
  getDetailBank,
  setShowModal,
} from "../../../../redux/actions/masterdata/bank.action";
import * as Swal from "sweetalert2";
import Select from "react-select";
import FormMemberBank from "../../modals/masterdata/member/form_member_bank";

class IndexMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      any: "",
      isLoading: false,
      dateFrom: moment(new Date()).format("yyyy-MM-DD"),
      dateTo: moment(new Date()).format("yyyy-MM-DD"),
      searchBy: "fullname",
      searchByData: [
        { value: "fullname", label: "Nama" },
        { value: "referral", label: "Referral" },
        { value: "mobile_no", label: "Telepon" },
        { value: "status", label: "Status" },
      ],
      membership: "",
      jenjangKarir: "",
      status: "",
      statusData: [
        { value: "", label: "Semua" },
        { value: 0, label: "Tidak Aktif" },
        { value: 1, label: "Aktif" },
      ],
      isModalInvest: false,
    };
    this.handleEvent = this.handleEvent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePage = this.handlePage.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchBy = this.handleSearchBy.bind(this);
    this.printDocumentXLsx = this.printDocumentXLsx.bind(this);
    this.handleStatus = this.handleStatus.bind(this);
    this.handleInvestment = this.handleInvestment.bind(this);
    this.handleBankEdit = this.handleBankEdit.bind(this);
    this.handleMemberEdit = this.handleMemberEdit.bind(this);
  }

  componentWillUnmount() {
    this.setState({ isModalInvest: false });
    this.props.dispatch(setShowModal(false));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataExcel.data !== this.props.dataExcel.data) {
      this.getExcel(this.props);
    }
    // console.log("modal", prevProps.isShowModalInvestment);
    // console.log("modal", this.props.isShowModalInvestment);
    // if (
    //   (prevProps.isShowModalInvestment === false &&
    //     this.props.isShowModalInvestment === true) ||
    //   prevProps.isShowModalInvestment === this.props.isShowModalInvestment
    // ) {
    //   this.props.dispatch(ModalToggle(true));
    //   this.props.dispatch(ModalType("detailInvesment"));
    // }
  }
  componentWillMount() {
    localStorage.removeItem("isAlamat");
    localStorage.removeItem("isBank");
    localStorage.removeItem("isDetail");
    this.props.dispatch(getMember(1));
    this.props.dispatch(fetchKategori(`membership`));
  }
  getExcel(props) {
    if (props.dataExcel.data !== undefined) {
      if (props.dataExcel.data.length > 0) {
        this.setState({ isLoading: false });

        let stts = this.state.status;
        let content = [];
        let totSaldo = 0;
        let totSposor = 0;
        let totPin = 0;
        let totPayment = 0;
        let totSlotActive = 0;
        let totModal = 0;
        let totOmset = 0;

        props.dataExcel.data.forEach((v, i) => {
          let newSaldo = parseFloat(v.saldo);
          let newSponsor = parseFloat(v.sponsor);
          let newPin = parseFloat(v.pin);
          let newPayment = parseFloat(v.total_payment);
          let newSlotActive = parseFloat(v.slot_active);
          let newModal = parseFloat(v.total_modal);
          let newOmset = parseFloat(v.omset);

          totSaldo += newSaldo;
          totSposor += newSponsor;
          totPin += newPin;
          totPayment += newPayment;
          totSlotActive += newSlotActive;
          totModal += newModal;
          totOmset += newOmset;

          content.push([
            v.fullname,
            v.referral,
            v.mobile_no,
            newSaldo,
            newSponsor,
            newPin,
            newPayment,
            newSlotActive,
            newModal,
            newOmset,
            v.status === 0 ? "Tidak Aktif" : "Aktif",
          ]);
        });
        toExcel(
          `LAPORAN MEMBER ${
            stts === 0 ? "Tidak Aktif" : stts === 1 ? "Aktif" : ""
          }`,
          `SEMUA PERIODE`,
          [
            "NAMA",
            "REFERRAL",
            "NO.TELEPON",
            "SALDO ( POIN )",
            "SPONSOR",
            "TIKET",
            "PENARIKAN ( POIN )",
            "SLOT AKTIF",
            "MODAL ( POIN )",
            "OMSET ( POIN )",
            "STATUS",
          ],
          content,
          [
            [""],
            [""],
            [
              "TOTAL",
              "",
              "",
              totSaldo,
              totSposor,
              totPin,
              totPayment,
              totSlotActive,
              totModal,
              totOmset,
            ],
          ]
        );
      }
    }
  }
  printDocumentXLsx(e, param) {
    e.preventDefault();
    this.setState({ isLoading: true });
    let where = this.handleValidate();
    if (this.state.status !== "") {
      this.props.dispatch(
        getExcelMember(`status=${this.state.status}&perpage=${param}&${where}`)
      );
    } else {
      this.props.dispatch(getExcelMember(`perpage=${param}&${where}`));
    }
  }
  handleSearchBy(val) {
    this.setState({
      searchBy: val.value,
    });
  }
  handleStatus(val) {
    this.setState({ status: val.value });
    let where = this.handleValidate();
    // console.log(where);
    if (val.value !== "") {
      this.props.dispatch(getMember(1, `&status=${val.value}&${where}`));
    } else {
      this.props.dispatch(getMember(1, `&${where}`));
    }
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleValidate() {
    let any = this.state.any;
    let searchBy = this.state.searchBy;
    let where = `searchby=${searchBy}`;
    if (any !== null && any !== undefined && any !== "") {
      where += `&q=${any}`;
      this.setState({ any: "" });
    }

    return where;
  }
  handlePage(pageNumber) {
    localStorage.setItem("pageMember", pageNumber);
    let where = this.handleValidate();
    this.props.dispatch(getMember(pageNumber, where));
  }
  handleEvent = (event, picker) => {
    const from = moment(picker.startDate._d).format("YYYY-MM-DD");
    const to = moment(picker.endDate._d).format("YYYY-MM-DD");
    this.setState({
      dateFrom: from,
      dateTo: to,
    });
  };
  handleSearch(e) {
    e.preventDefault();
    let where = this.handleValidate();
    this.props.dispatch(getMember(1, where));
  }
  handleInvestment(e, val) {
    e.preventDefault();
    this.setState({ detail: val, isModalInvest: true });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("detailInvesment"));
  }

  handleBankEdit(e, par, name) {
    e.preventDefault();
    this.setState({ detail: { id: par, member_name: name } });
    this.props.dispatch(getDetailBank(par));
  }
  handleUpdate(e, val) {
    e.preventDefault();
    Swal.fire({
      title: "Perhatian !!!",
      html: `anda yakin akan ${
        val.status === 1 ? "Menonaktifkan" : "Mengaktifkan"
      } ${val.fullname} ??`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Oke, ${
        val.status === 1 ? "Nonaktifkan" : "Aktifkan"
      }`,
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.value) {
        this.props.dispatch(
          putMember({ status: val.status === 0 ? "1" : "0" }, val.id)
        );
      }
    });
  }

  handleMemberEdit(e, id, name_old, mobile_no) {
    e.preventDefault();
    let proping = this.props;
    Swal.fire({
      title: '<span class="text-light">Ubah Member</span>',
      focusConfirm: true,
      background: "#1a1c23",
      html:
        '<div class="form-group"><label class="text-light">Nama Member</label><div class="input-group"><input type="text" id="nameModal" class="form-control" placeholder="Nama Member" value="' +
        name_old +
        '"></div></div>' +
        '<div class="form-group"><label class="text-light">No Hp Member</label><div class="input-group"><input type="number" id="mobilenoModal" class="form-control" placeholder="No Hp Member" value="' +
        mobile_no +
        '"></div></div>' +
        '<div class="form-group"><label class="text-light">PIN Member</label><div class="input-group"><input type="text" id="pinModal" class="form-control" placeholder="PIN Member" value="" maxlength="6"></div><small class="text-muted">Masukan 6 digit angka yang akan digunakan member baru untuk login.</small></div>',
      type: "warning",
      showCancelButton: true,
      cancelButtonColor: "grey",
      confirmButtonText: "Ubah!",
      allowOutsideClick: true,
      preConfirm: function () {
        return new Promise(function (resolve) {
          resolve({
            fullname: document.getElementById("nameModal").value,
            mobile_no: document.getElementById("mobilenoModal").value,
            pin_member: document.getElementById("pinModal").value,
          });
        });
      },
      onOpen: function () {
        // $('#swal-input1').focus()
        document.getElementById("nameModal").focus();
      },
    })
      .then(function (result) {
        if (result.isConfirmed) {
          if (!result) return null;
          let parseData = {};
          parseData["fullname"] = result.value.fullname;
          parseData["mobile_no"] = result.value.mobile_no;
          parseData["pin"] = result.value.pin_member;

          if (parseData.fullname === "") {
            // return Swal.fire({
            //   title: "Nama tidak boleh kosong!",
            //   type: "danger",
            // });
            delete parseData.fullname;
          } else if (parseData.mobile_no === "") {
            delete parseData.mobile_no;
          } else if (parseData.pin === "") {
            delete parseData.pin;
          } else if (isNaN(String(parseData.mobile_no).replace(/[0-9]/g, ""))) {
            return ToastQ.fire({
              icon: "warning",
              title: `No Hp harus berupa angka!`,
            });
            // alert("No Hp harus berupa angka!");
          } else if (parseData.pin.length > 1 && parseData.pin.length < 6) {
            return ToastQ.fire({
              icon: "warning",
              title: `PIN masih kurang dari 6 digit!`,
            });
            // alert("PIN masih kurang dari 6 digit!");
          } else if (parseData.pin.length > 6) {
            return ToastQ.fire({
              icon: "warning",
              title: `PIN lebih dari 6 digit!`,
            });
            // alert("PIN masih kurang dari 6 digit!");
          } else if (isNaN(String(parseData.pin).replace(/[0-9]/g, ""))) {
            return ToastQ.fire({
              icon: "warning",
              title: `PIN harus berupa angka!`,
            });
            // alert("PIN harus berupa angka!");
          }
          // alert(JSON.stringify(result))
          proping.dispatch(putMember(parseData, id));
        }
      })
      .catch(Swal.noop);
    //   inputValidator: (value) => {
    //     if (!value) {
    //       return 'You need to write something!'
    //     }
    //   }
  }
  render() {
    const headStyle = {
      verticalAlign: "middle",
      textAlign: "center",
      whiteSpace: "nowrap",
    };
    const numberStyle = {
      verticalAlign: "middle",
      textAlign: "right",
      whiteSpace: "nowrap",
    };
    const { last_page, total, per_page, current_page, data } = this.props.data;

    let totSaldo = 0;
    let totPin = 0;
    let totSponsor = 0;
    let totPayment = 0;
    let totSlot = 0;
    let totModal = 0;
    let totOmset = 0;
    return (
      <Layout page={"Member"}>
        <div className="row">
          <div className="col-md-10">
            <div className="row">
              <div className="col-6 col-xs-6 col-md-3">
                <div className="form-group">
                  <label htmlFor="">Kolom</label>
                  <Select
                    options={this.state.searchByData}
                    placeholder="==== Pilih Kategori ===="
                    onChange={this.handleSearchBy}
                    value={this.state.searchByData.find((op) => {
                      return op.value === this.state.searchBy;
                    })}
                  />
                </div>
              </div>
              <div
                className="col-6 col-xs-6 col-md-3"
                style={{
                  display: this.state.searchBy === "status" ? "block" : "none",
                }}
              >
                <div className="form-group">
                  <label>Status</label>

                  <Select
                    options={this.state.statusData}
                    placeholder="==== Pilih ===="
                    onChange={this.handleStatus}
                    value={this.state.statusData.find((op) => {
                      return op.value === this.state.status;
                    })}
                  />
                </div>
              </div>
              <div
                className="col-6 col-xs-6 col-md-3"
                style={{
                  display: this.state.searchBy === "status" ? "none" : "block",
                }}
              >
                <div className="form-group">
                  <label>Tulis Pencarian Disini</label>
                  <input
                    type="text"
                    className="form-control"
                    name="any"
                    placeholder={"Tulis Pencarian Disini"}
                    value={this.state.any}
                    onChange={this.handleChange}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        this.handleSearch(event);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-12 col-xs-12 col-md-2"
            style={{ textAlign: "right" }}
          >
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <button
                    style={{ marginTop: "28px", marginRight: "5px" }}
                    className="btn btn-primary"
                    onClick={this.handleSearch}
                  >
                    <i className="fa fa-search" />
                  </button>
                  <button
                    style={{ marginTop: "28px" }}
                    className="btn btn-primary"
                    onClick={(e) =>
                      this.printDocumentXLsx(e, per_page * last_page)
                    }
                  >
                    <i className="fa fa-print" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div style={{ overflowX: "auto" }}>
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th rowSpan="2" style={headStyle}>
                  NO
                </th>
                <th rowSpan="2" style={headStyle}>
                  #
                </th>
                <th rowSpan="2" style={headStyle}>
                  NAMA
                </th>
                <th rowSpan="2" style={headStyle}>
                  USER ID
                </th>
                <th rowSpan="2" style={headStyle}>
                  NO.TELEPON
                </th>

                <th colSpan="7" style={headStyle}>
                  TOTAL
                </th>

                <th rowSpan="2" style={headStyle}>
                  STATUS
                </th>
              </tr>
              <tr>
                <th style={headStyle}>SALDO</th>
                <th style={headStyle}>SPONSOR</th>
                <th style={headStyle}>TIKET</th>
                <th style={headStyle}>PENARIKAN</th>
                <th style={headStyle}>SLOT AKTIF</th>
                <th style={headStyle}>MODAL</th>
                <th style={headStyle}>OMSET</th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data.length > 0 ? (
                  data.map((v, i) => {
                    totSaldo += parseInt(v.saldo, 10);
                    totPin += parseInt(v.pin, 10);
                    totSponsor += parseInt(v.sponsor, 10);
                    totPayment += parseInt(v.total_payment, 10);
                    totSlot += parseInt(v.slot_active, 10);
                    totModal += parseInt(v.total_modal, 10);
                    totOmset += parseInt(v.omset, 10);

                    return (
                      <tr key={i}>
                        <td style={headStyle}>
                          {i + 1 + 10 * (parseInt(current_page, 10) - 1)}
                        </td>
                        <td style={headStyle}>
                          <div className="btn-group">
                            <UncontrolledButtonDropdown nav>
                              <DropdownToggle caret className="myDropdown">
                                Pilihan
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem
                                  onClick={(e) => this.handleInvestment(e, v)}
                                >
                                  Invesment
                                </DropdownItem>
                                {/* <DropdownItem
                                      onClick={(e) =>
                                        this.handleAlamat(e, v.id)
                                      }
                                    >
                                      Alamat
                                    </DropdownItem> */}
                                {/* <DropdownItem
                                      onClick={(e) => this.handleBank(e, v.id)}
                                    >
                                      Bank
                                    </DropdownItem> */}
                                <DropdownItem
                                  onClick={(e) =>
                                    this.handleBankEdit(e, v.id, v.fullname)
                                  }
                                >
                                  Edit Bank
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) =>
                                    this.handleMemberEdit(
                                      e,
                                      v.id,
                                      v.fullname,
                                      v.mobile_no
                                    )
                                  }
                                >
                                  Edit Member
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) => this.handleUpdate(e, v)}
                                >
                                  {v.status === 0 ? "Aktifkan" : "Non-aktifkan"}
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </div>
                        </td>
                        <td style={headStyle}>{v.fullname}</td>
                        <td style={headStyle}>{v.referral}</td>
                        <td style={headStyle}>{v.mobile_no}</td>
                        <td style={numberStyle} className="poin">
                          {toCurrency(v.saldo)}
                        </td>
                        <td style={numberStyle}>
                          {v.sponsor === "0"
                            ? 0
                            : toRp(parseInt(v.sponsor, 10))}
                        </td>
                        <td style={numberStyle}>
                          {v.pin === "0" ? 0 : toRp(parseInt(v.pin, 10))}
                        </td>
                        <td className="poin" style={numberStyle}>
                          {toCurrency(v.total_payment)}
                        </td>
                        <td style={numberStyle}>
                          {v.slot_active === "0" ? 0 : toRp(v.slot_active)}
                        </td>
                        <td className="poin" style={numberStyle}>
                          {toCurrency(v.total_modal)}
                        </td>
                        <td className="poin" style={numberStyle}>
                          {toCurrency(v.omset)}
                        </td>

                        <td style={headStyle}>{statusQ(v.status)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={19} style={headStyle}>
                      <img alt={"-"} src={NOTIF_ALERT.NO_DATA} />
                    </td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={19} style={headStyle}>
                    <img alt={"-"} src={NOTIF_ALERT.NO_DATA} />
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bgWithOpacity">
              <tr>
                <td colSpan={5}>TOTAL PERHALAMAN</td>
                <td style={numberStyle} className="poin">
                  {toCurrency(totSaldo)}
                </td>
                <td style={numberStyle}>{toRp(totSponsor)}</td>
                <td style={numberStyle}>{toRp(totPin)}</td>
                <td className="poin" style={numberStyle}>
                  {toCurrency(totPayment)}
                </td>
                <td style={numberStyle}>{toRp(totSlot)}</td>
                <td className="poin" style={numberStyle}>
                  {toCurrency(totModal)}
                </td>
                <td className="poin" style={numberStyle}>
                  {toCurrency(totOmset)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
        <div
          style={{
            marginTop: "20px",
            marginBottom: "20px",
            float: "right",
          }}
        >
          <Paginationq
            current_page={current_page}
            per_page={per_page}
            total={total}
            callback={this.handlePage}
          />
        </div>

        {this.state.isModalInvest ? (
          <DetailInvesment detail={this.state.detail} />
        ) : null}

        {this.props.isShowModalBank ? (
          <FormMemberBank
            detail={this.state.detail}
            detailBank={this.props.detailBank}
          />
        ) : null}
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    isShowModalInvestment: state.memberReducer.isShowModal,

    isLoading: state.memberReducer.isLoading,
    data: state.memberReducer.data,

    loading: state.memberReducer.isLoadingExcel,
    dataExcel: state.memberReducer.excel,

    isLoadingBank: state.bankReducer.isLoadingDetail,
    isShowModalBank: state.bankReducer.isShowModal,
    detailBank: state.bankReducer.data,
  };
};

export default connect(mapStateToProps)(IndexMember);
