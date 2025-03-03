const Enrollment = require("../models/Enrollment");
const User = require("../models/User");
const Workshop = require("../models/Workshop");
const Schedule = require("../models/Schedule");
const nodemailer = require("nodemailer");
const generateCertificate = require("../middleware/generateCertificate");
const generateMobileCertificate = require("../middleware/generateCertificate");
const path = require("path");



// Get all enrollments
const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate("user_id workshop_id"); // Populate related collections

        res.json({
            enrollments,
            count: enrollments.length
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching enrollments", error });
    }
};


// Generate Certificate
const getCertificationByStatus = async (req, res) => {
    try {
        // Fetch all completed enrollments
        const completedEnrollments = await Enrollment.find({ completion_status: "completed" })
            .populate("user_id workshop_id");

        if (!completedEnrollments.length) {
            return res.status(404).json({ message: "No completed enrollments found." });
        }

        // Email transporter setup
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Process each completed enrollment
        for (const enrollment of completedEnrollments) {
            const { user_id, workshop_id } = enrollment;

            // Generate PDF certificate using the new template
            const pdfPath = await generateCertificate(user_id, workshop_id, enrollment._id);

            const emailTemplate = `
            <html>
            <body style="font-family: Arial, sans-serif; text-align: center;">
                <h2>Congratulations ${user_id.name}!</h2>
                <p>You have successfully completed the workshop: <strong>${workshop_id.title}</strong></p>
                <p>Your certificate is attached to this email.</p>
            </body>
            </html>`;

            // Email options with attachment
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user_id.email,
                subject: "Workshop Certification",
                html: emailTemplate,
                attachments: [
                    {
                        filename: `Certificate-${user_id.name}.pdf`,
                        path: pdfPath,
                        contentType: "application/pdf",
                    },
                ],
            };

            // Send email
            await transporter.sendMail(mailOptions);
        }

        res.json({
            message: "Certification emails with PDFs sent successfully",
            count: completedEnrollments.length,
        });
    } catch (error) {
        console.error("Error sending certification emails:", error);
        res.status(500).json({ message: "Error sending certification emails", error });
    }
};

const generateCertificateByUserWorkshop = async (req, res) => {
    try {
        const { user_id, workshop_id } = req.params;

        // Validate input parameters
        if (!user_id || !workshop_id) {
            return res.status(400).json({ message: "User ID and Workshop ID are required." });
        }

        // Find the specific enrollment with completion status 'completed'
        const enrollment = await Enrollment.findOne({ user_id, workshop_id, completion_status: "completed" })
            .populate("user_id workshop_id");

        if (!enrollment) {
            return res.status(404).json({ message: "No completed enrollment found for this user and workshop." });
        }

        // Generate the PDF certificate
        const pdfPath = await generateMobileCertificate(enrollment.user_id, enrollment.workshop_id, enrollment._id);

        // Email setup
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const emailTemplate = `
        <html>
        <body style="font-family: Arial, sans-serif; text-align: center;">
            <h2>Congratulations ${enrollment.user_id.name}!</h2>
            <p>You have successfully completed the workshop: <strong>${enrollment.workshop_id.title}</strong></p>
            <p>Your certificate is attached to this email.</p>
        </body>
        </html>`;

        // Send email with certificate
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: enrollment.user_id.email,
            subject: "Workshop Certification",
            html: emailTemplate,
            attachments: [
                {
                    filename: `Certificate-${enrollment.user_id.name}.pdf`,
                    path: pdfPath,
                    contentType: "application/pdf",
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        res.json({
            message: "Certification email sent successfully",
            pdfPath,
        });
    } catch (error) {
        console.error("Error generating certificate:", error);
        res.status(500).json({ message: "Error generating certificate", error });
    }
};





// Get enrollment by ID
const getEnrollmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const enrollment = await Enrollment.findById(id)
            .populate("user_id workshop_id");
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching enrollment by ID", error });
    }
};

