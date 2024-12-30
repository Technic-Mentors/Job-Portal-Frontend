import { useContext, useEffect, useState } from "react";
import { Accordion, Card, Col, Container, Form, Row } from "react-bootstrap";
import jobContext from "../../ContextApi/JobContext";
import defaultCompany from "../../assets/Images/company-default-img.avif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import JobCountriesContext from "../../ContextApi/JobCountryContext";
import Swal from "sweetalert2";
import UserContext from "../../ContextApi/UserContext";

function JobsByIndustry() {
  const { postedJobs } = useContext(jobContext);
  const { industry, setIndustry } = useContext(JobCountriesContext);
  const { signUser } = useContext(UserContext);
  const [uniqueIndustry, setUniqueIndustry] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(industry);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filterCat, setFilterCat] = useState(null);

  const [selectedType, setSelectedType] = useState(null);
  const [filterType, setFilterType] = useState(null);

  const [showMoreIndustry, setShowMoreIndustry] = useState(false);
  const [showMoreCategory, setShowMoreCategory] = useState(false);
  const [showMoreType, setShowMoreType] = useState(false);

  const handleChange = (country) => {
    setSelectedIndustry(country);
    setIndustry(country);
    setFilterCat("");
    setFilterType(null);
  };
  const handleCatChange = (city) => {
    setSelectedCity(city);
    setFilterCat(city);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setFilterType(type);
  };

  const filteredJobs =
    filterCat && filterType
      ? postedJobs
          ?.filter((job) => job.industryId?.industry === industry)
          .filter((job) => job.jobType.includes(filterType))
          .filter((job) => job.categoryId?.category.includes(filterCat))
      : filterCat
      ? postedJobs
          ?.filter((job) => job.industryId?.industry === industry)
          .filter((job) => job.categoryId?.category.includes(filterCat))
      : filterType
      ? postedJobs
          ?.filter((job) => job.industryId?.industry === industry)
          .filter((job) => job.jobType.includes(filterType))
      : postedJobs?.filter((job) => job.industryId?.industry === industry)
      
  useEffect(() => {
    const allUniqueIndustry = [
      ...new Set(postedJobs.map((job) => job.industryId?.industry)),
    ];
    setUniqueIndustry(allUniqueIndustry);
    if (allUniqueIndustry.length > 0 && industry) {
      setIndustry(industry);
    } else if (allUniqueIndustry.length > 0) {
      setIndustry(allUniqueIndustry[0]);
    }
  }, [postedJobs]);

  // const todayDate = new Date();

  // const jobPostedDate = (timeStamp) => {
  //   return new Date(timeStamp);
  // };

  // const getPostedJobDaysFn = (timeStamp) => {
  //   if (timeStamp) {
  //     const posted = jobPostedDate(timeStamp);
  //     const getDifference = todayDate - posted;
  //     const jobPostedDays = Math.floor(getDifference / (1000 / 60 / 60 * 24));
  //     return jobPostedDays;
  //   }
  // };

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
      Swal.fire("You have to sign In first");
    }
  };

  const jobTypeArray = [{ type: "Full Time" }, { type: "Part Time" }];

  const formatDate = (jobDate) => {
    return new Date(jobDate).toLocaleDateString();
  };

  const handleShowMoreIndustry = () => {
    setShowMoreIndustry(!showMoreIndustry);
  };

  const handleShowMoreCategory = () => {
    setShowMoreCategory(!showMoreCategory);
  };

  const handleShowMoreType = () => {
    setShowMoreType(!showMoreType);
  };

  return (
    <>
      <section className="job-head">
        <div className="page-head-overlay">
          <Container>
            <Row className="justify-content-center align-items-center py-6">
              <Col md={9}>
                <h2 className="text-center text-white fw-bold">
                  Jobs By Industry
                </h2>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      <section className="interview-section py-4">
        <Container fluid className="px-lg-4">
          <Row className="mt-5 g-4 justify-content-center">
            <Col md={3}>
              <Card className="jobs-filter-sidebar">
                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Filter By Industry</Accordion.Header>
                    <Accordion.Body>
                      {uniqueIndustry
                        ?.slice(0, showMoreIndustry ? undefined : 5)
                        .map((ind, index) => {
                          return (
                            <div key={index} style={{ display: "flex" }}>
                              <Form>
                                <Form.Check
                                  type="checkbox"
                                  id={`custom-checkbox${index}`}
                                  checked={selectedIndustry === ind}
                                  onChange={() => handleChange(ind)}
                                  className="countryCheck"
                                />
                              </Form>
                              <span
                                style={{
                                  cursor: "pointer",
                                  lineHeight: "2.5rem",
                                  marginTop: "-10px",
                                  marginLeft: "5px",
                                  fontWeight: "550",
                                  fontFamily: "jost",
                                }}
                              >
                                {ind}
                              </span>
                            </div>
                          );
                        })}
                      {uniqueIndustry.length > 5 && (
                        <button
                          className="btn btn-link"
                          onClick={handleShowMoreIndustry}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "var(--primary-color)",
                            fontWeight: "500",
                            textDecoration: "underline",
                          }}
                        >
                          {showMoreIndustry ? "Show Less" : "+Show More.."}
                        </button>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Accordion defaultActiveKey="" className="mt-3">
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Filter By Category</Accordion.Header>
                    <Accordion.Body>
                      {postedJobs
                        .filter((job) => job.industryId?.industry === industry) // Filter by selected industry
                        .map((job) => job.categoryId?.category) // Extract category from each job
                        .filter((category) => category) // Filter out undefined or empty categories
                        .filter(
                          (value, index, self) => self.indexOf(value) === index
                        ) // Remove duplicates
                        .slice(0, showMoreCategory ? undefined : 5) // Limit the number of categories shown
                        .map((category, index) => {
                          return (
                            <div key={index} style={{ display: "flex" }}>
                              <Form>
                                <Form.Check
                                  type="checkbox"
                                  id={`custom-checkbox${index}`}
                                  checked={
                                    filterCat ? selectedCity === category : ""
                                  }
                                  onChange={() => handleCatChange(category)}
                                  className="countryCheck"
                                />
                              </Form>
                              <span
                                style={{
                                  cursor: "pointer",
                                  lineHeight: "2.5rem",
                                  marginTop: "-10px",
                                  marginLeft: "5px",
                                  fontWeight: "550",
                                  fontFamily: "jost",
                                }}
                              >
                                {category}
                              </span>
                            </div>
                          );
                        })}
                      {postedJobs.filter(
                        (job) => job.industryId?.industry === industry
                      ).length > 5 && (
                        <button
                          className="btn btn-link"
                          onClick={handleShowMoreCategory}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "var(--primary-color)",
                            fontWeight: "500",
                            textDecoration: "underline",
                          }}
                        >
                          {showMoreCategory ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Accordion defaultActiveKey="" className="mt-3">
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>Filter By Job Type</Accordion.Header>
                    <Accordion.Body>
                      {jobTypeArray
                        ?.slice(0, showMoreType ? undefined : 5)
                        .map((job, index) => {
                          return (
                            <div key={index} style={{ display: "flex" }}>
                              <Form>
                                <Form.Check
                                  type="checkbox"
                                  id={`custom-checkbox${index}`}
                                  checked={
                                    filterType ? selectedType === job.type : ""
                                  }
                                  onChange={() => handleTypeChange(job.type)}
                                  className="countryCheck"
                                />
                              </Form>
                              <span
                                style={{
                                  cursor: "pointer",
                                  lineHeight: "2.5rem",
                                  marginTop: "-10px",
                                  marginLeft: "5px",
                                  fontWeight: "550",
                                  fontFamily: "jost",
                                }}
                              >
                                {job.type}
                              </span>
                            </div>
                          );
                        })}
                      {jobTypeArray.length > 5 && (
                        <button
                          className="btn btn-link"
                          onClick={handleShowMoreType}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "var(--primary-color)",
                            fontWeight: "500",
                            textDecoration: "underline",
                          }}
                        >
                          {showMoreType ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Card>
            </Col>
            <Col
              md={9}
              style={{ boxShadow: "0 0 8px rgba(204, 204, 204, 0.7)" }}
              className="jobs-material"
            >
              <div className="section-head d-flex align-items-center justify-content-between">
                <div className="float-start">
                  <h2 className="py-2">{industry} Jobs</h2>
                  {filteredJobs?.length === 1 ? (
                    <span className="fw-bold">
                      {filteredJobs?.length} job found
                    </span>
                  ) : (
                    <span className="fw-bold">
                      {filteredJobs?.length} jobs found
                    </span>
                  )}
                </div>
                <hr />
              </div>
              <Row>
                <Col md={12}>
                <div className="table-responsive-sm">

                  <table className="admin-table">
                    <thead>
                      <tr className="form-title">
                        <th>Title</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Company</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs &&
                        filteredJobs.map((alljobs, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <span
                                  style={{
                                    color: "var(--primary-color)",
                                    fontWeight: "550",
                                  }}
                                >
                                  {alljobs.title}
                                </span>
                                <br />
                                <span style={{ color: "grey" }}>
                                  {alljobs.companyName}
                                </span>
                              </td>
                              <td>{alljobs.city?.city}</td>
                              <td>{formatDate(alljobs.createdAt)}</td>
                              <td>
                                {alljobs.jobImage ? (
                                  <img
                                    src={alljobs.jobImage}
                                    alt=""
                                    className="img-fluid"
                                    style={{ height: "40px", width: "40px" }}
                                  />
                                ) : (
                                  <img
                                    src={defaultCompany}
                                    alt=""
                                    className="img-fluid"
                                    style={{ height: "40px", width: "40px" }}
                                  />
                                )}
                              </td>
                              <td>
                                <a
                                  href={`/job-detail/${alljobs._id}`}
                                  target="blank"
                                >
                                  <FontAwesomeIcon
                                    icon={faExternalLinkAlt}
                                    style={{
                                      color: "blue",
                                      marginRight: "10px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </a>
                                <FontAwesomeIcon
                                  icon={faBookmark}
                                  style={{ color: "", cursor: "pointer" }}
                                  onClick={() => saveJob(alljobs)}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default JobsByIndustry;
