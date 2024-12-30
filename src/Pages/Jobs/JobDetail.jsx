import {
  faBookmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import JobApplyForm from "./JobApplyForm";
import companyDefaultImg from '../../assets/Images/company-default-img.avif'
import Swal from "sweetalert2";
import UserContext from "../../ContextApi/UserContext";

function JobDetail() {
  const { signUser } = useContext(UserContext)
  const [postedJobByTitle, setPostedJobByTitle] = useState([]);
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;

  const jobByTitle = async () => {
    const res = await fetch(
      `${apiUrl}/api/jobPost/getJobById/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    setPostedJobByTitle(data);
  };

  const saveJob = (job) => {
    if (signUser?.role) {

      const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
      const checkJob = savedJobs.some((savjob) => savjob._id === job._id);
      if (!checkJob) {
        savedJobs.push(job);
        localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
        Swal.fire("You saved this job!");
      } else {
        Swal.fire("Job already saved!");
      }
    } else {
      Swal.fire("You have to sign in first!");
    };
  }

  useEffect(() => {
    jobByTitle();
  }, []);

  const formatDate = (jobDate) => {
    const todayDate = new Date();
    const jobPostedDate = new Date(jobDate);
    const differenceInTime = todayDate - jobPostedDate; // Difference in milliseconds
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24)); // Convert ms to days
    return differenceInDays === 0 ? "Today" : `${differenceInDays + 1} days ago`;
  };


  return (
    <>
      <section className="job-head">
        <div className="page-head-overlay">
          <Container>
            <Row className="justify-content-center align-items-center py-6">
              <Col md={9}>
                <h2 className="text-center text-white fw-bold">
                  {postedJobByTitle.title}
                </h2>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      <section
        className="job-detail py-5"
        style={{ backgroundColor: "#F2F5F8" }}
      >
        <Container>
          <Row>
            <Col md={12}>
              <Card className="detail-head p-4">
                <div className="detail-wrapper d-flex align-items-center">
                  <div
                    className="p-3 me-3"
                    style={{ backgroundColor: "#f2f5f6" }}
                  >
                    {postedJobByTitle.jobImage ? (
                      <img src={postedJobByTitle.jobImage} alt="" className="img-fluid" style={{ height: '40px', width: '40px' }} />
                    ) : (
                      <img src={companyDefaultImg} alt="" className="img-fluid" style={{ height: '40px', width: '40px' }} />
                    )}
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="section-head">
                      <h2 className="" style={{ fontSize: "200%" }}>
                        {postedJobByTitle.title}
                      </h2>
                      <p className="m-0" style={{ color: "#a9a9a9" }}>
                        {postedJobByTitle.industryId?.industry}
                      </p>
                      <p className="m-0" style={{ color: "#a9a9a9" }}>
                        {postedJobByTitle.salary}
                      </p>
                    </div>
                    <FontAwesomeIcon
                      icon={faBookmark}
                      onClick={() => saveJob(postedJobByTitle)}
                      className="m-3"
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
                <div className="row mt-4 justify-content-between">
                  <div className="col-md-4">
                    <p className="m-0">
                      <span className="fw-bold">Location:</span> {postedJobByTitle.city?.city} | {postedJobByTitle.country?.country}
                    </p>
                  </div>
                  {postedJobByTitle.companyName && (
                    <div className="col-md-3">
                      <p className="m-0"><span className="fw-bold">Company Name:</span> {postedJobByTitle.companyName}</p>
                    </div>
                  )}
                  <div className="col-md-3">
                    <p className="m-0"><span className="fw-bold">Job Type:</span> {postedJobByTitle.jobType}</p>
                  </div>
                </div>
                <div className="row mt-4 justify-content-between">
                  <div className="col-md-5">
                    <p><span className="fw-bold">Posted :</span> {formatDate(postedJobByTitle.createdAt)}</p>
                  </div>
                  <div className="col-md-2">
                    <JobApplyForm jobApplyId={postedJobByTitle._id} />
                  </div>
                </div>
              </Card>

              <Card className="detail-body p-4 mt-4">

                <div className="mt-3">
                  <h3>Job Description</h3>
                  <p
                    className="m-0"
                    dangerouslySetInnerHTML={{
                      __html: postedJobByTitle.description,
                    }}
                  ></p>
                </div>
                <div className="mt-3">
                  <h3>Job Requirements</h3>
                  <p
                    className="m-0"
                    dangerouslySetInnerHTML={{
                      __html: postedJobByTitle.requirements,
                    }}
                  ></p>
                </div>

                {postedJobByTitle.perks ? (
                  <div className="mt-3">
                    <h3>Perks & Benefits</h3>
                    <p
                      className="m-0"
                      dangerouslySetInnerHTML={{
                        __html: postedJobByTitle.perks,
                      }}
                    ></p>
                  </div>
                ) : ""}

                {postedJobByTitle.aboutCompany ? (
                  <div className="mt-3">
                    <h3>About Company</h3>
                    <p
                      className="m-0"
                      dangerouslySetInnerHTML={{
                        __html: postedJobByTitle.aboutCompany,
                      }}
                    ></p>
                  </div>
                ) : ""}
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default JobDetail;
