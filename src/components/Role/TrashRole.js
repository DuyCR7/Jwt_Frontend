import {Spin} from "antd";
import {useEffect, useState} from "react";
import {getAllTrash} from "../../services/roleService";
import {toast} from "react-toastify";

const TrashRole = (props) => {

    const [loading, setLoading] = useState(false);

    const [listTrash, setListTrash] = useState([]);

    const [searchedVal, setSearchedVal] = useState("");

    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        fetchAllRolesOnTrash();
    }, [props.listRoles]);

    const fetchAllRolesOnTrash = async () => {
        setLoading(true);
        try {
            let res = await getAllTrash();
            if (res && res.EC === 0) {
                setListTrash(res.DT);
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            console.log("Error fetchAllRolesOnTrash: ", error);
        } finally {
            setLoading(false);
        }
    }

    const onRestoreRole = async (role) => {
        props.handleRestoreRole(role);
        await fetchAllRolesOnTrash();
    }

    const getFilteredRoles = () => {
        return listTrash.filter((row) =>
            !searchedVal.length || row.url.toLowerCase().includes(searchedVal.toLowerCase())
        );
    }

    const toggleCheckbox = (id) => {
        const currentIndex = selectedIds.indexOf(id);
        const newSelectedIds = [...selectedIds];
        if (currentIndex === -1) {
            newSelectedIds.push(id);
        } else {
            newSelectedIds.splice(currentIndex, 1);
        }
        setSelectedIds(newSelectedIds);
        const filteredRoles = getFilteredRoles();
        setSelectAll(newSelectedIds.length === filteredRoles.length);
    };

    const toggleSelectAll = () => {
        const filteredRoles = getFilteredRoles();
        if (selectAll) {
            setSelectedIds([]);
        } else {
            const ids = filteredRoles.map(role => role.id);
            setSelectedIds(ids);
        }
        setSelectAll(!selectAll);
    };

    const onRestoreManyRoles = async (selectedIds) => {
        props.handleRestoreManyRoles(selectedIds);
        await fetchAllRolesOnTrash();
        setSelectedIds([]);
        setSelectAll(false);
    }

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const optionsDate = {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        const optionsTime = {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        const formattedDate = new Intl.DateTimeFormat('vi-VN', optionsDate).format(date);
        const formattedTime = new Intl.DateTimeFormat('vi-VN', optionsTime).format(date);

        return `${formattedTime} - ${formattedDate}`;
    };

    return (
        <>
            <div className="form-group">
                <input type="text" className="form-control mb-3"
                       placeholder="Enter URL..."
                       onChange={(e) => setSearchedVal(e.target.value)}/>
            </div>
            <Spin spinning={loading}>
                {
                    selectedIds.length > 0 &&
                    <button className="btn btn-sm btn-warning mb-3"
                            onClick={() => onRestoreManyRoles(selectedIds)}>Restore All</button>
                }
                <div className="table-responsive" style={{ maxHeight: "400px" }}>
                    <table className="table table-striped table-hover">
                        <thead className="sticky-top">
                        <tr className="text-center table-primary">
                            <th scope="col">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th scope="col">Id</th>
                            <th scope="col">URL</th>
                            <th scope="col">Description</th>
                            <th scope="col">Deleted At</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {getFilteredRoles() && getFilteredRoles().length > 0 ?
                            <>
                                {getFilteredRoles().map((item, index) => {
                                    return (
                                        <tr className="text-center" key={`row-${index}`}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(item.id)}
                                                    onChange={() => toggleCheckbox(item.id)}
                                                />
                                            </td>
                                            <td>{item.id}</td>
                                            <td>{item.url}</td>
                                            <td>{item.description}</td>
                                            <td>{formatDateTime(item.deletedAt)}</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <button className="btn btn-sm btn-warning me-3"
                                                            onClick={() => onRestoreRole(item)}
                                                            title="Restore">
                                                        <i className="fa fa-window-restore"></i>
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
                                    <td colSpan={6}>No rows found!</td>
                                </tr>
                            </>
                        }
                        </tbody>
                    </table>
                </div>
            </Spin>
        </>
    )
}

export default TrashRole;