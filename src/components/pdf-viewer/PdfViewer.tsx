import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import "pdfjs-dist/web/pdf_viewer.css";

// Material UI
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PdfViewerProps {
  fileUrl: string;
}

export default function PdfViewer({ fileUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => (prev > 1 ? prev - 1 : prev));
  };

  const goToNextPage = () => {
    setPageNumber(prev => (prev < (numPages || 1) ? prev + 1 : prev));
  };

  return (
    <div className="flex relative flex-col items-center w-full h-full">
      <div className="relative group min-h-[690px]">
        <Document 
          file={fileUrl} 
          onLoadSuccess={onDocumentLoadSuccess} 
          className="pdf-viewer-container"
        >
          <Page 
            pageNumber={pageNumber}
            height={690}
            loading={"กำลังโหลดเอกสาร..."}
            noData={"ไม่พบเอกสาร"}
            error={"ไม่สามารถโหลดเอกสารได้"}
          />
        </Document>
        <div className="absolute flex justify-center items-center min-w-[154px] gap-2 bottom-4 left-1/2 -translate-x-1/2 text-[14px] text-gray-600 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
          <IconButton
            className="prev-page-btn"
            sx={{
              borderRadius: "5px",
            }}
            disabled={pageNumber <= 1}
            onClick={goToPrevPage}
          >
            <ChevronLeftIcon />
          </IconButton>
          <p>
            หน้า {pageNumber} / {numPages}
          </p>
          <IconButton
            className="next-page-btn"
            sx={{
              borderRadius: "5px",
            }}
            disabled={pageNumber >= (numPages || 1)}
            onClick={goToNextPage}
          >
            <ChevronRightIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}