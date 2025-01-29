import { useContext, useEffect, useState } from "react";
import ResumeContext from "../ContextApi/ResumeContext";
import UserContext from "../ContextApi/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import ViewResumeModal from "./ViewResumeModal";
import { Button } from "react-bootstrap";
import EditResume from "./EditResume";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import 'jspdf-autotable';

function Resume() {
  const { getAllResume, delResumeById } = useContext(ResumeContext);
  const [report, setReport] = useState("")
  const { signUser } = useContext(UserContext);
  const [searchName, setSearchName] = useState("")
  const [searchProfession, setSearchProfession] = useState("")
  const filteredResume = signUser?.role === "Admin" ? getAllResume?.filter(resume => resume.name.toLowerCase().includes(searchName.toLowerCase())).filter(resume => resume.profession?.toLowerCase().includes(searchProfession.toLowerCase())) : getAllResume?.filter(resume => resume.email === signUser.email).filter(resume => resume.name.toLowerCase().includes(searchName.toLowerCase())).filter(resume => resume.profession?.toLowerCase().includes(searchProfession.toLowerCase()));

  // Pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const resumePerPage = itemsPerPage;

  const lastIndex = currentPage * resumePerPage;
  const firstIndex = lastIndex - resumePerPage;
  const currentItems = filteredResume?.reverse().slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(filteredResume.length / resumePerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    doc.setFontSize(13);

    const title = "AIG Jobs - Resume Report";
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 10);

    doc.text(`Generated On: ${formattedDate}`, 14, 20);

    doc.autoTable({
      head: [["Name", "Email", "Contact", "Profession", "Total Work Experience"]],
      body: currentItems.map(resume => [
        resume.name,
        resume.email,
        resume.number,
        resume.profession,
        resume.totalWorkExp,
      ]),
      startY: 30,
      headStyles: { fontSize: 8 },
      bodyStyles: { fontSize: 8 },
    });

    doc.save("jobs_report.pdf");
  };

  const generateExcel = () => {
    const headers = [
      "Name", "Email", "Contact", "Profession", "Total Work Experience"
    ];

    const data = currentItems.map(resume => [
      resume.name,
      resume.email,
      resume.number,
      resume.profession,
      resume.totalWorkExp,
    ]);

    const excelData = [headers, ...data];

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    const columnWidths = headers.map((header, index) => ({
      wch: Math.max(
        header.length,
        ...data.map((row) => (row[index] ? row[index].toString().length : 0))
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
      <div className="row mb-4 find d-flex">
        <h2>All Resumes List</h2>
        <div className="col-md-4 mt-4">
          <input
            type="text"
            className="form-control schoo-search"
            placeholder="Search Resume By Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-md-4 mt-4">
          <input
            type="text"
            className="form-control schoo-search"
            placeholder="Search Resume By Profession"
            value={searchProfession}
            onChange={(e) => setSearchProfession(e.target.value)}
          />
        </div>
      </div>
      <div>
        <p>Show <select name="" id="" onChange={(e) => setItemsPerPage(e.target.value)}>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select> Entries</p>
      </div>

      <div className="table-responsive-sm">
        <table className="admin-table">
          <thead>
            <tr className="form-title">
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Profession</th>
              <th>Total Work Experience</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((resume, index) => {
              return (
                <tr key={index}>
                  <td>{firstIndex + index + 1}</td>
                  <td>{resume.name}</td>
                  <td>{resume.email}</td>
                  <td>{resume.number}</td>
                  <td>{resume.profession}</td>
                  <td>{resume.totalWorkExp}</td>
                  <td>
                    <ViewResumeModal resId={resume._id} />
                    <EditResume resId={resume._id} />
                    <FontAwesomeIcon icon={faTrash} onClick={() => delResumeById(resume._id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {signUser?.role === "Admin" && (
          <select className="form-control mt-4" value="" style={{ width: "20%", border: "1px solid #0d6efd" }} onChange={(e) => setReport(e.target.value)}>
            <option value="">Generate Report</option>
            <option value="PDFReport">PDF Report</option>
            <option value="excelReport">Excel Report</option>
          </select>
        )}
      </div>

      {/* {/ Pagination Controls /} */}
      {getAllResume?.length > resumePerPage && (
        <div className="pagination-controls mt-3">
          <Button onClick={goToPrevPage} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faAnglesLeft} />
          </Button>
          <span className="me-2 ms-2">Page {currentPage} of {totalPages}</span>
          <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
            <FontAwesomeIcon icon={faAnglesRight} />
          </Button>
        </div>
      )}
    </>
  );
}

export default Resume;
