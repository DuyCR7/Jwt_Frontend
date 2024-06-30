import {useEffect, useState, forwardRef, useImperativeHandle} from "react";
import {deleteRole, getAllRoles, fetchAllRolesWithPaginate} from "../../services/roleService";
import {toast} from "react-toastify";
import ReactPaginate from "react-paginate";
import ModalRole from "./ModalRole";
import { Spin } from "antd";

const TableRole = forwardRef((props, ref) => {

    const [listRoles, setListRoles] = useState([]);
    const LIMIT_ROLE = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    useEffect(() => {
        fetchListRolesWithPagination(currentPage);
    }, [currentPage]);

    const fetchListRolesWithPagination = async (currentPage) => {
        setLoading(true);
        try {
            let res = await fetchAllRolesWithPaginate(currentPage, LIMIT_ROLE);
            if (res && res.EC === 0) {
                setTotalPage(res.DT.totalPages);
                setListRoles(res.DT.roles);
            }
        } catch (error) {
            console.log("Failed to fetch listRolesWithPagination: ", error);
        } finally {
            setLoading(false);
        }
    }

   useImperativeHandle(ref, () => ({
        fetchListRolesAgain() {
            setCurrentPage(1);
            fetchListRolesWithPagination(1);
        }
   }))

    const handleDeleteRole = async (role) => {
        try {
            let res = await deleteRole(role);
            if(res && res.EC === 0){
                toast.success(res.EM);
                setCurrentPage(1);
                await fetchListRolesWithPagination(1);
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            console.log("Error delete role: ", error);
        }
    }

    const handlePageClick = async (event) => {
        // console.log(event);
        setCurrentPage(+event.selected + 1);
    };

    const handleEditRole = (role) => {
        setIsShowModalUpdate(true);
        setDataUpdate(role);
    }

    const handleCloseModalUpdate = () => {
        setIsShowModalUpdate(false);
        setDataUpdate({});
    }

    return (
        <>
            <Spin spinning={loading}>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead>
                    <tr className="text-center">
                        <th scope="col">No</th>
                        <th scope="col">Id</th>
                        <th scope="col">URL</th>
                        <th scope="col">Description</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listRoles && listRoles.length > 0 ?
                        <>
                            {listRoles.map((item, index) => {
                                const globalIndex = (currentPage - 1) * LIMIT_ROLE + index + 1;
                                return (
                                    <tr className="text-center" key={`row-${index}`}>
                                        <th scope="row">{globalIndex}</th>
                                        <td>{item.id}</td>
                                        <td>{item.url}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <button className="btn btn-sm btn-warning me-3"
                                                        onClick={() => handleEditRole(item)}
                                                        title="Edit">
                                                    <i className="fa fa-pencil-square-o"></i>
                                                </button>
                                                <button className="btn btn-sm btn-danger"
                                                        onClick={() => handleDeleteRole(item)}
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
                                <td colSpan={5}>Not found roles!</td>
                            </tr>
                        </>
                    }
                    </tbody>
                </table>
            </div>
            </Spin>

            {totalPage > 0 &&
                <div className="user-footer row justify-content-center">
                    <div className="col-auto">
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
                </div>
            }

            <ModalRole
                isShowModalUpdate={isShowModalUpdate}
                handleCloseModalUpdate={handleCloseModalUpdate}
                dataUpdate={dataUpdate}
                fetchListRolesWithPagination={fetchListRolesWithPagination}
                currentPage={currentPage}
            />
        </>
    )
})

export default TableRole;