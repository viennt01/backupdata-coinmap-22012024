import style from './index.module.scss';
import { useEffect, useState, useRef, useCallback } from 'react';
import pdfjs, { PDFDocumentProxy } from 'pdfjs-dist';
import {
  LeftOutlined,
  RightOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Spin } from 'antd';

const SCALE_MIN = 0.3;
const SCALE_MAX = 5;

interface PdfViewerProps {
  url?: string;
}

const PdfViewer = ({ url }: PdfViewerProps) => {
  const [pdf, setPDF] = useState<PDFDocumentProxy>();
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderPage = useCallback(
    async ({
      pdfDoc,
      pageNum,
      scale,
    }: {
      pdfDoc?: PDFDocumentProxy;
      pageNum: number;
      scale: number;
    }) => {
      if (!canvasRef.current || !pdfDoc) return;
      try {
        const page = await pdfDoc.getPage(pageNum);
        const ctx = canvasRef.current.getContext('2d');
        const viewport = page.getViewport({ scale });

        canvasRef.current.width = viewport.width;
        canvasRef.current.height = viewport.height;

        page.render({
          canvasContext: ctx as CanvasRenderingContext2D,
          viewport: viewport,
        });
      } catch (e) {
        console.error(e);
      }
    },
    []
  );

  const prevPage = () => {
    if (currentPage > 1) {
      renderPage({ pdfDoc: pdf, pageNum: currentPage - 1, scale });
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < numPages) {
      renderPage({ pdfDoc: pdf, pageNum: currentPage + 1, scale });
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomOut = () => {
    const newScale = Number((scale - 0.1).toFixed(1));
    if (newScale < SCALE_MIN) return;
    renderPage({ pdfDoc: pdf, pageNum: currentPage, scale: newScale });
    setScale(newScale);
  };

  const zoomIn = () => {
    const newScale = Number((scale + 0.1).toFixed(1));
    if (newScale > SCALE_MAX) return;
    renderPage({ pdfDoc: pdf, pageNum: currentPage, scale: newScale });
    setScale(newScale);
  };

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        if (!url) return;
        const loadingTask = pdfjs.getDocument(url);
        const pdfDoc = await loadingTask.promise;
        setPDF(pdfDoc);
        setNumPages(pdfDoc.numPages);
        renderPage({ pdfDoc, pageNum: 1, scale: 1 });
        setLoaded(true);
      } catch (e) {
        console.error(e);
      }
    };

    fetchPdf();
  }, [renderPage, url]);

  return (
    <div className={style.pdfWrapper}>
      <div className={style.menuBar}>
        <div className={style.pagination}>
          <Button
            className={style.actionButton}
            type="text"
            disabled={currentPage === 1}
            onClick={prevPage}
          >
            <LeftOutlined />
          </Button>
          <div>
            Trang {currentPage} / {numPages}
          </div>
          <Button
            className={style.actionButton}
            type="text"
            disabled={currentPage === numPages}
            onClick={nextPage}
          >
            <RightOutlined />
          </Button>
        </div>
        <div className={style.verticalDivider}></div>
        <div className={style.zoom}>
          <Button
            className={style.actionButton}
            type="text"
            disabled={scale <= SCALE_MIN}
            onClick={zoomOut}
          >
            <MinusOutlined />
          </Button>

          <div>{(scale * 100).toFixed(0)}%</div>

          <Button
            className={style.actionButton}
            type="text"
            disabled={scale >= SCALE_MAX}
            onClick={zoomIn}
          >
            <PlusOutlined />
          </Button>
        </div>
      </div>

      <div className={style.pdfContent}>
        {!loaded && (
          <Spin size="large" style={{ marginTop: 'calc(50vh - 60px)' }} />
        )}
        <canvas hidden={!loaded} ref={canvasRef} />
      </div>
    </div>
  );
};

export default PdfViewer;
