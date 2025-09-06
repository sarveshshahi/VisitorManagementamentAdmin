import React, { useState, useEffect } from "react";
import {
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { CPagination, CPaginationItem } from "@coreui/react";

import { CAvatar } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPeople } from "@coreui/icons";

export default function Register() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  // View modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Debounce effect (delay search by 500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // reset to page 1 when searching
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch visitors
  const fetchUsers = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8000/api/visitor/all?page=${page}&limit=${usersPerPage}&search=${search}`
      );
      const data = await res.json();

      if (data.statusCode === 200) {
        setUsers(data.data.visitors);
        setTotalPages(data.data.totalPages);
      } else {
        setError("Failed to fetch visitors.");
      }
    } catch (err) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  // Refetch when page or search changes
  useEffect(() => {
    fetchUsers(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  const deleteUser = async (id) => {
    if (window.confirm("Delete this user?")) {
      // Optional: call backend DELETE API here
      setUsers(users.filter((u) => u._id !== id));
    }
  };

  return (
    <CRow>
      <CCol sm={12}>
        {/* 🔍 Search Input */}
        <CRow className="mb-4 d-flex justify-content-between align-items-center">
          <CCol xs={6}>
            <input
              type="text"
              className="form-control"
              style={{ maxWidth: "250px" }}
              placeholder="Search Visitor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CCol>
        </CRow>

        {/* Table */}
        <CTable bordered striped>
          <CTableHead color="secondary">
            <CTableRow>
              <CTableHeaderCell>Full Name</CTableHeaderCell>
              <CTableHeaderCell>Mobile</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Purpose</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan="5" className="text-center">
                  Loading...
                </CTableDataCell>
              </CTableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <CTableRow key={user._id}>
                  <CTableDataCell>{user.fullName}</CTableDataCell>
                  <CTableDataCell>{user.mobileNumber}</CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>{user.purpose?.name || "-"}</CTableDataCell>
                  <CTableDataCell>
                    <FontAwesomeIcon
                      icon={faEye}
                      className="me-3"
                      title="View"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowViewModal(true);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      title="Delete"
                      onClick={() => deleteUser(user._id)}
                    />
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="5" className="text-center">
                  No visitors found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>

        {/* Pagination */}
        <div className="d-flex justify-content-end mt-3">
          <CPagination>
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            >
              &laquo;
            </CPaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <CPaginationItem
                key={index}
                active={currentPage === index + 1}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
            >
              &raquo;
            </CPaginationItem>
          </CPagination>
        </div>

        {/* View Modal (unchanged) */}
         <CModal
          visible={showViewModal}
          onClose={() => setShowViewModal(false)}
          size="lg"
        >
          <CModalHeader className="bg-light border-bottom py-2 px-3">
            <CModalTitle className="fs-5">User Details</CModalTitle>
          </CModalHeader>

          <CModalBody className="py-3 px-3">
            {selectedUser && (
              <div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
                    <p><strong>Mobile:</strong> {selectedUser.mobileNumber}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Company:</strong> {selectedUser.companyName || "-"}</p>
                    <p><strong>Address:</strong> {selectedUser.address || "-"}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Whom To Meet:</strong> {selectedUser.whomToMeet?.name || "-"}</p>
                    <p><strong>Purpose:</strong> {selectedUser.purpose?.name || "-"}</p>
                    <p><strong>ID Proof:</strong> {selectedUser.idProofType} ({selectedUser.IdProofNumber})</p>
                    <p><strong>Vehicle Number:</strong> {selectedUser.vehicleNumber || "-"}</p>
                  </div>
                </div>

                {/* Images */}
                <div className="d-flex gap-3 mt-2 flex-wrap">
                  {selectedUser.idProofFileUrl && (
                    <div className="text-center">
                      <div style={{ width: "150px", height: "150px", overflow: "hidden", borderRadius: "8px", border: "1px solid #ddd", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                        <img src={selectedUser.idProofFileUrl} alt="ID Proof" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div className="small text-muted mt-1">ID Proof</div>
                    </div>
                  )}

                  {selectedUser.visitorPhotoUrl && (
                    <div className="text-center">
                      <div style={{ width: "150px", height: "150px", overflow: "hidden", borderRadius: "8px", border: "1px solid #ddd", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                        <img src={selectedUser.visitorPhotoUrl} alt="Visitor" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div className="small text-muted mt-1">Visitor Photo</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CModalBody>

          <CModalFooter className="bg-light py-2 px-3">
            <CButton color="secondary" size="sm" onClick={() => setShowViewModal(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  );
}
