const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateMobileCertificate = async (user_id, workshop_id, enrollmentId) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: "A4", layout: "portrait" });
        const pdfPath = path.join(__dirname, `../certificates/Mobile-Certificate-${user_id?.name}-${enrollmentId}.pdf`);
        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        // Background Image
        const backgroundPath = path.join(__dirname, "../templates/mobile_certificate.png");
        doc.image(backgroundPath, 0, 0, { width: doc.page.width, height: doc.page.height });

        // Centering Helper
        const pageWidth = doc.page.width;
        const contentWidth = 400;
        const startY = 140;

        // Title
        doc
            .font("Helvetica-Bold")
            .fontSize(24)
            .fillColor("#2c3e50")
            .text("Certificate of Completion", (pageWidth - contentWidth) / 2, startY, { align: "center", width: contentWidth });

        // Recipient Name
        doc
            .font("Helvetica")
            .fontSize(18)
            .fillColor("#333")
            .text("This certifies that", (pageWidth - contentWidth) / 2, doc.y + 20, { align: "center", width: contentWidth })
            .moveDown(0.5)
            .font("Helvetica-Bold")
            .fontSize(22)
            .fillColor("#A38F85")
            .text(user_id.name, (pageWidth - contentWidth) / 2, doc.y, { align: "center", width: contentWidth })
            .moveDown(0.5);

        // Workshop details
        doc
            .font("Helvetica")
            .fontSize(16)
            .fillColor("#333")
            .text("has successfully completed the workshop:", (pageWidth - contentWidth) / 2, doc.y, { align: "center", width: contentWidth })
            .moveDown(0.5)
            .font("Helvetica-Bold")
            .fontSize(20)
            .fillColor("#9B6763")
            .text(workshop_id?.title, (pageWidth - contentWidth) / 2, doc.y, { align: "center", width: contentWidth })
            .moveDown(1);

        // Date
        const formattedDate = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        doc
            .font("Helvetica")
            .fontSize(14)
            .fillColor("#333")
            .text(`Awarded on: ${formattedDate}`, (pageWidth - contentWidth) / 2, doc.y, { align: "center", width: contentWidth })
            .moveDown(1);

        // Signature
        doc
            .font("Helvetica-Bold")
            .fontSize(14)
            .fillColor("#B8978C")
            .text("_____________________", (pageWidth - contentWidth) / 2, doc.y, { align: "center", width: contentWidth })
            .moveDown(0.2)
            .text("Nirlipta Yoga", (pageWidth - contentWidth) / 2, doc.y, { align: "center", width: contentWidth });

        doc.end();

        stream.on("finish", () => {
            resolve(pdfPath);
        });

        stream.on("error", (err) => {
            reject(err);
        });
    });
};

module.exports = generateMobileCertificate;
