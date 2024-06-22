import "./Users.scss";
import {useEffect, useState} from "react";
import {fetchAllUsers} from "../../services/userService";
import ReactPaginate from 'react-paginate';
import ModalDelete from "./ModalDelete";
import ModalUser from "./ModalUser";

const Users = (props) => {

    const LIMIT_USER = 2;

    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataDelete, setDataDelete] = useState({});

    const [isShowModalUser, setIsShowModalUser] = useState(false);

    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false);
        setDataDelete({});
    }

    const handleCloseModalUser = () => {
        setIsShowModalUser(false);
    }

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (currentPage) => {
        let res = await fetchAllUsers(currentPage, LIMIT_USER);
        if (res && res.data && res.data.EC === 0) {
            setTotalPage(res.data.DT.totalPages);
            setListUsers(res.data.DT.users);
        }
    }

    const handlePageClick = async (event) => {
        // console.log(event);
        setCurrentPage(+event.selected + 1);
    };

    const handleDeleteUser = async (user) => {
        // console.log("Check user: ", user);
        setIsShowModalDelete(true);
        setDataDelete(user);
    }

    return (
        <>
            <div className="container">
                <div className="manage-users-container">
                    <div className="user-header">
                        <div className="title">
                            <h3>Table Users</h3>
                        </div>
                        <div className="action">
                            <button className="btn btn-success">
                                Refresh
                            </button>
                            <button className="btn btn-primary" onClick={() => setIsShowModalUser(true)}>
                                Add new user
                            </button>
                        </div>
                    </div>

                    <div className="user-body">
                        <table className="table table-bordered table-hover">
                            <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Id</th>
                                <th scope="col">Email</th>
                                <th scope="col">Username</th>
                                <th scope="col">Group</th>
                                <th scope="col">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {listUsers && listUsers.length > 0 ?
                                <>
                                    {listUsers.map((item, index) => {
                                        const globalIndex = (currentPage - 1) * LIMIT_USER + index + 1;
                                        return (
                                            <tr key={`row-${index}`}>
                                                <th scope="row">{globalIndex}</th>
                                                <td>{item.id}</td>
                                                <td>{item.email}</td>
                                                <td>{item.username}</td>
                                                <td>{item.Group ? item.Group.name : ""}</td>
                                                <td>
                                                    <button className="btn btn-warning me-3">Edit</button>
                                                    <button className="btn btn-danger"
                                                            onClick={() => handleDeleteUser(item)}>Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </>
                                :
                                <>
                                    <tr>
                                        <td colSpan={5}>Not found users!</td>
                                    </tr>
                                </>
                            }
                            </tbody>
                        </table>
                    </div>

                    {totalPage > 0 &&
                        <div className="user-footer">
                            <ReactPaginate
                                nextLabel="Next"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={totalPage}
                                previousLabel="Prev"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                renderOnZeroPageCount={null}
                                forcePage={currentPage - 1}
                            />
                        </div>
                    }
                </div>
            </div>

            <ModalDelete
                isShowModalDelete={isShowModalDelete}
                handleCloseModalDelete={handleCloseModalDelete}
                dataDelete={dataDelete}
                fetchUsers={fetchUsers}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            <ModalUser
                title={"Create New User"}
                isShowModalUser={isShowModalUser}
                handleCloseModalUser={handleCloseModalUser}
                fetchUsers={fetchUsers}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </>
    )
}

export default Users;