import { useEffect, useState } from "react";
import PdfCvContext from "./PdfCvContext";
import PropTypes from "prop-types";

export default function PdfCvProvider({ children }) {
    const [allPdfCvs, setAllPdfCvs] = useState([])
    const apiUrl = import.meta.env.VITE_API_URL;
    const getALlPdfCvs = async () => {
        const res = await fetch(`${apiUrl}/api/pdfCv/getPdfCv`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        setAllPdfCvs(data)
    }

    useEffect(() => {
        getALlPdfCvs()
    }, [])

    return (
        <PdfCvContext.Provider value={{ getALlPdfCvs, allPdfCvs }}>
            {children}
        </PdfCvContext.Provider>
    )
}

PdfCvProvider.propTypes = {
    children: PropTypes.node.isRequired,
};