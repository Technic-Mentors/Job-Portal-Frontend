import { useContext, useEffect, useState } from 'react';
import { Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ReactQuill from 'react-quill';
import PropTypes from "prop-types"
import Swal from 'sweetalert2';
import JobCatContext from '../../ContextApi/JobCatContext';
import JobIndContext from '../../ContextApi/JobIndContext';
import JobCountriesContext from '../../ContextApi/JobCountryContext';
import jobContext from '../../ContextApi/JobContext';

function JobEditModal({ postedJobId }) {
  const values = [true, 'sm-down', 'md-down', 'lg-down', 'xl-down', 'xxl-down'];
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
    jobById(postedJobId);
    
  }


  const { postedJobById, jobById, setPostedJobById, allJobPosts } = useContext(jobContext)
  const { jobCountries, cities, countryCities } = useContext(JobCountriesContext)
  const { jobCat } = useContext(JobCatContext)
  const { jobInd } = useContext(JobIndContext)

  const handleDescChange = (html) => {
      setPostedJobById({ ...postedJobById, description: html });
  };
  const handleReqcChange = (html) => {
      setPostedJobById({ ...postedJobById, requirements: html });
  };
  const handleComcChange = (html) => {
      setPostedJobById({ ...postedJobById, aboutCompany: html });
  };

  // const [lgShow, setLgShow] = useState(false);

  // const editAndShowModal = () => {
     
  // }

  useEffect(() => {
      if (postedJobById.country) {
          countryCities(postedJobById.country); // Fetch cities when country is set
      }
  }, [postedJobById.country]);

  const allCountries = jobCountries && jobCountries.map((data) => {
      return { value: data.isoCode, label: data.name }
  })
  const allIndustries = jobInd?.map(ind => {
      return { value: ind._id, label: ind.industry }
  })
  const allCities = cities && cities.map((data) => {
      return { value: data.name, label: data.name }
  })

  const allCategories = jobCat?.map(cat => {
      return { value: cat._id, label: cat.category }
  })

  const jobPostForm = postedJobById && [
      { name: "title", val: postedJobById.title, type: "text", placeH: "User Name", conId: "floatingInput", lab: "Job Title", star: "*" },
      {
          name: "country", val: postedJobById.country, type: "select", placeH: "Country", conId: "floatingSelect", lab: "Country", options: [
              { value: "", label: "Select Country" },
              ...allCountries
          ]
      },
      {
          name: "city", val: postedJobById.city, type: "select", placeH: "City", conId: "floatingInput", lab: "City", star: "*", options: [
              { value: "", label: "Select City" },
              ...allCities
          ]
      },
      { name: "email", val: postedJobById.email, type: "email", placeH: "Company Email", conId: "floatingInput", lab: "Company Email", star: "*" },
      {
          name: "industryId", val: postedJobById.industryId?.industry, type: "select", placeH: "Industry", conId: "floatingInput", lab: "Industry", star: "*", options: [
              { value: "", label: "Select Industry" },
              ...allIndustries
          ]
      },
      { name: "description", val: postedJobById.description, type: "textarea", placeH: "Job Description", conId: "floatingInput", lab: "Job Description", star: "*" },
      { name: "requirements", val: postedJobById.requirements, type: "textarea", placeH: "Requirements", conId: "floatingInput", lab: "Requirements", star: "*" },
      { name: "jobImage", type: "File", placeH: "Choose Job Image", conId: "formFile", lab: "Choose Job Image" },
      { name: "countryImage", type: "File", placeH: "Choose Country Image", conId: "formFile", lab: "Choose Country Image" },
      { name: "companyName", val: postedJobById.companyName, type: "text", placeH: "Company Name", conId: "floatingInput", lab: "Company Name", star: "*" },
      {
          name: "jobType", val: postedJobById.jobType, type: "select", placeH: "Job Type", conId: "floatingSelect", lab: "Job Type", options: [
              { value: "", label: "Select An Option" },
              { value: "Full Time", label: "Full Time" },
              { value: "Part Time", label: "Part Time" }
          ]
      },
      {
          name: "jobLocaType", val: postedJobById.jobLocaType, type: "select", placeH: "Job Location Type", conId: "floatingSelect", lab: "Job Location Type", options: [
              { value: "", label: "Select An Option" },
              { value: "On Site", label: "On Site" },
              { value: "Remote", label: "Remote" },
              { value: "Hybrid", label: "Hybrid" }
          ]
      },
      { name: "location", val: postedJobById.location, type: "text", placeH: "Location", conId: "floatingInput", lab: "Location" },
      {
          name: "categoryId", val: postedJobById.categoryId?.category, type: "select", placeH: "Category", conId: "floatingInput", lab: "Category", star: "*", options: [
              { value: "", label: "Select Category" },
              ...allCategories
          ]
      },
      { name: "salary", val: postedJobById.salary, type: "text", placeH: "Salary", conId: "floatingInput", lab: "Salary" },
      { name: "aboutCompany", val: postedJobById.aboutCompany, type: "textarea", placeH: "About Company", conId: "floatingInput", lab: "About Company", star: "*" },
  ]

  const updatedJobFn = async (e) => {
      e.preventDefault()
      const { title, country, city, email, industryId, companyName, jobType, location, categoryId, jobLocaType, salary, requirements, description, jobImage, countryImage, aboutCompany } = postedJobById
      console.log({ "ind is": industryId });
      console.log({ "cat is": categoryId });

      const { isConfirmed } = await Swal.fire({
          title: "Do you want to save the changes?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Save",
          denyButtonText: `Don't save`,
      });
      if (isConfirmed) {
          const formData = new FormData();
          formData.append("title", title);
          formData.append("country", country);
          formData.append("city", city);
          formData.append("email", email);
          formData.append("description", description);
          formData.append("requirements", requirements);
          formData.append("aboutCompany", aboutCompany);
          formData.append("industryId", industryId);
          formData.append("jobImage", jobImage);
          formData.append("countryImage", countryImage);
          formData.append("companyName", companyName);
          formData.append("jobType", jobType);
          formData.append("location", location);
          formData.append("categoryId", categoryId);
          formData.append("jobLocaType", jobLocaType);
          formData.append("salary", salary);
          const res = await fetch(`https://job-portal-backend-ji3a.vercel.app/api/jobPost/updateJob/${postedJobById._id}`, {
              method: "PUT",
              body: formData
          })
          if (res.ok) {
              Swal.fire("Saved!", "", "success");
              allJobPosts()
          }
      } else {
          Swal.fire("Changes are not saved", "", "info");
      }
  }

  const valueChanged = (e) => {
      if (e.target.files) {
          setPostedJobById({ ...postedJobById, [e.target.name]: e.target.files[0] })
      } else {
          setPostedJobById({ ...postedJobById, [e.target.name]: e.target.value })
      }
      if (e.target.name === "country") {
          countryCities(e.target.value)
      }
  }

  return (
    <>
      {values.map((v, idx) => (
        <Button key={idx} className="me-2 mb-2" onClick={() => handleShow(v)}>
          Full screen
          {typeof v === 'string' && `below ${v.split('-')[0]}`}
        </Button>
      ))}
      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Container>
                        <Form onSubmit={updatedJobFn}>
                            <Row className="justify-content-center">
                                {jobPostForm && jobPostForm.map((job, index) => {
                                    return <Col key={index} md={job.name === "jobImage" || job.name === "countryImage" || job.name === "description" || job.name === "requirements" || job.name === "aboutCompany" ? 12 : job.name === "email" || job.name === "industry" ? 6 : 4}>
                                        <div>
                                            {job.type === "textarea" ? (
                                                job.name === "description" ? < ReactQuill className="mb-3" theme="snow" name={job.name} value={job.val} onChange={handleDescChange} /> : job.name !== "aboutCompany" ? (
                                                    < ReactQuill className="mb-3" theme="snow" name={job.name} value={job.val} onChange={handleReqcChange} />
                                                ) : (
                                                    < ReactQuill className="mb-3" theme="snow" name={job.name} value={job.val} onChange={handleComcChange} />
                                                )

                                            ) : job.type === "select" ? (
                                                <FloatingLabel
                                                    controlId={job.conId}
                                                    label={job.lab}
                                                >
                                                    <Form.Select name={job.name} onChange={valueChanged} value={job.val} aria-label="Floating label select example">
                                                        {job.options.map((opt, index) => {
                                                            return <option key={index} value={opt.value}>{opt.label}</option>
                                                        })}

                                                    </Form.Select>
                                                </FloatingLabel>
                                            ) : (
                                                <FloatingLabel
                                                    controlId={job.conId}
                                                    label={job.lab}
                                                    className="mb-3"
                                                >
                                                    <Form.Control
                                                        type={job.type}
                                                        name={job.name}
                                                        value={job.val}
                                                        onChange={valueChanged}
                                                        placeholder={job.placeH}
                                                    />
                                                </FloatingLabel>
                                            )}

                                        </div>
                                    </Col>
                                })}
                            </Row>
                            <div className="d-flex justify-content-center">
                                <Button type="submit" className="first-button">Update Job</Button>
                            </div>
                        </Form>
                    </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default JobEditModal;


JobEditModal.propTypes = {
  postedJobId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

JobEditModal.defaultProps = {
  postedJobId: null,
};