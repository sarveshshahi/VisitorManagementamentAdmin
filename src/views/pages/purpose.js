import React, { useState, useEffect } from "react";
import apiClient from "../../redux/services/apiClient";
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

const Purpose = () => {
  const [purposes, setPurposes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newPurpose, setNewPurpose] = useState({ name: "" });
  const [selectedPurpose, setSelectedPurpose] = useState({ _id: null, name: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all purposes
  useEffect(() => {
    const fetchPurposes = async () => {
      try {
        const res = await apiClient.get("/api/purpose/all");
        if (res.data.success) {
          setPurposes(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching purposes:", err);
      }
    };

    fetchPurposes();
  }, []);

  // Filtering
  const filteredPurposes = purposes.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPurposes = filteredPurposes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPurposes.length / itemsPerPage);

  // Handlers
  const openAddModal = () => {
    setShowModal(true);
    setNewPurpose({ name: "" });
  };

  const savePurpose = async () => {
    if (newPurpose.name.trim()) {
      try {
        const res = await apiClient.post("/api/purpose/add", newPurpose);
        if (res.data.success) {
          setPurposes([res.data.data, ...purposes]); // prepend new purpose
        }
      } catch (err) {
        console.error("Error saving purpose:", err);
      }
    }
    setShowModal(false);
  };

  const deletePurpose = async (name) => {
    if (window.confirm(`Delete purpose "${name}"?`)) {
      try {
        const res = await apiClient.delete("/api/purpose/delete", {
          data: { name },
        });
        if (res.data.success) {
          setPurposes(purposes.filter((p) => p.name !== name));
        }
      } catch (err) {
        console.error("Error deleting purpose:", err);
      }
    }
  };

  return (
    <CRow>
      <CCol sm={12}>
        <CRow className="mb-4 d-flex justify-content-between align-items-center">
          <CCol xs={6}>
            <input
              type="text"
              className="form-control"
              style={{ maxWidth: "250px" }}
              placeholder="Search Purpose"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CCol>
          <CCol xs={6} className="d-flex justify-content-end">
            <CButton color="success" onClick={openAddModal}>
              Add Purpose
            </CButton>
          </CCol>
        </CRow>

        <CTable bordered striped className="mb-1">
          <CTableHead color="secondary">
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentPurposes.map((purpose, index) => (
              <CTableRow key={purpose._id}>
                <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
                <CTableDataCell>{purpose.name}</CTableDataCell>
                <CTableDataCell>
                  <FontAwesomeIcon
                    icon={faEye}
                    title="View"
                    onClick={() => {
                      setSelectedPurpose(purpose);
                      setShowViewModal(true);
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="ms-3"
                    title="Delete"
                    onClick={() => deletePurpose(purpose.name)}
                  />
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* Pagination */}
        <div className="d-flex justify-content-end">
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
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            >
              &raquo;
            </CPaginationItem>
          </CPagination>
        </div>

        {/* Add Modal */}
        <CModal visible={showModal} onClose={() => setShowModal(false)}>
          <CModalHeader>
            <CModalTitle>Add New Purpose</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={newPurpose.name}
              onChange={(e) => setNewPurpose({ ...newPurpose, name: e.target.value })}
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </CButton>
            <CButton color="success" onClick={savePurpose}>
              Save
            </CButton>
          </CModalFooter>
        </CModal>

        {/* View Modal */}
        <CModal visible={showViewModal} onClose={() => setShowViewModal(false)}>
          <CModalHeader>
            <CModalTitle>View Purpose</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p><strong>ID:</strong> {selectedPurpose._id}</p>
            <p><strong>Name:</strong> {selectedPurpose.name}</p>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowViewModal(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  );
};

export default Purpose;
