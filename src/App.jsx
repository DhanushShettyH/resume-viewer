import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Vite-specific worker configuration
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url
).toString();

export default function App() {
	const [numPages, setNumPages] = useState(null);

	return (
		<div style={{ width: "100%", height: "100vh", overflow: "auto" }}>
			<Document
				file="/Resume-Dhanush-2.pdf"
				onLoadSuccess={({ numPages }) => setNumPages(numPages)}
			>
				{Array.from(new Array(numPages), (el, index) => (
					<Page
						key={`page_${index + 1}`}
						pageNumber={index + 1}
						width={window.innerWidth > 768 ? 800 : window.innerWidth - 20}
						renderTextLayer={false}
						renderAnnotationLayer={false}
					/>
				))}
			</Document>
		</div>
	);
}
