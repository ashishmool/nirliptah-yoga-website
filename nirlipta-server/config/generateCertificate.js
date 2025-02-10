const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateCertificate = async (user, workshop, enrollmentId) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: "A4", layout: "landscape" });
        const pdfPath = path.join(__dirname, `../certificates/Certificate-${user.name}-${enrollmentId}.pdf`);
        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        // Background Image (Fixed & Centered)
        const backgroundPath = path.join(__dirname, "../templates/certificate.png");
        doc.image(backgroundPath, 0, 0, { width: doc.page.width, height: doc.page.height });

        // Centering Helper
        const pageWidth = doc.page.width;
        const contentWidth = 500; // Keep all text inside this width
        const startY = 160; // Start content lower to avoid logo overlap

        // Title (Smaller & Centered)
        doc
            .font("Helvetica-Bold")
            .fontSize(28) // Smaller to fit in one line
            .fillColor("#2c3e50")
            .text("Certificate of Completion", (pageWidth - contentWidth) / 2, startY, { align: "center", width: contentWidth });

        // Recipient Name
        doc
            .font("Helvetica")
            .fontSize(20)
            .fillColor("#333")
            .text("This is to certify that", (pageWidth - contentWidth) / 2, doc.y + 20, { align: "center", width: contentWidth })
            .moveDown(0.5)
            .font("Helvetica-Bold")
            .fontSize(26)
            .fillColor("#A38F85")
            .text(user.name, (pageWidth - contentWidth) / 2, doc.y, { align: "center", width: contentWidth })
            .moveDown(0.5);

        // Workshop details (Fixed Alignment)
        doc
            .font("Helvetica")
            .fontSize(18)
            .fillColor("#333")
            .text("has successfully completed the workshop:", (pageWidth - contentWidth) / 2, doc.y, { align: "center", width: contentWidth })
            .moveDown(0.5)
            .font("Helvetica-Bold")
            .fontSize(22)
            .fillColor("#9B6763")
            .text(workshop.title, (pageWidth - contentWidth) / 2, doc.y, { align: "center", width: contentWidth })
            .moveDown(1);

        // Date (Fixed Position)
        const formattedDate = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        doc
            .font("Helvetica")
            .fontSize(16)
            .fillColor("#333")
            .text(`Awarded on: ${formattedDate}`, (pageWidth - contentWidth) / 2, doc.y, { align: "center", width: contentWidth })
            .moveDown(1);

        // Signature (Fixed Alignment)
        doc
            .font("Helvetica-Bold")
            .fontSize(16)
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

module.exports = generateCertificate;
