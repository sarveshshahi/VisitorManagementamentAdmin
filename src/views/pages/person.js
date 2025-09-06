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

const Person = () => {
  const [persons, setPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: "" });
  const [selectedPerson, setSelectedPerson] = useState({ _id: null, name: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const personsPerPage = 10;

  // Fetch persons from API
  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const res = await apiClient.get("/api/person/all");
        if (res.data.success) {
          setPersons(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching persons:", err);
      }
    };

    fetchPersons();
  }, []);

  // Filtering
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPerson = currentPage * personsPerPage;
  const indexOfFirstPerson = indexOfLastPerson - personsPerPage;
  const currentPersons = filteredPersons.slice(indexOfFirstPerson, indexOfLastPerson);
  const totalPages = Math.ceil(filteredPersons.length / personsPerPage);

  // Handlers
  const openAddModal = () => {
    setShowModal(true);
    setNewPerson({ name: "" });
  };

  const savePerson = async () => {
    if (newPerson.name.trim()) {
      try {
        const res = await apiClient.post("/api/person/add", newPerson);
        if (res.data.success) {
          setPersons([...persons, res.data.data]); // backend should return new person
        }
      } catch (err) {
        console.error("Error saving person:", err);
      }
    }
    setShowModal(false);
  };

  const deletePerson = async (name) => {
    if (window.confirm("Delete this person?")) {
      try {
        const res = await apiClient.delete("/api/person/delete", {
          data: { name },
        });
        if (res.data.success) {
          setPersons(persons.filter((p) => p.name !== name));
        }
      } catch (err) {
        console.error("Error deleting person:", err);
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
              placeholder="Search Person"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CCol>
          <CCol xs={6} className="d-flex justify-content-end">
            <CButton color="success" onClick={openAddModal}>
              Add Person
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
            {currentPersons.map((person, index) => (
              <CTableRow key={person._id}>
                <CTableDataCell>{indexOfFirstPerson + index + 1}</CTableDataCell>
                <CTableDataCell>{person.name}</CTableDataCell>
                <CTableDataCell>
                  <FontAwesomeIcon
                    icon={faEye}
                    title="View"
                    onClick={() => {
                      setSelectedPerson(person);
                      setShowViewModal(true);
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="ms-3"
                    title="Delete"
                    onClick={() => deletePerson(person.name)}
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
            <CModalTitle>Add New Person</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={newPerson.name}
              onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </CButton>
            <CButton color="success" onClick={savePerson}>
              Save
            </CButton>
          </CModalFooter>
        </CModal>

        {/* View Modal */}
        <CModal visible={showViewModal} onClose={() => setShowViewModal(false)}>
          <CModalHeader>
            <CModalTitle>View Person</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p><strong>ID:</strong> {selectedPerson._id}</p>
            <p><strong>Name:</strong> {selectedPerson.name}</p>
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

export default Person;
