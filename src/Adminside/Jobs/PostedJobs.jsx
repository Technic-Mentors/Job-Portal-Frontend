import { useContext, useEffect, useState } from "react";
import jobContext from "../../ContextApi/JobContext";
import JobActionModal from "./JobViewModal";
import JobEditModal from "./JobEditModal";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import UserContext from "../../ContextApi/UserContext";
import { Button } from "react-bootstrap";
import JobIndContext from "../../ContextApi/JobIndContext";
import AddDuplicateJob from "./AddDuplicateJob";

export default function PostedJobs() {
  const [searchTitle, setSearchTitle] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchIndustry, setSearchIndustry] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [report, setReport] = useState("")

  const { postedJobs, deleteById } = useContext(jobContext);
  const { signUser } = useContext(UserContext);
  const { jobInd } = useContext(JobIndContext);

  const jobPosted = signUser?.role !== "Admin"
    ? postedJobs?.filter((job) => job.userId?.email === signUser?.email)
    : postedJobs
      ?.filter((job) =>
        job.title.toLowerCase().includes(searchTitle.toLowerCase())
      )
      .filter((job) => {
        if (searchRole) {
          return job.userId?.role?.includes(searchRole);
        }
        return true;
      })
      .filter((job) => job.industryId?.industry.includes(searchIndustry));

  const jobPostPerPage = itemsPerPage;
  const lastPostJobIndex = currentPage * jobPostPerPage;
  const firstUserIndex = lastPostJobIndex - jobPostPerPage;
  const currentPostedJobs = jobPosted?.reverse().slice(firstUserIndex, lastPostJobIndex);
  const totalPages = Math.ceil(jobPosted.length / jobPostPerPage);

  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const formatDate = (jobDate) =>
    new Date(jobDate).toLocaleDateString();

  const generatePDF = () => {
    const doc = new jsPDF();
    const formattedDate = new Date().toLocaleString();

    doc.setFontSize(13);
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = "AIG Jobs - Posted Jobs Report";
    const titleX = (pageWidth - doc.getTextWidth(title)) / 2;

    doc.text(title, titleX, 10);
    doc.text(`Generated On: ${formattedDate}`, 14, 20);
    doc.autoTable({
      head: [["Date", "Job Title", "Country", "City", "Industry", "Company Name", "Category", "Posted By"]],
      body: currentPostedJobs.map((job) => [
        formatDate(job.createdAt),
        job.title,
        job.country?.country,
        job.city?.city,
        job.industryId?.industry,
        job.companyName,
        job.categoryId?.category,
        job.userId?.role,
      ]),
      startY: 30,
      headStyles: { fontSize: 8 },
      bodyStyles: { fontSize: 8 },
    });

    doc.save("jobs_report.pdf");
  };

  const generateExcel = () => {
    const headers = [
      "Date",
      "Job Title",
      "Country",
      "City",
      "Industry",
      "Company Name",
      "Category",
      "Posted By",
    ];

    const data = currentPostedJobs.map((job) => [
      formatDate(job.createdAt),
      job.title,
      job.country?.country || "",
      job.city?.city || "",
      job.industryId?.industry || "",
      job.companyName || "",
      job.categoryId?.category || "",
      job.userId?.role || "",
    ]);

    const excelData = [headers, ...data];

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    const columnWidths = headers.map((header, index) => ({
      wch: Math.max(
        header.length,
        ...data.map((row) => (row[index] ? row[index].toString().length : 0)) // Cell content width
      ),
    }));

    worksheet["!cols"] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Posted Jobs");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "jobs_report.xlsx");
  };

  useEffect(() => {
    if (report) {
      if (report === "PDFReport") {
        generatePDF()
      } else {
        generateExcel()
      }
      setReport("")
    }
  }, [report])

  return (
    <>
      <h2>Approved Jobs List</h2>
      <div className="row mb-4 find d-flex">
        <div className="col-md-4 mt-4">
          <input
            type="text"
            className="form-control schoo-search"
            placeholder="Search Job By Title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>
        <div className="col-md-4 mt-4">
          <select onChange={(e) => setSearchRole(e.target.value)} className="role-filter">
            <option value="">&nbsp;Search Job By Role</option>
            <option value="Admin">Admin </option>
            <option value="Editor">Editor</option>
            <option value="Employer">Employer</option>
          </select>
        </div>
        <div className="col-md-4 mt-4">
          <select onChange={(e) => setSearchIndustry(e.target.value)}>
            <option value="">&nbsp;Search Job By Industry</option>
            {jobInd?.map((job, index) => (
              <option key={index} value={job.industry}>
                {job.industry}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p>
          Show{" "}
          <select onChange={(e) => setItemsPerPage(e.target.value)}>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>{" "}
          Entries
        </p>
      </div>

      <div className="table-responsive-sm">
        <table className="admin-table">
          <thead>
            <tr className="form-title">
              <th>#</th>
              <th>Job Title</th>
              <th>Country</th>
              <th>City</th>
              <th>Industry</th>
              {signUser?.role === "Admin" && <th>Posted By</th>}
              <th>Date</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {currentPostedJobs.map((job, index) => (
              <tr key={index}>
                <td>{firstUserIndex + index + 1}</td>
                <td>{job.title}</td>
                <td>{job.country?.country}</td>
                <td>{job.city?.city}</td>
                <td>{job.industryId.industry}</td>
                {signUser?.role === "Admin" && (
                  <td>
                    {job.userId
                      ? `${job.userId.role} - ${job.userId.name}`
                      : "Admin"}
                  </td>
                )}
                <td>{formatDate(job.createdAt)}</td>
                <td>
                  <JobActionModal postedJobId={job._id} />
                  {(signUser?.role === "Admin" || signUser?.role === "Editor") && (
                    <AddDuplicateJob postedJobId={job._id} />
                  )}
                  {signUser?.role === "Admin" && (
                    <>
                      <JobEditModal postedJobId={job._id} />
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => deleteById(job._id)}
                      />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {signUser?.role === "Admin" && (
          <div>
            <select className="form-control mt-4" value="" style={{ width: "20%", border: "1px solid #0d6efd" }} onChange={(e) => setReport(e.target.value)}>
              <option value="">Generate Report</option>
              <option value="PDFReport">PDF Report</option>
              <option value="excelReport">Excel Report</option>
            </select>
          </div>
        )}
      </div>

      {jobPosted.length > jobPostPerPage && (
        <div className="pagination-controls text-center mt-3">
          <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faAnglesLeft} />
          </Button>
          <span className="me-2 ms-2">
            {Math.min(firstUserIndex + 1, jobPosted.length)} to{" "}
            {Math.min(lastPostJobIndex, jobPosted.length)} of {jobPosted.length}
          </span>
          <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
            <FontAwesomeIcon icon={faAnglesRight} />
          </Button>
        </div>
      )}
    </>
  );
}
