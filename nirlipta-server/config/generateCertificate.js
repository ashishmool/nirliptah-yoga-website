const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateCertificate = async (user, workshop, enrollmentId) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: "A4", layout: "landscape" });
        const pdfPath = path.join(__dirname, `../certificates/Certificate-${user.name}-${enrollmentId}.pdf`);
        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        // Background and border
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke("#2c3e50"); // Border

        // Title
        doc
            .font("Helvetica-Bold")
            .fontSize(36)
            .fillColor("#2c3e50")
            .text("Certificate of Completion", { align: "center" })
            .moveDown(1);

        // Recipient Name
        doc
            .font("Helvetica")
            .fontSize(24)
            .fillColor("#333")
            .text(`This is to certify that`, { align: "center" })
            .moveDown(0.5)
            .font("Helvetica-Bold")
            .fontSize(28)
            .fillColor("#2980b9")
            .text(user.name, { align: "center" })
            .moveDown(0.5);

        // Workshop details
        doc
            .font("Helvetica")
            .fontSize(20)
            .fillColor("#333")
            .text(`has successfully completed the workshop:`, { align: "center" })
            .moveDown(0.5)
            .font("Helvetica-Bold")
            .fontSize(24)
            .fillColor("#16a085")
            .text(workshop.title, { align: "center" })
            .moveDown(1);

        // Date
        const formattedDate = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        doc
            .font("Helvetica")
            .fontSize(16)
            .fillColor("#333")
            .text(`Awarded on: ${formattedDate}`, { align: "center" })
            .moveDown(1);

        // "Awarded By" Text
        doc
            .font("Helvetica-Bold")
            .fontSize(16)
            .fillColor("#2c3e50")
            .text("Awarded By", { align: "center" })
            .moveDown(0.5);

        // Logo Placement (AFTER "Awarded By")
        const logoPath = path.join(__dirname, "../templates/logo.png");
        doc.image(logoPath, doc.page.width / 2 - 50, doc.y, { width: 100 });
        doc.moveDown(1);

        // Signature
        doc
            .font("Helvetica-Bold")
            .fontSize(16)
            .fillColor("#2c3e50")
            .text("_____________________", { align: "center" })
            .moveDown(0.2)
            .text("Nirlipta Yoga", { align: "center" })

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
