import { useContext, useEffect, useState } from "react";
import {
  Accordion,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import jobContext from "../../ContextApi/JobContext";
import defaultCompany from "../../assets/Images/company-default-img.avif"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import JobCountriesContext from "../../ContextApi/JobCountryContext";
import Swal from "sweetalert2";
import UserContext from "../../ContextApi/UserContext";

function WorkFromHomeJobs() {
  const { postedJobs, postedJobCountries } = useContext(jobContext);
  const { country, setCountry } = useContext(JobCountriesContext);
  const { signUser } = useContext(UserContext);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filterCity, setFilterCity] = useState(null);

  const [showMoreCountry, setShowMoreCountry] = useState(false);
  const [showMoreCity, setShowMoreCity] = useState(false);

  const handleChange = (country) => {
    setSelectedCountry(country);
    setCountry(country);
    setFilterCity("");
  };
  const handleCityChange = (city) => {
    setSelectedCity(city);
    setFilterCity(city);
  };

  const [uniqueCountry, setUniqueCountry] = useState([]);

  const filteredJobs = filterCity && country ? postedJobs?.filter((job) => job.country?.country === country).filter((job) => job.city?.city.includes(filterCity)).filter((job) => job.jobLocaType === "Remote") : filterCity ? postedJobs?.filter((job) => job.city?.city.includes(filterCity)).filter((job) => job.jobLocaType === "Remote") : country ? postedJobs?.filter((job) => job.country?.country === country).filter((job) => job.jobLocaType === "Remote") : postedJobs?.filter((job) => job.jobLocaType === "Remote")

  useEffect(() => {
    const allUniqueCountry = [...new Set(postedJobs.filter(job => job.country).map((job) => job.country?.country))];
    setUniqueCountry(allUniqueCountry);
  }, [postedJobs]);

  // const todayDate = new Date();

  // const jobPostedDate = (timeStamp) => {
  //   return new Date(timeStamp);
  // };

  // const getPostedJobDaysFn = (timeStamp) => {
  //   if (timeStamp) {
  //     const posted = jobPostedDate(timeStamp);
  //     const getDifference = todayDate - posted;
  //     const jobPostedDays = Math.floor(getDifference / (1000  60  60 * 24));
  //     return jobPostedDays;
  //   }
  // };
  const jobCountry =
    postedJobCountries &&
    postedJobCountries.find((counJob) => counJob?.isoCode === country)?.name;

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

  // const jobTypeArray = [{ type: "Full Time" }, { type: "Part Time" }];
  const formatDate = (jobDate) => {
    return new Date(jobDate).toLocaleDateString();
  };
  return (
    <>
      <section className="job-head">
        <div className="page-head-overlay">
          <Container>
            <Row className="justify-content-center align-items-center py-6">
              <Col md={9}>
                <h2 className="text-center text-white fw-bold">
                  Remote Jobs
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
                    <Accordion.Header>Filter By Country</Accordion.Header>
                    <Accordion.Body>
                      {uniqueCountry.slice(0, showMoreCountry ? uniqueCountry.length : 5).map((cont, index) => {

                        return (
                          <div key={index} style={{ display: "flex" }}>
                            <Form>
                              <Form.Check
                                type="checkbox"
                                id={`custom-checkbox${index}`}
                                checked={selectedCountry === cont}
                                onChange={() => handleChange(cont)}
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
                              {cont}
                            </span>
                          </div>
                        );
                      })}
                      {uniqueCountry.length > 5 && (
                        <button
                          onClick={() => setShowMoreCountry(!showMoreCountry)}
                          style={{ cursor: "pointer", backgroundColor: "transparent", border: "none", color: "var(--primary-color)", fontWeight: '500', textDecoration: "underline" }}
                        >
                          {showMoreCountry ? "Show Less" : "+Show More..."}
                        </button>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Accordion defaultActiveKey="" className="mt-3">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Filter By City</Accordion.Header>
                    <Accordion.Body>
                      {postedJobs
                        ?.filter((job) => job.country?.country === country)
                        .map((job) => job.city?.city) // Extract only cities
                        .filter(
                          (city, index, self) => self.indexOf(city) === index
                        ) // Remove duplicates
                        .slice(0, showMoreCity ? postedJobs.length : 5) // Handle "Show More" logic
                        .map((uniqueCity, index) => (
                          <div key={index} style={{ display: "flex" }}>
                            <Form>
                              <Form.Check
                                type="checkbox"
                                id={`custom-checkbox${index}`}
                                checked={
                                  filterCity ? selectedCity === uniqueCity : ""
                                }
                                onChange={() => handleCityChange(uniqueCity)}
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
                              {uniqueCity}
                            </span>
                          </div>
                        ))}
                      {postedJobs
                        ?.filter((job) => job.country?.country === country)
                        .map((job) => job.city?.city)
                        .filter(
                          (city, index, self) => self.indexOf(city) === index
                        ).length > 5 && (
                          <button
                            onClick={() => setShowMoreCity(!showMoreCity)}
                            style={{
                              cursor: "pointer",
                              backgroundColor: "transparent",
                              border: "none",
                              color: "var(--primary-color)",
                              fontWeight: "500",
                              textDecoration: "underline",
                            }}
                          >
                            {showMoreCity ? "Show Less" : "Show More"}
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
                  <h2 className="mt-2"> {jobCountry ? `Remote Jobs in ${jobCountry}` : "Remote Jobs"} </h2>
                  {filteredJobs?.length === 1 ? (
                    <span className="fw-bold">{filteredJobs?.length} job found</span>
                  ) : (
                    <span className="fw-bold">{filteredJobs?.length} jobs found</span>
                  )}
                </div>
                <hr />
              </div>
              <Row>
                <Col md={12} >
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
                                <td><span style={{ color: "var(--primary-color)", fontWeight: '550' }} >{alljobs.title}</span><br /><span style={{ color: "grey" }}>{alljobs.companyName}</span></td>
                                <td>{alljobs.city}</td>
                                <td>{formatDate(alljobs.createdAt)}</td>
                                <td>{alljobs.jobImage ? (<img src={alljobs.jobImage} alt="" className="img-fluid" style={{ height: "40px", width: "40px" }} />
                                ) : (
                                  <img src={defaultCompany} alt="" className="img-fluid" style={{ height: "40px", width: "40px" }} />
                                )}</td>
                                <td>
                                  <a href={`/job-detail/${alljobs._id}`} target="blank">
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

export default WorkFromHomeJobs;
