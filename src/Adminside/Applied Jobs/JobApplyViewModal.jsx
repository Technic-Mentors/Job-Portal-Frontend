import { useContext, useState } from "react";
import {
  Col,
  Container,
 
  Modal,
  Row,
} from "react-bootstrap";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faEye,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
// import ReactQuill from "react-quill";
import JobApplyContext from "../../ContextApi/JobApplyContext";

export default function JobApplyViewModal({ applyJobId }) {
  const [lgShow, setLgShow] = useState(false);
  const { submittedJobsById, appliedJobById } = useContext(JobApplyContext);

  const viewAndShowModal = () => {
    appliedJobById(applyJobId);
    setLgShow(true);
  };

//   const jobPostForm = submittedJobsById.jobId && [
//     { val: submittedJobsById.name, type: "text", lab: "Name" },
//     { val: submittedJobsById.email, type: "text", lab: "Email" },
//     { val: submittedJobsById.number, type: "text", lab: "Number" },
//     { val: submittedJobsById.jobId.title, type: "text", lab: "Job Title" },
//     { val: submittedJobsById.jobId.city, type: "text", lab: "Job City" },
//     {
//       val: submittedJobsById.currentSalary,
//       type: "text",
//       lab: "Current Salary",
//     },
//     {
//       val: submittedJobsById.expectedSalary,
//       type: "text",
//       lab: "Expected Salary",
//     },
//     { val: submittedJobsById.relocation, type: "text", lab: "Relocation" },
//     { val: submittedJobsById.resume, type: "File", lab: "Resume" },
//   ];

  return (
    <>
      <FontAwesomeIcon
        className="me-3"
        icon={faEye}
        onClick={() => viewAndShowModal()}
        style={{cursor: "pointer"}}
      />
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            View Job Application
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <h6 className="mb-4" style={{ textDecoration: "underline" }}>
                  Candidate Personal Info:
                </h6>
                <div className="d-flex justify-content-between">
                  <p className="m-0">
                    <span className="mb-3 fw-bold">Name: </span>&nbsp;
                    {submittedJobsById.name}
                  </p>
                  <p className="m-0">
                    <span className="mb-3 fw-bold">Email: </span>&nbsp;
                    {submittedJobsById.email}
                  </p>
                  <p className="m-0">
                    <span className="mb-3 fw-bold">Contact: </span>&nbsp;
                    {submittedJobsById.number}
                  </p>
                </div>
              </Col>
              <hr />

              <h6 className="mb-4" style={{ textDecoration: "underline" }}>
                Application Info:
              </h6>
              <Col md={4}>
                <p className="m-0">
                  
                  &nbsp;<span className="fw-bold">Applied For:</span>{" "}
                  {submittedJobsById.jobId?.title}
                </p>
              </Col>
              <Col md={4}>
                <p className=" m-0">
                  &nbsp;<span className="fw-bold">Job City:</span>{" "}
                  {submittedJobsById.jobId?.city}
                </p>
              </Col>
              <Col md={4}>
                <p className=" m-0">
                  &nbsp;<span className="fw-bold">Current Salary:</span>{" "}
                  {submittedJobsById.currentSalary
                    ? submittedJobsById.currentSalary
                    : "-"}
                </p>
              </Col>
              <hr />
              <Row className="mt-4">
              <h6 className="mb-4" style={{ textDecoration: "underline" }}>
                Candidate Prefrences:
              </h6>
                <Col md={6} className="">
                  <p className=" m-0">
                    &nbsp;<span className="fw-bold">Expected Salary:</span>{" "}
                    {submittedJobsById.expectedSalary}
                  </p>
                </Col>
                
                <Col md={6}>
                  <p className="m-0">
                    &nbsp;
                    <span className="fw-bold">
                      Ready To Relocate To Job City?:
                    </span>{" "}
                    {submittedJobsById.relocation}
                  </p>
                </Col>
                <hr />
                <Col className="mt-2 text-center" md={12}>
                  {submittedJobsById.resume ? (
                    <a
                      href={submittedJobsById.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--primary-color)",
                        fontWeight: "650",
                        textDecoration: "underline !important",
                      }}
                    >
                      <u>
                        <FontAwesomeIcon icon={faFilePdf} /> View Resume <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </u>
                    </a>
                  ) : (
                    <span>No Resume Available</span>
                  )}
                </Col>
              </Row>
            
            </Row>
            
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

JobApplyViewModal.propTypes = {
  applyJobId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

JobApplyViewModal.defaultProps = {
  applyJobId: null,
};
