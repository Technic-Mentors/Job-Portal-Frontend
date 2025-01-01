import { useContext, useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import companyDefaultImg from '../../assets/Images/company-default-img.avif'
import JobApplyForm from "./JobApplyForm";
import jobContext from "../../ContextApi/JobContext";
import defaultCompany from "../../assets/Images/company-default-img.avif"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faBookmark,
  faCake,
  faClose,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import JobCountriesContext from "../../ContextApi/JobCountryContext";
import Swal from "sweetalert2";
import UserContext from "../../ContextApi/UserContext";

function Jobs() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [colAdjust, setColAdjust] = useState(12)
  const [postedJobsById, setPostedJobById] = useState("")
  const { postedJobs, filterPostedJobs } = useContext(jobContext);
  const { country, setCountry } = useContext(JobCountriesContext);
  const [uniqueCountry, setUniqueCountry] = useState([]);
  const [uniqueCity, setUniqueCity] = useState([]);
  const [uniqueInd, setUniqueInd] = useState([]);
  const [uniqueCat, setUniqueCat] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedInd, setSelectedInd] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [city, setCity] = useState("");
  const [ind, setInd] = useState("");
  const [cat, setCat] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  const [expandedCountries, setExpandedCountries] = useState(false);
  const [expandedCities, setExpandedCities] = useState(false);
  const [expandedIndustries, setExpandedIndustries] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(false);

  const { signUser } = useContext(UserContext);

  const handleChange = (country) => {
    setCountry(country);
    setSelectedCountry(country)
  };

  const handleCityChange = (city) => {
    setCity(city);
    setSelectedCity(city)
  };

  const handleIndChange = (ind) => {
    setInd(ind);
    setSelectedInd(ind)
  };

  const handleCatChange = (cat) => {
    setCat(cat);
    setSelectedCat(cat)
  };

  useEffect(() => {
    postedJobsById?._id ? setColAdjust(6) : setColAdjust(12)
  }, [postedJobsById])

  const filteredJobs = filterPostedJobs?.filter((job) => {
    if (country && !job.country?.country.includes(country)) return false;
    if (city && !job.city?.city.includes(city)) return false;
    if (ind && job.industryId?.industry !== ind) return false;
    if (cat && job.categoryId?.category !== cat) return false;

    return true;
  });

  const handleToggle = (type) => {
    if (type === "country") {
      setExpandedCountries(!expandedCountries);
    } else if (type === "city") {
      setExpandedCities(!expandedCities);
    } else if (type === "industry") {
      setExpandedIndustries(!expandedIndustries);
    } else if (type === "category") {
      setExpandedCategories(!expandedCategories);
    }
  };

  useEffect(() => {
    const allUniqueCountry = [...new Set(postedJobs.map((job) => job.country?.country))];
    setUniqueCountry(allUniqueCountry);
    const allUniqueCity = [...new Set(postedJobs.map((job) => job.city?.city))];
    setUniqueCity(allUniqueCity);
    const allUniqueInd = [...new Set(postedJobs.map((job) => job.industryId?.industry))];
    setUniqueInd(allUniqueInd);
    const allUniqueCat = [...new Set(postedJobs.map((job) => job.categoryId?.category))];
    setUniqueCat(allUniqueCat);
  }, [postedJobs]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobPostPerPage = 10;

  const lastPostJobIndex = currentPage * jobPostPerPage;
  const firstUserIndex = lastPostJobIndex - jobPostPerPage;
  const currentPostedJobs = filteredJobs?.slice(firstUserIndex, lastPostJobIndex);

  const totalPages = Math.ceil(filteredJobs.length / jobPostPerPage);

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  useEffect(() => {
    if (selectedCountry) {
      const citiesForCountry = uniqueCity.filter(city => {
        return postedJobs.some(job => job.country?.country === selectedCountry && job.city?.city === city);
      });
      const uniqueCitiesForCountry = [...new Set(citiesForCountry)];
      setFilteredCities(uniqueCitiesForCountry);
    } else {
      setFilteredCities([]);
    }
  }, [selectedCountry, uniqueCity, postedJobs]);

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

  const jobDetail = async (id) => {
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
    setPostedJobById(data);
  };

  const formatDate = (jobDate) => {
    return new Date(jobDate).toLocaleDateString();
  };

  const renderItems = (items, type, expanded) => {
    // Ensure items are filtered for uniqueness and empty values
    const filteredItems = items.filter(item => item && item.trim() !== '');

    return filteredItems
      .slice(0, expanded ? filteredItems.length : 5) // Limit items to 5 unless expanded
      .map((item, index) => (
        <div key={index} style={{ display: "flex" }}>
          <Form>
            <Form.Check
              type="checkbox"
              id={`custom-checkbox-${type}-${index}`}
              checked={
                type === "country"
                  ? selectedCountry === item
                  : type === "city"
                    ? selectedCity === item
                    : type === "industry"
                      ? selectedInd === item
                      : selectedCat === item
              }
              onChange={() =>
                type === "country"
                  ? handleChange(item)
                  : type === "city"
                    ? handleCityChange(item)
                    : type === "industry"
                      ? handleIndChange(item)
                      : handleCatChange(item)
              }
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
            {item} {/* Correctly display the current item */}
          </span>
        </div>
      ));
  };

  return (
    <>
      <section className="job-head">
        <div className="page-head-overlay">
          <Container>
            <Row className="justify-content-center align-items-center py-6">
              <Col md={9}>
                <h2 className="text-center text-white fw-bold">
                  Explore All Jobs
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
                <Accordion defaultActiveKey="0" className="mb-3">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Filter By Country</Accordion.Header>
                    <Accordion.Body>
                      {renderItems(uniqueCountry, "country", expandedCountries)}
                      {uniqueCountry.length > 5 && (
                        <button
                          onClick={() => handleToggle("country")}
                          style={{
                            marginTop: "10px",
                            cursor: "pointer",
                            backgroundColor: "transparent",
                            border: "none",
                            color: "var(--primary-color)",
                            fontWeight: '500',
                            textDecoration: "underline"
                          }}
                        >
                          {expandedCountries ? "Show Less" : "+Show More.."}
                        </button>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Accordion defaultActiveKey="" className="mb-3">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Filter By City</Accordion.Header>
                    <Accordion.Body>
                      {selectedCountry ? (
                        renderItems(filteredCities, "city", expandedCities)
                      ) : (
                        <p>Please select a country first</p>
                      )}
                      {filteredCities.length > 5 && (
                        <button
                          onClick={() => handleToggle("city")}
                          style={{
                            marginTop: "10px",
                            cursor: "pointer",
                            backgroundColor: "transparent",
                            border: "none",
                            color: "var(--primary-color)",
                            fontWeight: '500',
                            textDecoration: "underline"
                          }}
                        >
                          {expandedCities ? "Show Less" : "+Show More"}
                        </button>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Accordion defaultActiveKey="" className="mb-3">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Filter By Industry</Accordion.Header>
                    <Accordion.Body>
                      {renderItems(uniqueInd, "industry", expandedIndustries)}
                      {uniqueInd.length > 5 && (
                        <button
                          onClick={() => handleToggle("industry")}
                          style={{
                            marginTop: "10px",
                            cursor: "pointer",
                            backgroundColor: "transparent",
                            border: "none",
                            color: "var(--primary-color)",
                            fontWeight: '500',
                            textDecoration: "underline"
                          }}
                        >
                          {expandedIndustries ? "Show Less" : "+Show More.."}
                        </button>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <Accordion defaultActiveKey="" className="mb-3">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Filter By Category</Accordion.Header>
                    <Accordion.Body>
                      {renderItems(uniqueCat, "category", expandedCategories)}
                      {uniqueCat.length > 5 && (
                        <button
                          onClick={() => handleToggle("category")}
                          style={{
                            marginTop: "10px",
                            cursor: "pointer",
                            backgroundColor: "transparent",
                            border: "none",
                            color: "var(--primary-color)",
                            fontWeight: '500',
                            textDecoration: "underline"
                          }}
                        >
                          {expandedCategories ? "Show Less" : "+Show More.."}
                        </button>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Card>
            </Col>
            <Col md={9}>
              <div className="section-head justify-content-between align-items-center">
                <h2 className="mt-2">All Job Vacancies</h2>
                {filteredJobs?.length === 1 ? (
                  <span className="fw-bold">{filteredJobs?.length} job found</span>
                ) : (
                  <span className="fw-bold">{filteredJobs?.length} jobs found</span>
                )}
                <hr />
              </div>
              <Row>
                <Col md={colAdjust}>
                  <div className="alldetails bg-white p-4">
                    {currentPostedJobs?.reverse().map((alljobs, index) => (
                      <div className="list-the-jobs px-3" key={index} onClick={() => jobDetail(alljobs._id)} style={{ cursor: "pointer" }}>
                        <div className="d-flex justify-content-between">
                          <span style={{ color: "var(--primary-color)", fontWeight: '550' }} >{alljobs.title}</span>
                          <FontAwesomeIcon
                            icon={faBookmark}
                            onClick={() => saveJob(alljobs._id)}
                            className="m-3"
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                        <div className="d-flex mt-2">
                          <div className="logo me-2">
                            {alljobs.jobImage ? (

                              <img src={alljobs.jobImage} alt="" className="img-fluid" style={{ width: "40px", height: "40px" }} />
                            ) : (
                              <img src={defaultCompany} alt="" className="img-fluid" style={{ width: "40px", height: "40px" }} />
                            )}
                          </div>
                          <div className="me-2">
                            <span style={{ fontSize: "15px" }}>{alljobs.companyName}</span><br />
                            <span style={{ color: "#9a9a9a" }}>{alljobs.city?.city} - {alljobs.country?.country}</span>
                          </div>
                        </div>
                        <p
                          className="m-0 text-muted"
                          dangerouslySetInnerHTML={{
                            __html: alljobs.description.length > 200 ? alljobs.description.slice(0, 200) + ".." : alljobs.description,
                          }}
                        ></p>
                        <span style={{ color: "green", fontWeight: "550" }}>{formatDate(alljobs.createdAt)}</span>
                        <hr />
                      </div>
                    ))}

                  </div>
                </Col>
                {colAdjust === 6 && (
                  <Col md={colAdjust}>
                    <section
                      className="job-detail"
                      style={{ backgroundColor: "#F2F5F8" }}
                    >
                      <Card className="detail-head p-4" style={{ overflowY: "auto", height: "100vh" }}>
                        <div className="d-flex justify-content-end">
                          <FontAwesomeIcon icon={faClose} onClick={() => setColAdjust(12)} style={{ fontSize: "25px", color: "#9a9a9a", cursor: "pointer" }}></FontAwesomeIcon>
                        </div>
                        <div className="detail-wrapper d-flex align-items-center">
                          <div
                            className="p-3 me-3"
                            style={{ backgroundColor: "#f2f5f5" }}
                          >
                            {postedJobsById.jobImage ? (
                              <img src={postedJobsById.jobImage} alt="" className="img-fluid" style={{ height: '40px', width: '40px' }} />
                            ) : (
                              <img src={companyDefaultImg} alt="" className="img-fluid" style={{ height: '40px', width: '40px' }} />
                            )}
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="section-head">
                              <h2 className="" style={{ fontSize: "100%", lineHeight: "1.5rem" }}>
                                {postedJobsById.title}
                              </h2>
                              <p className="m-0" style={{ color: "#a9a9a9" }}>
                                {postedJobsById.industryId?.industry}
                              </p>
                              <p className="m-0" style={{ color: "#a9a9a9" }}>
                                {postedJobsById.salary}
                              </p>
                            </div>

                          </div>
                        </div>
                        <div className="row mt-4 justify-content-between">
                          <div className="col-md-12 mb-3">
                            <p className="m-0">
                              <span className="fw-bold">Location:</span> {postedJobsById.city?.city} | {postedJobsById.country?.country}
                            </p>
                          </div>
                          {postedJobsById.companyName && (
                            <div className="col-md-12 mb-3">
                              <p className="m-0"><span className="fw-bold">Company Name:</span> {postedJobsById.companyName}</p>
                            </div>
                          )}
                          <div className="col-md-12">
                            <p className="m-0"><span className="fw-bold">Job Type:</span> {postedJobsById.jobType}</p>
                          </div>
                        </div>
                        <div className="row mt-4 justify-content-between">
                          <div className="col-md-5">
                            <p><span className="fw-bold">Posted :</span> {formatDate(postedJobsById.createdAt)}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12 d-flex">
                            <div className="me-2">
                              <JobApplyForm jobApplyId={postedJobsById._id} />
                            </div>
                            {/* <FontAwesomeIcon
                              icon={faBookmark}
                              onClick={() => saveJob(postedJobsById)}
                              className="m-3"
                              style={{ cursor: 'pointer' }}
                            /> */}
                            <div className="">
                              <Button className="d-flex align-items-center " onClick={() => saveJob(postedJobsById)} style={{ padding: "5px 55px", backgroundColor: "transparent", color: "var(--primary-color)" }}><i className="fa fa-heart"></i>&nbsp;Save</Button>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className="mt-2">
                          <h3>Job Description</h3>
                          <p
                            className="m-0"
                            dangerouslySetInnerHTML={{
                              __html: postedJobsById.description,
                            }}
                          ></p>
                        </div>
                        <div className="mt-3">
                          <h3>Job Requirements</h3>
                          <p
                            className="m-0"
                            dangerouslySetInnerHTML={{
                              __html: postedJobsById.requirements,
                            }}
                          ></p>
                        </div>

                        {postedJobsById.perks ? (
                          <div className="mt-3">
                            <h3>Perks & Benefits</h3>
                            <p
                              className="m-0"
                              dangerouslySetInnerHTML={{
                                __html: postedJobsById.perks,
                              }}
                            ></p>
                          </div>
                        ) : ""}

                        {postedJobsById.aboutCompany ? (
                          <div className="mt-3">
                            <h3>About Company</h3>
                            <p
                              className="m-0"
                              dangerouslySetInnerHTML={{
                                __html: postedJobsById.aboutCompany,
                              }}
                            ></p>
                          </div>
                        ) : ""}
                      </Card>
                    </section>
                  </Col>
                )}
              </Row>
              {filteredJobs.length > jobPostPerPage && (
                <div className="pagination-controls d-flex justify-content-center my-3">
                  <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
                    <FontAwesomeIcon icon={faAnglesLeft} />
                  </Button>
                  <span className="me-2 ms-2">
                    {Math.min(firstUserIndex + 1, filteredJobs.length)} to{" "}
                    {Math.min(lastPostJobIndex, filteredJobs.length)} of {filteredJobs.length}
                  </span>

                  <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
                    <FontAwesomeIcon icon={faAnglesRight} />
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

    </>
  );
}

export default Jobs;



