import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url
).toString();

export default function App() {
	const [numPages, setNumPages] = useState(null);

	const handleDownload = () => {
		const link = document.createElement("a");
		link.href = "/Resume-Dhanush-2.pdf";
		link.download = "Resume-Dhanush-2.pdf";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Optionally modify link behavior for all <a> inside annotation layer
	React.useEffect(() => {
		const handler = (e) => {
			// Only open external links in a new tab
			if (e.target.tagName === 'A' && e.target.href) {
				e.target.setAttribute('target', '_blank');
				e.target.setAttribute('rel', 'noopener noreferrer');
			}
		};
		document.addEventListener('mouseover', handler, true);
		return () => document.removeEventListener('mouseover', handler, true);
	}, []);

	return (
		<div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
			<TransformWrapper
				initialScale={1}
				minScale={0.5}
				maxScale={4}
				centerOnInit={true}  // Add this
			>

				{({ zoomIn, zoomOut, resetTransform }) => (
					<>
						<div style={{
							position: "fixed",
							top: 10,
							right: 10,
							zIndex: 1000,
							display: "flex",
							gap: "10px"
						}}>
							<button onClick={() => zoomIn()}>+</button>
							<button onClick={() => zoomOut()}>-</button>
							<button onClick={() => resetTransform()}>Reset</button>
							<button onClick={handleDownload}>Download</button>
						</div>

						<TransformComponent
							wrapperStyle={{
								width: "100vw",
								height: "100vh",
								background: "#1a1a1a",
							}}
							contentStyle={{
								width: "100%",
								height: "100%",
								display: "flex",
								alignItems: "center",      // Centers vertically
								justifyContent: "center",  // Centers horizontally
							}}

						>
							{/* PDF Container - this is the key addition */}
							<div style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: "10px" // Space between pages
							}}>
								<Document
									file="/Resume-Dhanush-2.pdf"
									onLoadSuccess={({ numPages }) => setNumPages(numPages)}
								>
									{Array.from(new Array(numPages), (el, index) => (
										<Page
											key={`page_${index + 1}`}
											pageNumber={index + 1}
											width={Math.min(window.innerWidth * 0.7, 800)}
											renderTextLayer={false}
											renderAnnotationLayer={true}
										/>
									))}
								</Document>
							</div>
						</TransformComponent>
					</>
				)}
			</TransformWrapper>
		</div>
	);
}