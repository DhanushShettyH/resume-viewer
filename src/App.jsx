import React, { useState, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url
).toString();

export default function App() {
	const [numPages, setNumPages] = useState(null);
	const [zoom, setZoom] = useState(1); // current zoom from TransformWrapper
	const [pageSize, setPageSize] = useState({ width: 595, height: 842 }); // A4 default in pt (PDF points)
	const [useSvg, setUseSvg] = useState(false); // toggle SVG rendering for vector-sharp zoom

	const handleDownload = () => {
		const link = document.createElement("a");
		link.href = "/Resume-Dhanush-2.pdf";
		link.download = "Resume-Dhanush-2.pdf";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Fit page to about 70% viewport width at zoom=1
	const baseScale = useMemo(() => {
		const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
		const targetWidthPx = Math.min(vw * 0.7, 800); // desired CSS width
		// PDF points to CSS px: react-pdf uses 1 scale ~= 1 CSS px per 1/72in point.
		// So to reach targetWidthPx, baseScale = targetWidthPx / pageWidthPt
		return targetWidthPx / pageSize.width;
	}, [pageSize.width]);

	// Clamp to avoid excessive memory usage on huge zooms
	const effectiveScale = Math.min(baseScale * zoom, 3); // cap at 3x canvas scale

	return (
		<div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
			<TransformWrapper
				initialScale={1}
				minScale={0.5}
				maxScale={4}
				centerOnInit={true}
				onTransformed={({ state }) => setZoom(state.scale)}
			>
				{({ zoomIn, zoomOut, resetTransform }) => (
					<>
						<div
							style={{
								position: "fixed",
								top: 10,
								right: 10,
								zIndex: 1000,
								display: "flex",
								gap: "10px",
							}}
						>
							<button onClick={() => zoomIn()}>+</button>
							<button onClick={() => zoomOut()}>-</button>
							<button onClick={() => resetTransform()}>Reset</button>
							<button onClick={handleDownload}>Download</button>
							<label style={{ display: "flex", alignItems: "center", gap: 6 }}>
								<input
									type="checkbox"
									checked={useSvg}
									onChange={(e) => setUseSvg(e.target.checked)}
								/>
								SVG mode
							</label>
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
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: "10px",
								}}
							>
								<Document
									file="/Resume-Dhanush-2.pdf"
									onLoadSuccess={({ numPages, _pdfInfo }) => {
										setNumPages(numPages);
										// Try to infer first page size in pt when available
										// Some builds expose _pdfInfo, but if not, we keep defaults
									}}
									onItemClick={(e) => {
										// keep default behavior; annotation links already target _blank via your effect
									}}
									onLoadError={(e) => console.error(e)}
								>
									{Array.from(new Array(numPages || 0), (_, index) => (
										<Page
											key={`page_${index + 1}`}
											pageNumber={index + 1}
											// IMPORTANT: use scale instead of width so it re-renders at higher DPI with zoom
											scale={effectiveScale}
											renderMode={useSvg ? "svg" : "canvas"}
											renderTextLayer={false}
											renderAnnotationLayer={true}
											onLoadSuccess={(page) => {
												// Update page size from first page (in points)
												if (index === 0 && page?.originalWidth && page?.originalHeight) {
													setPageSize({
														width: page.originalWidth,
														height: page.originalHeight,
													});
												}
											}}
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
