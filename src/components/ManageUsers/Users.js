import "./Users.scss";
import {useEffect, useState} from "react";
import {fetchAllUsers} from "../../services/userService";
import ReactPaginate from 'react-paginate';
import ModalDelete from "./ModalDelete";
import ModalUser from "./ModalUser";
import { Spin } from 'antd';
import {value} from "lodash/seq";

const Users = (props) => {

    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataDelete, setDataDelete] = useState({});

    const [isShowModalUser, setIsShowModalUser] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    const [actionModalUser, setActionModalUser] = useState("CREATE");

    const [numRows, setNumRows] = useState(2);

    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false);
        setDataDelete({});
    }

    const handleCloseModalUser = () => {
        setIsShowModalUser(false);
        setDataUpdate({});
    }

    useEffect(() => {
        fetchUsers(currentPage, numRows);
    }, [currentPage, numRows]);

    const fetchUsers = async (currentPage, numRows) => {
        setLoading(true);
        try {
            let res = await fetchAllUsers(currentPage, numRows);
            if (res && res.EC === 0) {
                setTotalPage(res.DT.totalPages);
                setListUsers(res.DT.users);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
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

    const handleEditUser = async (user) => {
        setActionModalUser("UPDATE")
        setIsShowModalUser(true);
        setDataUpdate(user);
    }

    const handleRefresh = async () => {
        setCurrentPage(1);
    }

    const handleShowRows = async (numRows) => {
        setNumRows(numRows);
        setCurrentPage(1);
    }

    return (
        <>
            <div className="container">
                <div className="manage-users-container">
                    <div className="user-header">
                        <div className="title mt-3">
                            <h3>Manage Users</h3>
                        </div>
                        <div className="action my-3">
                            <button className="btn btn-success me-3"
                                    title="Refresh"
                                    onClick={() => handleRefresh()}>
                                <i className="fa fa-refresh me-2"></i>
                                Refresh
                            </button>
                            <button className="btn btn-primary float-end"
                                    title="Add new user"
                                    onClick={() => {
                                        setIsShowModalUser(true);
                                        setActionModalUser("CREATE");
                                    }}>
                                <i className="fa fa-plus-circle me-2"></i>
                                Add new user
                            </button>
                        </div>
                    </div>

                    <div className="user-body">
                        <Spin spinning={loading}>
                            <div className="table-responsive" style={{ maxHeight: "400px" }}>
                                <table className="table table-striped table-hover">
                                    <thead className="sticky-top">
                                    <tr className="text-center table-primary">
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
                                                return (
                                                    <tr className="text-center" key={`row-${index}`}>
                                                        <th scope="row">{(currentPage - 1) * numRows + index + 1}</th>
                                                        <td>{item.id}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.username}</td>
                                                        <td>{item.Group ? item.Group.name : ""}</td>
                                                        <td>
                                                            <div className="d-flex justify-content-center">
                                                                <button className="btn btn-sm btn-warning me-2"
                                                                        onClick={() => handleEditUser(item)}
                                                                        title="Edit">
                                                                    <i className="fa fa-pencil-square-o"></i>
                                                                </button>
                                                                <button className="btn btn-sm btn-danger"
                                                                        onClick={() => handleDeleteUser(item)}
                                                                        title="Delete">
                                                                    <i className="fa fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </>
                                        :
                                        <>
                                            <tr>
                                                <td colSpan={6}>Not found users!</td>
                                            </tr>
                                        </>
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </Spin>
                    </div>

                    {totalPage > 0 &&
                        <div className="user-footer row mt-4">
                            <div className="col d-flex justify-content-end align-items-center">
                                <div className="me-3">
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
                                <div className="mb-3">
                                    <select className="form-select" aria-label="Default select example"
                                        onChange={(e) => handleShowRows(e.target.value)}
                                            value={numRows}>
                                        <option value={2}>Show 2</option>
                                        <option value={4}>Show 4</option>
                                        <option value={6}>Show 6</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <ModalDelete
                isShowModalDelete={isShowModalDelete}
                handleCloseModalDelete={handleCloseModalDelete}
                dataDelete={dataDelete}
                fetchUsers={fetchUsers}
                numRows={numRows}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            <ModalUser
                isShowModalUser={isShowModalUser}
                handleCloseModalUser={handleCloseModalUser}
                fetchUsers={fetchUsers}
                numRows={numRows}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                actionModalUser={actionModalUser}
                dataUpdate={dataUpdate}
            />
        </>
    )
}

export default Users;