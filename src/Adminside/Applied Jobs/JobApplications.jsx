import { useContext, useEffect, useState } from "react"
import JobApplyContext from "../../ContextApi/JobApplyContext"
import JobApplyViewModal from "./JobApplyViewModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesLeft, faAnglesRight, faTrash } from "@fortawesome/free-solid-svg-icons"
import { Button } from "react-bootstrap"
import UserContext from "../../ContextApi/UserContext"
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import 'jspdf-autotable';
// import JobApplyEditModal from "./JobApplyEditModal"

export default function JobApplications() {
    const { getAppliedJobs, deleteApplicationById } = useContext(JobApplyContext)
    const [searchProfession, setSearchProfession] = useState("")
    const [searchName, setSearchName] = useState("")
    const { signUser } = useContext(UserContext)
    const [report, setReport] = useState("")
    const filterAppliedJobs = getAppliedJobs?.filter(applyJob => applyJob.name.toLowerCase().includes(searchName.toLowerCase())).filter(applyJob => applyJob.profession.toLowerCase().includes(searchProfession.toLowerCase()))
    // pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(25)
    const applicationPerPage = itemsPerPage

    const lastUserIndex = currentPage * applicationPerPage
    const firstApplicationIndex = lastUserIndex - applicationPerPage
    const currentApplications = filterAppliedJobs?.slice(firstApplicationIndex, lastUserIndex).reverse()

    const totalPages = Math.ceil(filterAppliedJobs?.length / applicationPerPage)

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
    }
    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
    }

    const generatePDF = () => {
        const doc = new jsPDF();
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
        const pageWidth = doc.internal.pageSize.getWidth();
        const title = "AIG Jobs - Job Applications Report";
        const titleWidth = doc.getTextWidth(title);
        const titleX = (pageWidth - titleWidth) / 2;
        doc.text(title, titleX, 10);
        doc.text(`Generated On: ${formattedDate}`, 14, 20);

        doc.autoTable({
            head: [["Name", "Email", "Contact", "Job Title", "Profession"]],
            body: currentApplications.map(jobApp => [
                jobApp.name,
                jobApp.email,
                jobApp.number,
                jobApp.jobId?.title,
                jobApp.profession,
            ]),
            startY: 30,
            headStyles: { fontSize: 8 },
            bodyStyles: { fontSize: 8 },
        });

        doc.save("jobs_report.pdf");
    };

    const generateExcel = () => {
        const headers = [
            "Name", "Email", "Contact", "Job Title", "Profession"
        ];

        const data = currentApplications.map((jobApp) => [
            jobApp.name,
            jobApp.email,
            jobApp.number,
            jobApp.jobId?.title,
            jobApp.profession,
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
            <h2>Job Applications List</h2>
            <div className="row mb-4 find d-flex">

                <div className="col-md-4 mt-4">
                    <input
                        type="text"
                        className="form-control schoo-search"
                        placeholder="Search application by name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
                <div className="col-md-4 mt-4">
                    <input
                        type="text"
                        className="form-control schoo-search"
                        placeholder="Search application by profession"
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
                    <thead >
                        <tr className="form-title">
                            <th>#</th>
                            <th>Applicant Name</th>
                            <th>Job Title</th>
                            <th>Profession</th>
                            <th>Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentApplications?.map((applyJob, index) => (
                            <tr key={index}>
                                <td>{firstApplicationIndex + index + 1}</td>
                                <td>{applyJob.name}</td>
                                <td>{applyJob.jobId?.title}</td>
                                <td>{applyJob.profession}</td>
                                <td>
                                    <JobApplyViewModal applyJobId={applyJob._id} />
                                    <FontAwesomeIcon icon={faTrash} onClick={() => deleteApplicationById(applyJob._id)} />
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
            {signUser?.role === "Admin" && (
                <select className="form-control mt-4" value="" style={{ width: "20%", border: "1px solid #0d6efd" }} onChange={(e) => setReport(e.target.value)}>
                    <option value="">Generate Report</option>
                    <option value="PDFReport">PDF Report</option>
                    <option value="excelReport">Excel Report</option>
                </select>
            )}

            {filterAppliedJobs?.length > applicationPerPage && (
                <div className="pagination-controls mt-3">
                    <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
                        <FontAwesomeIcon icon={faAnglesLeft} />
                    </Button>
                    <span className="me-2 ms-2">Page {currentPage} of {totalPages}</span>
                    <Button onClick={goToNextPage} disabled={currentPage === totalPages}>
                        <FontAwesomeIcon icon={faAnglesRight} />
                    </Button>
                </div>
            )}
        </>
    )
}
