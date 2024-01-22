import saveAsPng from "save-svg-as-png";
import { isDefined } from "../utils";

const dx = 0;
const dy = 0;

const SaveChartAsImage = {
  save(doc, container, background, cb, { drawOnBg, drawOnTop } = {}) {
    saveAsPng.svgAsDataUri(
      container.getElementsByTagName("svg")[0],
      {},
      function (uri) {
        // eslint-disable-next-line prefer-const
        let image = new Image();
        image.onload = function () {
          const canvasList = container.getElementsByTagName("canvas");

          // eslint-disable-next-line prefer-const
          let canvas = doc.createElement("canvas");
          canvas.width = canvasList[0].width;
          canvas.height = canvasList[0].height;

          // eslint-disable-next-line prefer-const
          let context = canvas.getContext("2d");

          if (isDefined(background)) {
            context.fillStyle = background;
            context.fillRect(0, 0, canvas.width, canvas.height);
          }

          if (isDefined(drawOnBg)) {
            drawOnBg({ context, canvas });
          }

          for (let i = 0; i < canvasList.length; i++) {
            const each = canvasList[i];
            if (isDefined(each)) {
              const parent = each.parentNode.parentNode.getBoundingClientRect();
              const rect = each.getBoundingClientRect();
              context.drawImage(
                each,
                rect.left - parent.left + dx,
                rect.top - parent.top + dy,
                each.width,
                each.height,
                0,
                0,
                canvas.width,
                canvas.height
              );
            }
          }

          if (isDefined(drawOnTop)) {
            drawOnTop({ context, canvas });
          }

          context.drawImage(image, dx, dy, canvas.width, canvas.height);
          cb(canvas.toDataURL("image/png"));
        };
        image.src = uri;
      }
    );
  },
  saveWithWhiteBG(doc, container, cb, options) {
    return this.saveWithBG(doc, container, "white", cb, options);
  },
  saveWithDarkBG(doc, container, cb, options) {
    return this.saveWithBG(doc, container, "#0c1229", cb, options);
  },
  saveWithBG(doc, container, background, cb, options) {
    return this.save(doc, container, background, cb, options);
  },
  saveChartAsImage(container, options = { drawOnBg: null, drawOnTop: null }) {
    this.saveWithDarkBG(
      document,
      container,
      function (src) {
        const a = document.createElement("a");
        a.setAttribute("href", src);
        a.setAttribute("download", options.filename || "Chart.png");

        document.body.appendChild(a);
        a.addEventListener("click", function (/* e */) {
          a.parentNode.removeChild(a);
        });

        a.click();
      },
      options
    );
  },
};

export default SaveChartAsImage;
