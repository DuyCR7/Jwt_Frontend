import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import _ from "lodash";
import {toast} from "react-toastify";
import {updateRole} from "../../services/roleService";

const ModalRole = (props) => {

    const defaultRoleData = {
        url: "",
        description: "",
    }

    const [roleData, setRoleData] = useState(defaultRoleData);

    const handleOnChangeInput = (value, name) => {
        let _roleData = _.cloneDeep(roleData);
        _roleData[name] = value;
        setRoleData(_roleData);
    }

    const defaultValidInput = {
        url: true,
    }

    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    const isValidInputs = () => {
        setObjCheckInput(defaultValidInput);

        let check = true;
        if (!roleData['url']) {
            let _objCheckInput = _.cloneDeep(defaultValidInput);
            _objCheckInput['url'] = false;
            setObjCheckInput(_objCheckInput);

            toast.error("Please enter URL!");
            check = false;
        }

        return check;
    }

    const handleSubmit = async () => {
        let check = isValidInputs();
        if (check) {
            let res = await updateRole(roleData);
            if(res && res.EC === 0){
                props.handleCloseModalUpdate();
                setRoleData(defaultRoleData);
                toast.success(res.EM);

                await props.fetchListRolesWithPagination(props.currentPage);
            } else {
                toast.error(res.EM);

                let _objCheckInput = _.cloneDeep(defaultValidInput);
                _objCheckInput[res.DT] = false;
                setObjCheckInput(_objCheckInput);
            }
        }
    }

    const handleClickCloseModal = () => {
        props.handleCloseModalUpdate();
    }

    useEffect(() => {
        setRoleData(props.dataUpdate);
    }, [props.dataUpdate]);

    return (
        <>
            <Modal show={props.isShowModalUpdate} onHide={() => handleClickCloseModal()} size={"lg"}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>
                            Edit Role
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>URL (<span className="red">*</span>):</label>
                            <input type="email" className={objCheckInput.url ? "form-control" : "form-control is-invalid"}
                                   value={roleData.url}
                                   onChange={(e) => handleOnChangeInput(e.target.value, "url")}
                                   />
                        </div>
                        <div className="col-12 col-sm-6 form-group">
                            <label>Description:</label>
                            <input type="text" className="form-control"
                                   value={roleData.description}
                                   onChange={(e) => handleOnChangeInput(e.target.value, "description")}
                                   />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClickCloseModal()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmit()}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalRole;