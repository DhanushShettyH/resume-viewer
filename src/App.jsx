import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import 'react-pdf/dist/Page/AnnotationLayer.css'; // <---- IMPORTANT!

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
				centerOnInit={true}
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
								width: "100%",
								height: "100vh"
							}}
							contentStyle={{
								width: "100%"
							}}
						>
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
										renderAnnotationLayer={true}    // <-- make links clickable
									/>
								))}
							</Document>
						</TransformComponent>
					</>
				)}
			</TransformWrapper>
		</div>
	);
}