// Create a new enrollment
const createEnrollment = async (req, res) => {
    try {
        const { user_id, workshop_id } = req.body;

        if (!user_id || !workshop_id) {
            return res.status(400).json({ message: "User ID and Workshop ID are required." });
        }

        // Check if user exists
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if workshop exists
        const workshop = await Workshop.findById(workshop_id);
        if (!workshop) {
            return res.status(404).json({ message: "Workshop not found." });
        }

        // Check if a schedule exists for this workshop
        const schedule = await Schedule.findOne({ workshop_id });
        if (!schedule) {
            return res.status(400).json({ message: "No schedule available for this workshop." });
        }

        // Check if user is already enrolled in this workshop
        const existingEnrollment = await Enrollment.findOne({ user_id, workshop_id });
        if (existingEnrollment) {
            return res.status(400).json({ message: "User is already enrolled in this workshop." });
        }

        // Create the enrollment
        const enrollment = new Enrollment({
            user_id,
            workshop_id,
            payment_status: "pending",
        });

        // Save enrollment
        await enrollment.save();

        res.status(201).json({ message: "Enrollment created successfully", enrollment });
    } catch (error) {
        console.error("Error creating enrollment:", error);
        res.status(500).json({ message: "Error creating enrollment", error });
    }
};



// Check if a user is already enrolled in a specific workshop
const checkEnrollmentStatus = async (req, res) => {
    try {
        const { user_id, workshop_id } = req.params;

        if (!user_id || !workshop_id) {
            return res.status(400).json({ message: "User ID and Workshop ID are required." });
        }

        // Check if the user is enrolled in this specific workshop
        const enrollment = await Enrollment.findOne({ user_id, workshop_id });

        res.json({ enrolled: !!enrollment });
    } catch (error) {
        console.error("Error checking enrollment status:", error);
        res.status(500).json({ message: "Error checking enrollment status", error });
    }
};

// Update enrollment by ID (PUT)
const updateEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, workshop_id } = req.body;

        // Check if the user exists
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the workshop exists
        const workshop = await Workshop.findById(workshop_id);
        if (!workshop) {
            return res.status(404).json({ message: "Workshop not found." });
        }

        // Check if the user is already enrolled in the workshop
        const existingEnrollment = await Enrollment.findOne({ user_id, workshop_id });
        if (existingEnrollment && existingEnrollment._id.toString() !== id) {
            return res.status(400).json({ message: "User is already enrolled in this workshop." });
        }

        const updatedEnrollment = await Enrollment.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Run validation on the update
        });
        if (!updatedEnrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }
        res.json({ message: "Enrollment updated successfully", updatedEnrollment });
    } catch (error) {
        res.status(500).json({ message: "Error updating enrollment", error });
    }
};

// Delete enrollment by ID
const deleteEnrollment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEnrollment = await Enrollment.findByIdAndDelete(id); // Find and delete by ID
        if (!deletedEnrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        // Remove the workshop from the user's enrolled workshops array
        const user = await User.findById(deletedEnrollment.user_id);
        if (user) {
            user.enrolled_workshops = user.enrolled_workshops.filter(workshopId => workshopId.toString() !== deletedEnrollment.workshop_id.toString());
            await user.save();
        }

        res.json({ message: "Enrollment deleted successfully", deletedEnrollment });
    } catch (error) {
        res.status(500).json({ message: "Error deleting enrollment", error });
    }
};

// Get enrollments by user ID
const getEnrollmentByUserId = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const enrollments = await Enrollment.find({ user_id })
            .populate("workshop_id", "title description category photo difficulty_level price discount_price");

        if (!enrollments.length) {
            return res.status(404).json({ message: "No enrollments found for this user." });
        }
        res.json(enrollments);
    } catch (error) {
        console.error("Error fetching enrollments by user ID:", error);
        res.status(500).json({ message: "Error fetching enrollments", error });
    }
};


// Update enrollment by ID (PATCH) - Partial Update
const updateEnrollmentPatch = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body; // Only update fields provided in the request

        // Find and update the enrollment with the provided fields
        const updatedEnrollment = await Enrollment.findByIdAndUpdate(id, { $set: updateFields }, {
            new: true, // Return the updated document
            runValidators: true // Ensure validation rules are applied
        });

        if (!updatedEnrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        res.json({ message: "Enrollment updated successfully", updatedEnrollment });
    } catch (error) {
        console.error("Error updating enrollment (PATCH):", error);
        res.status(500).json({ message: "Error updating enrollment", error });
    }
};

module.exports = {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    checkEnrollmentStatus,
    getEnrollmentByUserId,
    updateEnrollmentPatch,
    getCertificationByStatus,
    generateCertificateByUserWorkshop,
};