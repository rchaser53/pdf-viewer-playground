window.onload = async () => {
  // If absolute URL from the remote server is provided, configure the CORS
  // header on that server.
  const url = '//cdn.mozilla.net/pdfjs/tracemonkey.pdf';

  var pdfDoc = null,
      pageNum = 1,
      pageRendering = false,
      pageNumPending = null,
      scale = 0.8,
      canvas = document.getElementById('the-canvas'),
      canvasContext = canvas.getContext('2d');

  const renderPage = async (num) => {
    pageRendering = true;
    const page = await pdfDoc.getPage(num)
    const viewport = page.getViewport(scale);
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext, viewport
    };
    var renderTask = page.render(renderContext);

    // getter return pending promsie
    await renderTask.promise

    pageRendering = false;
    if (pageNumPending !== null) {
      renderPage(pageNumPending);
      pageNumPending = null;
    }

    document.getElementById('page_num').textContent = num;
  }

  /**
   * If another page rendering in progress, waits until the rendering is
   * finised. Otherwise, executes rendering immediately.
   */
  const queueRenderPage = (num) => {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  const addPrevPage = (id) => {
    const onPrevPage = () => {
      if (pageNum <= 1) {
        return;
      }
      pageNum--;
      queueRenderPage(pageNum);
    }
    document.getElementById(id).addEventListener('click', onPrevPage);
  }

  const addNextPage = (id) => {
    const onNextPage = () => {
      if (pageNum >= pdfDoc.numPages) {
        return;
      }
      pageNum++;
      queueRenderPage(pageNum);
    }
    document.getElementById(id).addEventListener('click', onNextPage);
  }

  addPrevPage('prev')
  addNextPage('next')

  try {
    pdfDoc = await PDFJS.getDocument(url);
    document.getElementById('page_count').textContent = pdfDoc.numPages;
    renderPage(pageNum);

  } catch (err) {
    console.error(err)
  }

}