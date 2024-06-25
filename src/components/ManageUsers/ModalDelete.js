import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {deleteUser} from "../../services/userService";
import {toast} from "react-toastify";

const ModalDelete = (props) => {

    const confirmDeleteUser = async () => {
        let res = await deleteUser(props.dataDelete);
        if (res && res.EC === 0) {
            toast.success(res.EM)
            props.handleCloseModalDelete();

            props.setCurrentPage(1);
            await props.fetchUsers(1);
        } else {
            toast.error(res.EM);
        }
    }

    return (
        <>
            <Modal show={props.isShowModalDelete} onHide={props.handleCloseModalDelete} centered>
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
            </Modal>
        </>
    )
}

export default ModalDelete