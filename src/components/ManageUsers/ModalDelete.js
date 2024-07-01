import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {deleteUser} from "../../services/userService";
import {toast} from "react-toastify";
import { Spin } from 'antd';
import {useContext, useState} from "react";
import {UserContext} from "../../context/UserContext";

const ModalDelete = (props) => {

    const { user } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const confirmDeleteUser = async () => {
        if (user.account.id === props.dataDelete.id) {
            toast.error("You can't delete your account!");
            return;
        } else {
            setLoading(true);
            try {
                let res = await deleteUser(props.dataDelete);
                if (res && res.EC === 0) {
                    toast.success(res.EM)
                    props.handleCloseModalDelete();

                    props.setCurrentPage(1);
                    await props.fetchUsers(1, props.numRows);
                } else {
                    toast.error(res.EM);
                }
            } catch (error) {
                console.log("Error: ", error);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <>
            <Modal show={props.isShowModalDelete} onHide={props.handleCloseModalDelete} centered>
                <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to delete this user: <b>{props.dataDelete.email}</b>?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleCloseModalDelete}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteUser}>
                        Confirm
                    </Button>
                </Modal.Footer>
                </Spin>
            </Modal>
        </>
    )
}

export default ModalDelete