import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const ResumePreview = ({ url, compiling }) => {

  const [numPages, setNumPages] = useState(null)
  const [scale, setScale]  = useState(1.1);

  if (compiling) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Updating preview...
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Start filling form to see preview
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center bg-gray-900 overflow-auto py-4">

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
          className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
        >
          −
        </button>
        <button
          onClick={() => setScale((s) => Math.min(2, s + 0.1))}
          className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
        >
          +
        </button>
      </div>

      <Document
        file = {url}
        onLoadSuccess={({ numPages})=>setNumPages(numPages)}
        loading = {
          <div className="text-gray-400">Loading PDF...</div>
        }
        externalLinkTarget="_blank"
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={index}
            pageNumber={index + 1}
            scale={scale}
            className="mb-6 shadow-lg"
            renderTextLayer={false}
            renderAnnotationLayer={true}

          />
        ))}
      </Document>
    </div>
  );
};

export default ResumePreview;